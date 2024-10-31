import React, { useState, useEffect } from 'react';
import Kasir from './Kasir';
import { jwtDecode } from 'jwt-decode';

const HomeKasir = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [KasirName, setKasirName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan, harap login kembali');
        }

        const decodedToken = jwtDecode(token);
        setKasirName(decodedToken.nama_user);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200">
        <Kasir />
      </div>

      {/* Konten Utama */}
      <div className="flex-grow p-4">
        <div className="container mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Selamat Datang, {KasirName}! di Kasir Dasboard</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeKasir;
