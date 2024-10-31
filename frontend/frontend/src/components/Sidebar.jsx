import React from 'react'
import {FaHome} from 'react-icons/fa'

const Sidebar = () => {
  return (
    <div className='w-6 bg-gray-800 fixed h-full'>
      <div>
        <h1 className='text-2x text-white font-bold'> Admin Dashboard</h1>
      </div>
      <hr />
      <ul>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>  
          <a href="">
            <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
            Home
          </a>
        </li>
      </ul>

    </div>
  )
}

export default Sidebar;