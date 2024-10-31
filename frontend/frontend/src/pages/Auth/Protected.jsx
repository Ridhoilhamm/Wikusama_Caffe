import { Outlet, Navigate } from "react-router-dom";

// Fungsi untuk mendapatkan nilai cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ProtectedRoutes = () => {
  // Ambil token dari cookie
  const token = getCookie("token");

  // Jika token ada, izinkan akses ke halaman yang dilindungi (Outlet), jika tidak arahkan ke /login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
