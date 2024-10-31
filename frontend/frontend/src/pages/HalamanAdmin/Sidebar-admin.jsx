import React, { useState, useEffect } from 'react';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import {   MdFoodBank } from 'react-icons/md';
import { FaCartPlus } from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate dan useLocation

// Komponen Modal
const Modal = ({ showModal, closeModal, title, children }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const SidebarAdmin = () => {
  const [showMinumanModal, setShowMinumanModal] = useState(false);// state yang digunakan untuk menampilkan data minuman
  const [showMakananModal, setShowMakananModal] = useState(false); // state yang digunakan untuk menampilkan data makanan 
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State untuk modal logout
  const [makananData, setMakananData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Gunakan useLocation untuk mendapatkan path saat ini

  // Mengambil data makanan saat modal dibuka
  useEffect(() => {
    if (showMakananModal) {
      const fetchMakanan = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('http://localhost:8000/menu/getAll');
          setMakananData(response.data.data);
        } catch (error) {
          setError('Gagal mengambil data makanan.');
        } finally {
          setLoading(false);
        }
      };

      fetchMakanan();
    }
  }, [showMakananModal]);

  // Fungsi logout untuk menghapus token dan data di localStorage serta redirect ke halaman login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('data_user');
    navigate('/'); // Redirect ke halaman login
  };

  // Fungsi untuk menentukan apakah path aktif atau tidak
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-500 shadow' : '';
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 fixed h-full px-4 py-2">
        <div className="my-2 mb-4">
          <h1 className="text-2x text-white font-bold">Admin Dashboard</h1>
        </div>
        <hr />
        <ul className="mt-3 text-white font-bold">
          <li className={`mb-2 rounded hover:shadow py-2 ${isActive('/kasir/')}`}>
            <a href="/admin/home">
              <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />
              Home
            </a>
          </li>
          <li className={`mb-2 rounded hover:shadow py-2 ${isActive('/admin/menu')}`}>
            <a href="/admin/menu">
              <MdFoodBank className="inline-block w-6 h-6 mr-2 -mt-2" />
              Menu
            </a>
          </li>
          <li className={`mb-2 rounded hover:shadow py-2 ${isActive('/admin/meja')}`}>
            <a href="/admin/meja">
              <MdTableRestaurant className="inline-block w-6 h-6 mr-2 -mt-2" />
              Meja
            </a>
          </li>
          <li className={`mb-2 rounded hover:shadow py-2 ${isActive('/admin/user')}`}>
            <a href="/admin/user">
              <FaRegUserCircle className="inline-block w-6 h-6 mr-2 -mt-2" />
              Users
            </a>
          </li>
          <li className="mb-2 rounded hover:shadow py-2">
            <button onClick={() => setShowLogoutModal(true)}>
              <TbLogout2 className="inline-block w-6 h-6 mr-2 -mt-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Modal untuk Minuman */}
      <Modal
        showModal={showMinumanModal}
        closeModal={() => setShowMinumanModal(false)}
        title="Daftar Minuman"
      >
        <p>List Minuman yang tersedia...</p>
      </Modal>

      {/* Modal untuk Makanan */}
      <Modal
        showModal={showMakananModal}
        closeModal={() => setShowMakananModal(false)}
        title="Daftar Makanan"
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {makananData.map((makanan) => (
              <li key={makanan.id}>{makanan.nama_menu}</li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Modal untuk Logout */}
      <Modal
        showModal={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
        title="Konfirmasi Logout"
      >
        <p>Apakah Anda yakin ingin logout?</p>

        <div className="flex justify-between mt-5">
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Ya
          </button>
          <button
            onClick={() => setShowLogoutModal(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SidebarAdmin;
