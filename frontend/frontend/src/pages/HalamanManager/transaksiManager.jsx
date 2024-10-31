import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideManager from './sidebar-mananger';
import { FaPrint, FaEdit } from "react-icons/fa";
import Navbar from './navbar';

const TransaksiList = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id_transaksi: null,
    id_user: '',
    id_meja: '',
    nama_pelanggan: '',
    status: '',
  });
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan, harap login kembali');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:8000/transaksi/getAll', config);
      if (response.status !== 200) throw new Error('Gagal mengambil data transaksi dari server');

      setTransaksi(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const start = startDate || today;
    const end = endDate || today;
  
    if (!start || !end) {
      alert('Silakan pilih tanggal mulai dan tanggal akhir');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan, harap login kembali');
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:8000/transaksi/filtertanggal/${start}/${end}`, config);
  
      if (response.status !== 200) throw new Error('Gagal memfilter transaksi');
  
      setTransaksi(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowReceipt = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan, harap login kembali');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:8000/transaksi/struk/${id}`, config);

      if (response.data.success) {
        const fileUrl = `http://localhost:8000/receipt/receipt_${id}.pdf`;
        window.open(fileUrl, '_blank');
      } else {
        alert('Gagal menghasilkan nota');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditTransaksi = (item) => {
    setEditData({
      id_transaksi: item.id_transaksi,
      id_user: item.id_user,
      id_meja: item.id_meja,
      nama_pelanggan: item.nama_pelanggan,
      status: item.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan, harap login kembali');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        `http://localhost:8000/transaksi/update/${editData.id_transaksi}`,
        editData,
        config
      );

      if (response.data.success) {
        setTransaksi((prev) =>
          prev.map((item) =>
            item.id_transaksi === editData.id_transaksi ? { ...item, ...editData } : item
          )
        );
        setShowEditModal(false);
      } else {
        alert('Gagal mengedit transaksi');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (transaksi.length === 0) return <p>Tidak ada data transaksi</p>;

  return (
    <div>
      <SideManager />
      <Navbar />
      <div className="flex flex-wrap gap-5 mt-20">
        <div className="w-3/4 py-2 mb-50 ml-80 relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* Input Tanggal */}
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={handleFilter}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Filter
            </button>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-black bg-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">No</th>
                <th scope="col" className="px-6 py-3 text-center">Nama Kasir</th>
                <th scope="col" className="px-6 py-3 text-center">Nama Pelanggan</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Pesanan</th>
                <th scope="col" className="px-6 py-3 text-center">Jumlah</th>
                <th scope="col" className="px-6 py-3 text-center">Harga</th>
                <th scope="col" className="px-6 py-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((item, index) => {
                const totalKeseluruhan = item.detail.reduce((acc, detailItem) => acc + detailItem.jumlah * detailItem.harga, 0);

                return (
                  <React.Fragment key={item.id_transaksi}>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-center" rowSpan={item.detail?.length || 1}>
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-center" rowSpan={item.detail?.length || 1}>
                        {item.user?.nama_user}
                      </td>
                      <td className="px-6 py-4 text-center" rowSpan={item.detail?.length || 1}>
                        {item.nama_pelanggan}
                      </td>
                      <td className="px-6 py-4 text-center" rowSpan={item.detail?.length || 1}>
                        {item.status}
                      </td>
                      
                      {item.detail && item.detail.length > 0 ? (
                        <>
                          <td className="px-6 py-4 text-center">{item.detail[0].menu?.nama_menu}</td>
                          <td className="px-6 py-4 text-center">{item.detail[0].jumlah}</td>
                          <td className="px-6 py-4 text-center">{item.detail[0].harga}</td>
                          <td className="px-6 py-4 text-center">
                            {item.detail[0].jumlah * item.detail[0].harga}
                          </td>
                        </>
                      ) : (
                        <td colSpan={5} className="px-6 py-4 text-center">Tidak ada detail pesanan</td>
                      )}
                    </tr>
                    {item.detail && item.detail.length > 1 && item.detail.slice(1).map((detail, detailIndex) => (
                      <tr key={detailIndex}>
                        <td className="px-6 py-4 text-center">{detail.menu?.nama_menu}</td>
                        <td className="px-6 py-4 text-center">{detail.jumlah}</td>
                        <td className="px-6 py-4 text-center">{detail.harga}</td>
                        <td className="px-6 py-4 text-center">
                          {detail.jumlah * detail.harga}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="6" className="px-6 py-4 text-center">Total Keseluruhan</td>
                      <td colSpan="2" className="px-6 py-4 text-center">Rp. {totalKeseluruhan}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="modal">
          <h2>Edit Transaksi</h2>
          <input
            type="text"
            value={editData.nama_pelanggan}
            onChange={(e) => setEditData({ ...editData, nama_pelanggan: e.target.value })}
            placeholder="Nama Pelanggan"
          />
          <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Simpan
          </button>
          <button onClick={() => setShowEditModal(false)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Batal
          </button>
        </div>
      )}
    </div>
  );
};

export default TransaksiList;
