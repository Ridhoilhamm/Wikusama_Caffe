import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Impor jwt-decode

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false); // State untuk mendeteksi scroll
  const [decodedToken, setDecodedToken] = useState(null); // State untuk menyimpan data dari token

  // Fungsi untuk mendeteksi scroll dan mengubah state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Mengambil dan mendecode token saat komponen dipasang
  useEffect(() => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama key token yang kamu simpan
    if (token) {
      try {
        const decoded = jwtDecode(token); // Mendecode token
        setDecodedToken(decoded); // Menyimpan hasil decode ke state
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  return (
    <nav
      className={`fixed w-[calc(100%-256px)] top-0 right-0 z-50 p-4 transition-all duration-300 ${
        isScrolled ? 'bg-gray-800 bg-opacity-90' : 'bg-gray-800'
      }`}
    >
      <div className="container mx-auto flex items-center justify-center">
        {/* Logo */}
        <div></div>
        
        {/* Tampilkan informasi dari token */}
        {decodedToken && (
          <div className="text-white content-center">
            <p className='text-xl text-center items-center'>Hallo! {decodedToken.nama_user}</p> {/* Ganti dengan properti yang sesuai */}
           {/* Ganti dengan properti yang sesuai */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
