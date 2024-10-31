import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false); // State untuk mendeteksi scroll

  // Fungsi untuk mendeteksi scroll dan mengubah state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
    className={`fixed w-[calc(100%-256px)] top-0 right-0 z-50 p-4 transition-all duration-300  ${
      isScrolled ? 'bg-gray-800 bg-opacity-90' : 'bg-gray-800'
    }`}
  >
    <div className="container mx-auto flex items-center justify-between">
      {/* Logo */}
      <div></div>
  
      {/* Search Bar */}
      <form className="flex items-center">
        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="p-2 rounded-l-md border-none focus:outline-none"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 p-2 rounded-r-md hover:bg-gray-200"
        >
          Cari
        </button>
      </form>
  
      <div></div>
    </div>
  </nav>
  
  );
};

export default Navbar;
