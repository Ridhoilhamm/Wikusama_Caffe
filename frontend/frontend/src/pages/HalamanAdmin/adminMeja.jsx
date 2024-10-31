import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";
import SidebarAdmin from "./Sidebar-admin";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Meja() {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    const [meja, setMeja] = useState([]);
    const [checkNomor, setCheckNomor] = useState([]);
    const [lastNomor, setLastNomor] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [pickId, setPickId] = useState("");
    const [addMeja, setAddMeja] = useState({
        nomor_meja: "",
    });
    const [prevData, setPrevData] = useState({
        nomor_meja: "",
    });

    useEffect(() => {
        const fetchAllMeja = async () => {
            try {
                const response = await axios.get("http://localhost:8000/meja/getAll", { headers });
                setMeja(response.data.data);
                const nomor = response.data.data.map(res => res.nomor_meja);
                setCheckNomor(nomor);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllMeja();
    }, []);

    const selectIdDelete = (id) => {
        setPickId(id);
        setShowModalDelete(true);
    };

    const deleteId = async () => {
        try {
            await axios.delete(`http://localhost:8000/meja/delete/${pickId}`, { headers });
            setShowModalDelete(false); // Close the modal after delete
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const selectDataEdit = (id, nomor_meja, status) => {
        setPrevData({
            nomor_meja: nomor_meja,
            status: status
        });
        setLastNomor(nomor_meja);
        setPickId(id);
        setShowModalEdit(true);
    };

    const handleChange_Edit = (e) => {
        setPrevData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChange_Add = (e) => {
        setAddMeja(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const postMeja = async e => {
        e.preventDefault();
        if (checkNomor.includes(addMeja.nomor_meja.trim())) {
            toast.info("Nomor meja sudah terdaftar");
        } else {
            try {
                await axios.post("http://localhost:8000/meja/add", addMeja, { headers });
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const putMeja = async e => {
        e.preventDefault();
        if (prevData.nomor_meja !== lastNomor && checkNomor.includes(prevData.nomor_meja.trim())) {
            toast.info("Nomor meja sudah terdaftar");
        } else {
            try {
                await axios.put(`http://localhost:8000/meja/update/${pickId}`, prevData, { headers });
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div>
            <SidebarAdmin />
            <Navbar />
            <div className="mt-20">
                <div className="flex flex-wrap gap-5">
                    <div className="w-3/4 py-2 mb-50 ml-80 relative overflow-x-auto shadow-md sm:rounded-lg">
                        <button onClick={() => setShowModalAdd(true)} type="button" className="mb-1 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-[#4A6145] hover:bg-[#678161] focus:ring-[#678161]">
                            Tambahkan Meja
                        </button>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-black bg-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center">Nomor Meja</th>
                                    <th scope="col" className="px-6 py-3 text-center">Status Meja</th>
                                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meja && meja.map((meja, index) => (
                                    <tr key={index + 1} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{meja.nomor_meja}</td>
                                        <td className="px-6 py-6 text-center">{meja.status}</td>
                                        <td className="pl-6 py-4 text-right">
                                            <button onClick={() => selectDataEdit(meja.id_meja, meja.nomor_meja, meja.status)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => selectIdDelete(meja.id_meja)} className="mx-4 font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Add Meja */}
            {showModalAdd ? (
    <div>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="relative rounded-lg shadow bg-gray-600">
                    <button 
                        onClick={() => setShowModalAdd(false)} 
                        type="button" 
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white">
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-white">Tambahkan Meja</h3>
                        <form className="space-y-6" onSubmit={postMeja}>
                            <div>
                                <label htmlFor="nomor_meja" className="block mb-2 text-sm font-medium text-white">Nomor Meja</label>
                                <input 
                                    type="text" 
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 text-black" 
                                    name="nomor_meja" 
                                    onChange={handleChange_Add} 
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-white">Status Meja</label>
                                <select 
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 text-black" 
                                    name="status" 
                                    onChange={handleChange_Add} 
                                    required
                                >
                                    <option value="terisi">Terisi</option>
                                    <option value="kosong">Kosong</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                                Simpan
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowModalAdd(false)}  // Tambahkan onClick untuk menutup modal
                                className="w-full text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5">
                                Batal
                                <span className="sr-only">Close modal</span>  
                            </button>
                            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} pauseOnHover={false} theme="light" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
) : null}


            {/* Modal Edit Meja */}
            {showModalEdit ? (
    <div>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="relative rounded-lg shadow bg-gray-600">
                    <button
                        onClick={() => setShowModalEdit(false)}
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white"
                    >
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-white">Edit Meja</h3>
                        <form className="space-y-6" onSubmit={putMeja}>
                            <div>
                                <label htmlFor="nomor_meja" className="block mb-2 text-sm font-medium text-white">Nomor Meja</label>
                                <input
                                    type="text"
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 text-black"
                                    name="nomor_meja"
                                    defaultValue={prevData.nomor_meja}
                                    onChange={handleChange_Edit}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-white">Status Meja</label>
                                <select
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 text-black"
                                    name="status"
                                    defaultValue={prevData.status}
                                    onChange={handleChange_Edit}
                                    required
                                >
                                    <option value="terisi">Terisi</option>
                                    <option value="kosong">Kosong</option>
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModalEdit(false)}
                                    className="w-full text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
                                >
                                    Batal
                                </button>
                            </div>
                            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} pauseOnHover={false} theme="light" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
) : null}


            {/* Modal Delete Meja */}
            {showModalDelete ? (
                <div>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="relative rounded-lg shadow bg-gray-600">
                                <button
                                    onClick={() => setShowModalDelete(false)}
                                    type="button"
                                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white"
                                >
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="px-6 py-6 lg:px-8">
                                    <h3 className="mb-4 text-xl font-medium text-white">Konfirmasi Penghapusan</h3>
                                    <p className="text-white">Apakah Anda yakin ingin menghapus meja ini?</p>
                                    <div className="flex justify-end mt-4">
                                        <button onClick={() => setShowModalDelete(false)} className="mr-4 text-gray-400 hover:text-white">Batal</button>
                                        <button onClick={deleteId} className="text-red-600">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            ) : null}
        </div>
    );
}
