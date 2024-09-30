import React, { useState } from 'react';
import axios, { Axios } from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;
    
  const Auth = async (e) => {
    e.preventDefault();
    try {
    await axios.post('http://localhost:8000/user/login', {
        username,
        password,
      });
      navigate('/');
      // Simpan token atau redirect ke halaman lain
      console.log('Login berhasil:', response.data);
    } catch (error) {
    //   setErrorMessage('Login gagal, periksa kembali email atau password.');
    if(error.response){
        setErrorMessage(error.response.data.message);
    }

    }
  };

  return (
    
    <div className='flex justify-center items-center min-h-screen '>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
        <h2 className="text-2xl font-bold text-center mb-6">Wikusama Caffe</h2>
        <form onSubmit={Auth} className="space-y-4">
            <p className='has-text-centered'>{errorMessage}</p>
          <div>
            <label className="block text-gray-700">Username</label>
            <input 
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
          </div>
          <div className="flex justify-center">
            <button 
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </div>
        </form>
       
      </div>
        </div>
   


  );
};

export default Login;
