import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/login', { withCredentials: true });
        console.log(response.data); // Menampilkan data user atau pesan sambutan
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Jika tidak terautentikasi, redirect ke halaman login
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.delete('http://localhost:8000/user/logout', { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Home
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
