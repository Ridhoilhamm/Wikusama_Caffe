import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideManager from './sidebar-mananger';
import Navbar from '../../components/Navbar';
const UserList = () => {
  const [users, setUsers] = useState([]); // State untuk menyimpan data user
  const [loading, setLoading] = useState(false); // State untuk loading
  const [error, setError] = useState(null); // State untuk menangani error

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Mulai loading
      setError(null); // Reset error sebelum request baru

      try {
        const token = localStorage.getItem('token'); // Mengambil token dari localStorage
        if (!token) {
          throw new Error('Token tidak ditemukan, harap login kembali'); // Error jika token tidak ada
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Sertakan token di headers
          }
        };

        const response = await axios.get('http://localhost:8000/user/allUser', config);

        // Jika API merespons dengan error, lempar error
        if (response.status !== 200) {
          throw new Error('Gagal mengambil data user dari server');
        }
        console.log(response.data.success)
        setUsers(response.data.success); // Menyimpan data user ke state
      } catch (err) {
        setError(err.message); // Menyimpan pesan error di state
      } finally {
        setLoading(false); // Mengakhiri loading
      }
    };

    fetchUsers(); // Panggil fungsi untuk mengambil data user
  }, []); // [] artinya useEffect hanya dijalankan sekali saat komponen pertama kali di-render

  if (loading) return <p>Loading...</p>; // Tampilkan loading saat data sedang diambil
  if (error) return <p style={{ color: 'red' }}>{error}</p>; // Tampilkan pesan error jika ada

  if (users.length === 0) return <p>Tidak ada data user</p>; // Jika tidak ada data user

  return (
    <div>
      <div>
      <Navbar/>
      <SideManager/>
      </div>
      <div className='w-3/4 py-6 ml-80'>

      <h2>Daftar User</h2>
      <ul>
        {users.map(user => (
          <div key={user.id_user}>
            <li>{user.username}</li>
          </div>
        ))}
      </ul>
        </div>
    </div>
  );
};

export default UserList;
