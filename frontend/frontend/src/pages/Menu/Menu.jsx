import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fungsi untuk mengambil data produk
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/getAlll'); // Ganti dengan URL API kamu
        setMenu(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []); // Dependency array kosong agar hanya dijalankan sekali saat komponen dipasang

  if (loading) {
    return <p>Loading...</p>; // Menampilkan loading jika data sedang diambil
  }

  if (error) {
    return <p>{error}</p>; // Menampilkan pesan error jika terjadi kesalahan
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{menu.nama_menu}</h3>
          <p>{menu.jenis.description}</p>
          <p>{menu.deskripsi.description}</p>
            <p> {menu.gambar}</p>
          <p className="text-gray-500">{menu.harga}</p>
        </div>
      ))}
    </div>
  );
};

export default Menu;
