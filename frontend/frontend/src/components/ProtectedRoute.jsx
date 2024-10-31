import { Outlet, Navigate } from "react-router-dom";
// import Cookie from "js-cookie"

const ProtectedRoutes = () => {
  let role = localStorage.get("role");
  return role ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;