import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarAdmin from './Sidebar-admin';
import Navbar from './navbar';


const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false); // State untuk modal edit
  const [newUser, setNewUser] = useState({
    nama_user: '',
    username: '',
    password: '',
    role: '',
  });
  const [currentUser, setCurrentUser] = useState(null); // State untuk menyimpan user yang sedang diedit

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan, harap login kembali');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:8000/user/allUser', config);

        if (response.status !== 200) {
          throw new Error('Gagal mengambil data user dari server');
        }
        setUsers(response.data.success);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setCurrentUser(user); // Set user yang sedang diedit
    setShowModalEdit(true); // Tampilkan modal edit
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus user ini?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.delete(`http://localhost:8000/user/delete/${userId}`, config);
        
        if (response.status === 200) {
          setUsers(users.filter(user => user.id_user !== userId));
          alert("User berhasil dihapus.");
        } else {
          throw new Error('Gagal menghapus user');
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showModalAdd) {
      setNewUser({ ...newUser, [name]: value });
    } else if (showModalEdit) {
      setCurrentUser({ ...currentUser, [name]: value });
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:8000/user/add', newUser, config);
      if (response.status === 200) {
        setUsers([...users, response.data.data]);
        setShowModalAdd(false);
        alert('User berhasil ditambahkan');
        setNewUser({
          nama_user: '',
          username: '',
          password: '',
          role: '',
        });
      } else {
        throw new Error('Gagal menambah user');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`http://localhost:8000/user/update/${currentUser.id_user}`, currentUser, config);
      if (response.status === 200) {
        setUsers(users.map(user => (user.id_user === currentUser.id_user ? response.data.data : user)));
        setShowModalEdit(false);
        alert('User berhasil diperbarui');
        setCurrentUser(null); // Reset state currentUser
      } else {
        throw new Error('Gagal memperbarui user');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (users.length === 0) return <p>Tidak ada data user</p>;

  return (
    <div className='bg-gray-100 w-full'>
      <SidebarAdmin />
      <Navbar/>
      <div className="flex flex-wrap gap-5 mt-20">
        <div className="w-3/4 py-2 mb-50 ml-80 relative overflow-x-auto shadow-md sm:rounded-lg">
          <button
            onClick={() => setShowModalAdd(true)}
            type="button"
            className="mb-1 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-[#4A6145] hover:bg-[#678161] focus:ring-[#678161]"
          >
            Tambahkan User
          </button>

          {/* Modal untuk menambahkan user */}
          {showModalAdd && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Tambah User Baru</h2>
                <input
                  type="text"
                  name="nama_user"
                  placeholder="Nama"
                  value={newUser.nama_user}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-4 w-full p-2"
                />
                <div className="flex justify-end">
                  <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Simpan</button>
                  <button onClick={() => setShowModalAdd(false)} className="bg-red-500 text-white px-4 py-2 rounded">Batal</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal untuk mengedit user */}
          {showModalEdit && currentUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Edit User</h2>
                <input
                  type="text"
                  name="nama_user"
                  placeholder="Nama"
                  value={currentUser.nama_user}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (tidak ingin mengubah tulis pw lama)"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-2 w-full p-2"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded mb-4 w-full p-2"
                />
                <div className="flex justify-end">
                  <button onClick={handleUpdateUser} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Simpan</button>
                  <button onClick={() => setShowModalEdit(false)} className="bg-red-500 text-white px-4 py-2 rounded">Batal</button>
                </div>
              </div>
            </div>
          )}

          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className='text-xs text-black bg-gray-400'>
              <tr>
                <th scope="col" className="px-6 py-3 text-center">Nama</th>
                <th scope="col" className="px-6 py-3 text-center">Username</th>
                <th scope="col" className="px-6 py-3 text-center">Role</th>
                <th scope="col" className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id_user}>
                  <td className="px-6 py-4 text-center">{user.nama_user}</td>
                  <td className="px-6 py-4 text-center">{user.username}</td>
                  <td className="px-6 py-4 text-center">{user.role}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id_user)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAdmin;
