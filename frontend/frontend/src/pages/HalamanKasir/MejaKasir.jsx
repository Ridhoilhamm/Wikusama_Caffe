import React, { useEffect, useState } from "react";
import axios from "axios";
import Kasir from "./Kasir";
import Navbar from "./navbar";
import { ToastContainer, toast } from "react-toastify"; // Make sure to import ToastContainer

const Meja = () => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    const [meja, setMeja] = useState([]);
    const [checkNomor, setCheckNomor] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [pickId, setPickId] = useState("");
    const [addMeja, setAddMeja] = useState({ nomor_meja: "" });
    const [prevData, setPrevData] = useState({ nomor_meja: "" });

    // Fetching data
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

    // Handle delete confirmation
    const selectIdDelete = (id) => {
        setPickId(id);
        setShowModalDelete(true);
    };

    const deleteId = async () => {
        try {
            await axios.delete(`http://localhost:8000/meja/${pickId}`, { headers });
            setMeja(prev => prev.filter(meja => meja.id !== pickId));
            setShowModalDelete(false);
            toast.success("Meja berhasil dihapus!");
        } catch (err) {
            console.log(err);
        }
    };

    // Filter meja based on status
    const filteredMeja = statusFilter ? meja.filter(item => item.status === statusFilter) : meja;

    // Handle edit and add forms
    const selectDataEdit = (id, nomor_meja) => {
        setPrevData({ nomor_meja });
        setPickId(id);
        setShowModalEdit(true);
    };

    const handleChange = (e, isEdit = false) => {
        const setter = isEdit ? setPrevData : setAddMeja;
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const postMeja = async (e) => {
        e.preventDefault();
        if (checkNomor.includes(addMeja.nomor_meja.trim())) {
            toast.info("Nomor meja sudah terdaftar");
        } else {
            try {
                await axios.post("http://localhost:8000/meja/add", addMeja, { headers });
                setMeja(prev => [...prev, addMeja]);
                setShowModalAdd(false);
                toast.success("Meja berhasil ditambahkan!");
            } catch (err) {
                console.log(err);
            }
        }
    };

    const putMeja = async (e) => {
        e.preventDefault();
        if (prevData.nomor_meja !== addMeja.nomor_meja && checkNomor.includes(prevData.nomor_meja.trim())) {
            toast.info("Nomor meja sudah terdaftar");
        } else {
            try {
                await axios.put(`http://localhost:8000/meja/${pickId}`, prevData, { headers });
                setMeja(prev => prev.map(meja => (meja.id === pickId ? { ...meja, ...prevData } : meja)));
                setShowModalEdit(false);
                toast.success("Meja berhasil diedit!");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="flex">
            <Kasir />
            <Navbar />
            <div className="w-3/4 py-20 ml-80">
                <div className="">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">All</option>
                        <option value="terisi">Terisi</option>
                        <option value="kosong">Kosong</option>
                    </select>
                </div>
                <div className="flex flex-wrap gap-5">
                    <div className="w-3/4 py-2 mb-50 relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-black bg-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center">Nomor Meja</th>
                                    <th scope="col" className="pl-20 py-4 text-center">status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredMeja.map((meja) => (
                                    <tr key={meja.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{meja.nomor_meja}</td>
                                        <td className="px-6 py-4 text-center">{meja.status}</td>
                                
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal delete */}
            {showModalDelete && (
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="p-6 text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-400">Apakah anda yakin ingin menghapus meja ini?</h3>
                                <button onClick={deleteId} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">Delete</button>
                                <button onClick={() => setShowModalDelete(false)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Add Meja */}
            {showModalAdd && (
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="relative rounded-lg shadow bg-gray-600">
                            <button onClick={() => setShowModalAdd(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-white">Tambahkan Meja</h3>
                                <form onSubmit={postMeja}>
                                    <div className="mb-4">
                                        <label htmlFor="nomor_meja" className="block mb-2 text-sm font-medium text-white">Nomor Meja</label>
                                        <input type="text" name="nomor_meja" value={addMeja.nomor_meja} onChange={handleChange} required className="border text-black text-sm rounded-lg block w-full p-2.5" placeholder="Nomor Meja" />
                                    </div>
                                    <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Tambah</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Meja */}
            {showModalEdit && (
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="relative rounded-lg shadow bg-gray-600">
                            <button onClick={() => setShowModalEdit(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-white">Edit Meja</h3>
                                <form onSubmit={putMeja}>
                                    <div className="mb-4">
                                        <label htmlFor="nomor_meja" className="block mb-2 text-sm font-medium text-white">Nomor Meja</label>
                                        <input type="text" name="nomor_meja" value={prevData.nomor_meja} onChange={(e) => handleChange(e, true)} required className="border text-black text-sm rounded-lg block w-full p-2.5" placeholder="Nomor Meja" />
                                    </div>
                                    <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Meja;
