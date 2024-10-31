import React, { useState, useEffect } from 'react';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import { MdEmojiFoodBeverage, MdFoodBank } from 'react-icons/md';
import { FaCartPlus } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi

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

const SideManager = () => {// state yang digunakan untuk menampilkan data makanan 
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State untuk modal logout
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mengambil data makanan saat modal dibuka
  

  // Fungsi logout untuk menghapus token dan data di localStorage serta redirect ke halaman login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('data_user');
    navigate('/'); // Redirect ke halaman login
  };

  return (
    
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 fixed h-full px-4 py-2">
        <div className="my-2 mb-4">
          <h1 className="text-2x text-white font-bold">Manager Dashboard</h1>
        </div>
        <hr />
        <ul className="mt-3 text-white font-bold">
            <a href="/manager/transaksi">
          <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
              
              <MdFoodBank className="inline-block w-6 h-6 mr-2 -mt-2" />
              Transaksi
          </li>
            </a>
            
          <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
            <button onClick={() => setShowLogoutModal(true)}> {/* Show modal on click */}
              <TbLogout2 className="inline-block w-6 h-6 mr-2 -mt-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>

    
      <Modal 
  showModal={showLogoutModal}
  closeModal={() => setShowLogoutModal(false)}
  title="Konfirmasi Logout"
>
  <p>Apakah Anda yakin ingin logout?</p>

  {/* Membuat div untuk menempatkan tombol "Ya" dan "Close" agar sejajar */}
  <div className="flex justify-between mt-5">
    <button
      onClick={handleLogout} // Logout saat klik Ya
      className="bg-gray-800 text-white px-4 py-2 rounded"
    >
      Ya
    </button>
    <button
      onClick={() => setShowLogoutModal(false)} // Menutup modal saat klik Close
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Close
    </button>
  </div>
</Modal>

    </div>
  );
};

export default SideManager;
