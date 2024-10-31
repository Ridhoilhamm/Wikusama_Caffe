"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const api = "http://localhost:8000/user/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, {
        username,
        password,
      });
      const data = response.data;

      if (data) {
        localStorage.setItem("data_user", JSON.stringify(data));
        localStorage.setItem("role", data.data.role);
        localStorage.setItem("token", data.data.token);

        if (data.data.role === "manajer") {
          navigate("/manager/transaksi"); // Gunakan navigate
        } else if (data.data.role === "kasir") {
          navigate("/kasir/home"); // Gunakan navigate
        } else {
          navigate("/admin"); // Gunakan navigate
        }
      }
    } catch (error) {
      // Menangani error
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Menampilkan pesan dari respons API
      } else {
        setErrorMessage("Login failed. Please check your username or password.");
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      style={{
        backgroundImage: 'url("/assets/bg-.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-white bg-opacity-80 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-yellow-900"
          >
            <img className="w-12 h-12 mr-2" src="/assets/icon-coffe.png" alt="logo" />
            Wikusama Cafe
          </a>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-yellow-900 md:text-2xl">
            Sign in to your account
          </h1>

          {/* Tampilkan pesan error jika ada */}
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-yellow-900"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-yellow-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                required=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-yellow-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-gray-900 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
