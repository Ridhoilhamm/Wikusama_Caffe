import React, { useState, useEffect } from 'react';
import SidebarAdmin from './Sidebar-admin';
import Navbar from './navbar';
import { jwtDecode } from 'jwt-decode'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios'; 

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeAdmin = () => {
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // State untuk jumlah user
  const [totalMeja, setTotalMeja] = useState(0); // State untuk jumlah meja
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error('Token tidak ditemukan, harap login kembali');
        }

        const decodedToken = jwtDecode(token); 
        setAdminName(decodedToken.nama_user); 

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Ambil total transaksi
        const responseTransaksi = await axios.get('http://localhost:8000/transaksi/getAll', config);
        if (responseTransaksi.status === 200) {
          setTotalTransaksi(responseTransaksi.data.totalTransaksi); 
        }

        // Ambil total penjualan
        const responsePenjualan = await axios.get('http://localhost:8000/transaksi/total', config);
        if (responsePenjualan.status === 200) {
          setTotalPenjualan(responsePenjualan.data.totalPenjualan); 
        }

        // Ambil total user
        const responseUser = await axios.get('http://localhost:8000/user/allUser', config); // Ganti URL sesuai endpoint
        if (responseUser.status === 200) {
          setTotalUsers(responseUser.data.totalUsers); // Sesuaikan dengan struktur data respons
        }

        // Ambil total meja
        const responseMeja = await axios.get('http://localhost:8000/meja/getAll', config); // Ganti URL sesuai endpoint
        if (responseMeja.status === 200) {
          setTotalMeja(responseMeja.data.totalMeja); // Sesuaikan dengan struktur data respons
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="flex">
      <div style={{ width: '250px' }}>
        <SidebarAdmin />
        <Navbar/>
      </div>
      <div className='container-fluid flex-grow w-1/6 mt-20'>
        <div className='row gap-3 my-2'>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Selamat Datang!, {adminName} Di admin Dashboard</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-500 text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{totalTransaksi}</h3>
                <p className="text-xl font-serif">Jumlah Transaksi</p>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Rp. {totalPenjualan}</h3>
                <p className="text-xl font-serif">Total Pendapatan</p>
              </div>
              <div className="bg-yellow-500 text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{totalUsers}</h3> {/* Tampilkan jumlah user */}
                <p className="text-xl font-serif">Jumlah User</p>
              </div>
              <div className="bg-red-500 text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{totalMeja}</h3> {/* Tampilkan jumlah meja */}
                <p className="text-sm">Meja</p>
              </div>
            </div>
          </div>
        </div>

        

        
      </div>
    </div>
  );
};

export default HomeAdmin;
