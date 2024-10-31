import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from './Sidebar-admin';
import Navbar from './navbar';

const Menu_Admin = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal konfirmasi hapus
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nama_menu: '',
    jenis: '',
    deskripsi: '',
    harga: '',
    gambar: null,
  });

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
        const menu = response.data.data;
        setMenu(menu);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to fetch menu");
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleEditClick = (item) => {
    setSelectedProduct(item);
    setFormData({
      nama_menu: item.nama_menu,
      jenis: item.jenis,
      deskripsi: item.deskripsi,
      harga: item.harga,
      gambar: null,
    });
    setIsEditModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      nama_menu: '',
      jenis: '',
      deskripsi: '',
      harga: '',
      gambar: null,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedProduct(item);
    setIsDeleteModalOpen(true); // Buka modal konfirmasi hapus
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false); // Tutup modal konfirmasi hapus
  };

  const handleSubmitEdit = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const formDataToSend = new FormData();
    formDataToSend.append('nama_menu', formData.nama_menu);
    formDataToSend.append('jenis', formData.jenis);
    formDataToSend.append('deskripsi', formData.deskripsi);
    formDataToSend.append('harga', formData.harga);
    if (formData.gambar) {
      formDataToSend.append('gambar', formData.gambar);
    }

    try {
      await axios.put(`http://localhost:8000/menu/update/${selectedProduct.id_menu}`, formDataToSend, config);
      const response = await axios.get('http://localhost:8000/menu/getAll', config);
      setMenu(response.data.data);
      handleEditModalClose();
    } catch (err) {
      console.error("Error updating menu:", err);
      setError("Failed to update menu");
    }
  };

  const handleSubmitAdd = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    // Validasi input: cek apakah semua field terisi dan harga tidak negatif
    if (!formData.nama_menu || !formData.jenis || !formData.deskripsi || formData.harga === undefined || formData.harga === "" || formData.harga < 0 || !formData.gambar) {
      alert("Semua field harus diisi dan harga tidak boleh bernilai negatif!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nama_menu', formData.nama_menu);
    formDataToSend.append('jenis', formData.jenis);
    formDataToSend.append('deskripsi', formData.deskripsi);
    formDataToSend.append('harga', formData.harga);
    formDataToSend.append('gambar', formData.gambar);

    try {
      await axios.post('http://localhost:8000/menu/add', formDataToSend, config);
      const response = await axios.get('http://localhost:8000/menu/getAll', config);
      setMenu(response.data.data);
      handleAddModalClose();
    } catch (err) {
      console.error("Error adding menu:", err);
      setError("Failed to add menu");
    }
};


  const handleDeleteMenu = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`http://localhost:8000/menu/delete/${selectedProduct.id_menu}`, config);
      const response = await axios.get('http://localhost:8000/menu/getAll', config);
      setMenu(response.data.data);
      handleDeleteModalClose(); // Tutup modal setelah menghapus
    } catch (err) {
      console.error("Error deleting menu:", err);
      setError("Failed to delete menu");
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, gambar: e.target.files[0] });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (menu.length === 0) return <p>No menu available.</p>;

  // CSS class untuk background gelap
  const backgroundOverlayClass = (isEditModalOpen || isAddModalOpen || isDeleteModalOpen) ? "bg-black bg-opacity-50" : "";

  return (
    <div className={`relative min-h-screen flex ${backgroundOverlayClass}`}>
      <div>
        <Navbar/>
        <SidebarAdmin />
      </div>

      <div className="w-3/4 py-6 ml-80 mt-20">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Menu</h2>
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            onClick={handleAddClick}
          >
            Tambah Menu
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-500">
          <thead className='text-xs text-black bg-gray-400'>
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Gambar</th>
              <th scope="col" className="px-6 py-3 text-center">Nama Menu</th>
              <th scope="col" className="px-6 py-3 text-center">Jenis</th>
              <th scope="col" className="px-6 py-3 text-center">Deskripsi</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id_menu}>
                <td className="py-2 px-4 border-b">
                  <img
                    className="w-16 h-16 object-cover rounded-full"
                    src={`http://localhost:8000/image/${item.gambar}`}
                    alt={item.nama_menu}
                  />
                </td>
                <td className="px-6 py-4 text-center">{item.nama_menu}</td>
                <td className="px-6 py-4 text-center">{item.jenis}</td>
                <td className="px-6 py-4 text-center">{item.deskripsi}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded-lg mr-2 hover:bg-yellow-600"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-900"
                    onClick={() => handleDeleteClick(item)} // Panggil handleDeleteClick untuk menghapus
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Menu {selectedProduct.nama_menu}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nama Menu</label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.nama_menu}
                onChange={(e) => setFormData({ ...formData, nama_menu: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Jenis</label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Harga</label>
              <input
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <input
                type="file"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2" onClick={handleSubmitEdit}>
                Simpan
              </button>
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg" onClick={handleEditModalClose}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Tambah Menu</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nama Menu</label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.nama_menu}
                onChange={(e) => setFormData({ ...formData, nama_menu: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Jenis</label>
              <input
                type="text"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Harga</label>
              <input
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <input
                type="file"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2" onClick={handleSubmitAdd}>
                Simpan
              </button>
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg" onClick={handleAddModalClose}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Hapus Menu</h2>
            <p>Apakah Anda yakin ingin menghapus menu {selectedProduct.nama_menu}?</p>
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2" onClick={handleDeleteMenu}>
                Hapus
              </button>
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg" onClick={handleDeleteModalClose}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu_Admin;
