import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Kasir from './Kasir';
import Navbar from './navbar';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { jwtDecode } from 'jwt-decode';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    // Ambil cart dari localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenisFilter, setJenisFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/menu/getAll', config);
        setMenu(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to fetch menu");
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    // Simpan cart ke localStorage setiap kali cart berubah
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id_menu === item.id_menu);
    if (existingItem) {
      setCart(
        cart.map(cartItem =>
          cartItem.id_menu === item.id_menu
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleIncreaseQuantity = (cartItem) => {
    setCart(
      cart.map(item =>
        item.id_menu === cartItem.id_menu
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (cartItem) => {
    if (cartItem.quantity > 1) {
      setCart(
        cart.map(item =>
          item.id_menu === cartItem.id_menu
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      handleRemoveFromCart(cartItem);
    }
  };

  const handleRemoveFromCart = (cartItem) => {
    setCart(cart.filter(item => item.id_menu !== cartItem.id_menu));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.harga * item.quantity, 0).toFixed(2);
  };

  const handleModalSubmit = () => {
    if (namaPelanggan) {
      handleCheckout();
      setIsModalOpen(false);
    } else {
      alert('Please enter customer name');
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token not found. Please log in again.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const id_user = decodedToken.id_user;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const detailTransaksi = cart.map(item => ({
      id_menu: item.id_menu,
      harga: item.harga,
      jumlah: item.quantity
    }));

    const transactionData = {
      id_user,
      nama_pelanggan: namaPelanggan,
      total_harga: getTotalPrice(),
      detail_transaksi: detailTransaksi,
    };

    try {
      const response = await axios.post('http://localhost:8000/transaksi/add', transactionData, config);
      console.log('Transaction successful:', response.data);
      alert('Transaction successful!');
      setCart([]); // Kosongkan cart setelah transaksi berhasil
      localStorage.removeItem('cart'); // Hapus cart dari localStorage
      navigate('/kasir/menu');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete the transaction. Please try again.');
    }
  };

  // Filtering menu berdasarkan jenis
  const filteredMenu = jenisFilter
    ? menu.filter(item => item.jenis === jenisFilter)
    : menu;

  return (
    <div className="relative min-h-screen flex bg-slate-600">
      <Navbar />
      <Kasir />
      <div className="w-3/4 py-20 ml-80">
        {/* Dropdown untuk filtering jenis menu */}
        <div className="flex justify-end mb-4">
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredMenu.map((item) => (
            <div className="bg-white p-5 rounded-xl shadow-sm" key={item.id_menu}>
              <img
                className="w-full h-80 object-cover object-top drop-shadow-[0_80px_30px_#0007]"
                src={`http://localhost:8000/image/${item.gambar}`}
                alt={item.nama_menu}
              />
              <h3 className="text-2xl py-3 text-center font-medium">{item.nama_menu}</h3>
              <p className="text-l py-3 text-center font-medium">{item.deskripsi}</p>
              <p className="text-l py-3 text-center font-medium">{item.jenis}</p>
              <div className='flex justify-between items-center'>
                <p className='font-bold'>
                  Rp. <span className='text-2xl font-medium'>{item.harga}</span>
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className='bg-gray-300 p-2 rounded-md text-sm hover:bg-gray-400 flex items-center gap-2'
                >
                  <div className='w-5'>
                    <CiShoppingCart />
                  </div>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="fixed top-5 right-5 w-12 h-12 bg-yellow-500 rounded-full shadow-lg z-50 flex items-center justify-center"
          onClick={toggleCart}
        >
          <CiShoppingCart size={24} className="w-6 h-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </button>

        <div
          className={`fixed top-20 right-0 bg-white w-80 shadow-lg transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-5">
            <h2 className="text-2xl font-medium">Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              cart.map((cartItem) => (
                <div key={cartItem.id_menu} className="flex justify-between items-center py-2">
                  <img src={`http://localhost:8000/image/${cartItem.gambar}`} alt="" className="w-12" />
                  <span>{cartItem.nama_menu} (x{cartItem.quantity})</span>
                  <span>${cartItem.harga * cartItem.quantity}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleIncreaseQuantity(cartItem)}><FaPlus /></button>
                    <button onClick={() => handleDecreaseQuantity(cartItem)}><FaMinus /></button>
                    <button onClick={() => handleRemoveFromCart(cartItem)}><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-between py-2 font-bold">
              <span>Total:</span>
              <span>${getTotalPrice()}</span>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-2"
              onClick={() => setIsModalOpen(true)}
            >
              Checkout
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg">
              <h2 className="text-2xl mb-4">Enter Customer Name</h2>
              <input
                type="text"
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                className="border rounded-md w-full p-2"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
