// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Lakukan sesuatu dengan searchQuery, seperti memanggil API atau redirect ke halaman hasil pencarian
    console.log('Search query:', searchQuery);
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-white font-bold text-lg">
        <Link to="/home">Caffe</Link>
      </div>

      {/* Links */}
      <ul className="flex space-x-4">
        <li>
          <Link to="/home" className="text-white hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/menu" className="text-white hover:underline">
            Menu
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-white hover:underline">
            About
          </Link>
        </li>
      </ul>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          className="px-4 py-2 rounded-l-md focus:outline-none"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white text-blue-500 px-4 py-2 rounded-r-md hover:bg-gray-200 transition duration-200"
        >
          Search
        </button>
      </form>
    </nav>
  );
};

export default Navbar;
