import React from 'react'
// import ProtectedRoute from './pages/protected'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'

function App() {
  return (
   <BrowserRouter>
    <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Home/>}></Route>
       
    </Routes>
   </BrowserRouter>
  )
}

export default App