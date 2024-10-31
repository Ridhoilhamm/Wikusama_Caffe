import React from 'react'
// import ProtectedRoute from './pages/Route/Protected'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/login'
import HomeAdmin from './pages/HalamanAdmin/HomeAdmin'
import AddMenu from './components/addMenu'
import MenuList from './pages/HalamanKasir/MenuList'
import UserList from './pages/HalamanManager/user-manager'
import Kasir from './pages/HalamanKasir/Kasir'
import Manager from './pages/HalamanManager/manager'
import Menu_Admin from './pages/HalamanAdmin/Menu_admin'
// import Transaksi from './pages/HalamanKasir/TransaksiKasir'
import TransaksiList from './pages/HalamanKasir/transaksiHistori'
import MejaKasir from './pages/HalamanKasir/MejaKasir'
import UserAdmin from './pages/HalamanAdmin/userAdmin'
import MejaAdmin from './pages/HalamanAdmin/adminMeja'
import TransaksiManager from './pages/HalamanManager/transaksiManager'
import HomeKasir from './pages/HalamanKasir/HomeKasir'
// import HomeAdmin from './pages/HalamanAdmin/HomeAdmin'





function App() {
  return (
    <BrowserRouter>
      <Routes>

        //kasir
        <Route path='/kasir' element={<Kasir />}></Route>
        <Route path='/kasir/menu' element={<MenuList />}></Route>
        <Route path='/kasir/transaksi' element={<TransaksiList/>}></Route>
        <Route path='/kasir/meja' element={<MejaKasir/>}></Route>
        <Route path='/kasir/home' element={<HomeKasir/>}></Route>

        
        //admin
        <Route path='/admin' element={<HomeAdmin />}></Route>
        <Route path='/admin/menu' element={<Menu_Admin/>}></Route>
        <Route path='/admin/meja' element={<MejaAdmin />}></Route>
        <Route path='/admin/user' element={<UserAdmin />}></Route>
        <Route path='/admin/home' element={<HomeAdmin />}></Route>


        //manager
        <Route path='/manager' element={<Manager />}></Route>
        <Route path='/manager/user' element={<UserList />}></Route>
        <Route path='/manager/transaksi' element={<TransaksiManager />}></Route>



        ``
        <Route path='/' element={<Login />}></Route>
        

      </Routes>
    </BrowserRouter>
  )
}

export default App