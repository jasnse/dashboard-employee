import { useEffect, useState } from "react";
import { collectionGroup, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

// Definisikan tipe status yang valid
type Status = 'WFH' | 'WFO' | 'CUTI' | 'On-Site' | 'No Input';

type Aktivitas = {
  email: string;
  jamMasuk: string;
  jamPulang: string;
  status: Status; // Pastikan status menggunakan tipe Status
  catatan: string;
  tanggal: string;
};

type Props = {
  selectedDate?: string;
  filterEmail?: string;
  searchTerm?: string;
  currentPage: number;  // Use currentPage as a prop
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Allow ActivityTable to change the currentPage
};

export default function ActivityTable({
  selectedDate,
  filterEmail,
  searchTerm,
  currentPage,
  setCurrentPage,
}: Props) {
  const [data, setData] = useState<Aktivitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatatan, setSelectedCatatan] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    WFH: 0,
    WFO: 0,
    CUTI: 0,
    "On-Site": 0,
    "No Input": 0,
  });

  // Pagination States
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch data from Firestore
    const unsubscribe = onSnapshot(collectionGroup(db, "hari"), (snapshot) => {
      const list: Aktivitas[] = [];

      snapshot.forEach((doc) => {
        const d = doc.data();
        const tanggal = doc.id;

        list.push({
          email: d.email,
          jamMasuk: d.jamMasuk,
          jamPulang: d.jamPulang,
          status: d.status as Status, // Casting status sesuai tipe Status
          catatan: d.catatan ?? "-", // Default value for catatan
          tanggal,
        });
      });

      list.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)); // Sort by date descending

      setData(list);
      setLoading(false); // Set loading to false once data is fetched
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Update statistics based on the selected date
  useEffect(() => {
    if (!selectedDate) return;

    // Filter data based on selected date
    const filteredData = data.filter((item) => item.tanggal === selectedDate);

    // Calculate the statistics
    const statusCount: Record<Status, number> = {
      WFH: 0,
      WFO: 0,
      CUTI: 0,
      "On-Site": 0,
      "No Input": 0,
    };

    filteredData.forEach((item) => {
      if (statusCount[item.status] !== undefined) {
        statusCount[item.status]++;
      } else {
        statusCount["No Input"]++;
      }
    });

    setStatistics(statusCount);
  }, [selectedDate, data]);

  // Filter data based on selected date, email filter, and search term
  const filteredData = data.filter((item) => {
    const cocokTanggal = !selectedDate || item.tanggal === selectedDate;
    const cocokEmail = !filterEmail || item.email.toLowerCase().includes(filterEmail.toLowerCase());
    const cocokSearch =
      !searchTerm ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    return cocokTanggal && cocokEmail && cocokSearch;
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Dynamic pagination logic to limit to 5 pages
  const pageNumbers = [];
  let startPage = Math.max(currentPage - 2, 1); // Start from 2 pages before current
  let endPage = Math.min(currentPage + 2, totalPages); // End at 2 pages after current

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages); // Show first 5 pages
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - 4, 1); // Show last 5 pages
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber); // Update page in the parent component
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when rows per page is changed
  };

  if (loading) return <p className="text-gray-800">Memuat data aktivitas...</p>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4 text-[#184A72]">Riwayat Aktivitas Pegawai</h2>

      {/* Statistik */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#184A72]">
          {selectedDate ? `Statistics for ${selectedDate}` : 'Select date to see statistics'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-[#EAF1F8] p-4 rounded-md text-center">
            <p className="text-sm text-[#1A3A6C]">WFH</p>
            <p className="text-xl font-semibold text-[#184A72]">{statistics.WFH}</p>
          </div>
          <div className="bg-[#EAF1F8] p-4 rounded-md text-center">
            <p className="text-sm text-[#1A3A6C]">WFO</p>
            <p className="text-xl font-semibold text-[#184A72]">{statistics.WFO}</p>
          </div>
          <div className="bg-[#EAF1F8] p-4 rounded-md text-center">
            <p className="text-sm text-[#1A3A6C]">CUTI</p>
            <p className="text-xl font-semibold text-[#184A72]">{statistics.CUTI}</p>
          </div>
          <div className="bg-[#EAF1F8] p-4 rounded-md text-center">
            <p className="text-sm text-[#1A3A6C]">On-Site</p>
            <p className="text-xl font-semibold text-[#184A72]">{statistics["On-Site"]}</p>
          </div>
        </div>
      </div>

      {/* Table with pagination */}
      {filteredData.length === 0 ? (
        <p className="text-sm text-gray-500">Data tidak ditemukan.</p>
      ) : (
        <div>
          <div className="mb-4 flex justify-between text-black">
            <div>
              <label htmlFor="rowsPerPage" className="text-l text-gray-800">show:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="ml-2 border px-2 py-1 rounded border-black"
              >
                <option className="text-gray-800" value={5}>5</option>
                <option className="text-gray-800" value={10}>10</option>
                <option className="text-gray-800" value={50}>50</option>
                <option className="text-gray-800" value={100}>100</option>
              </select>
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 border rounded ${currentPage === pageNumber ? 'bg-[#184A72] text-white' : 'text-[#184A72]'} hover:bg-[#143e5d]`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-[#184A72] rounded-lg shadow-lg">
              <thead className="bg-[#184A72] text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Tanggal</th>
                  <th className="px-6 py-3 text-center">Email</th>
                  <th className="px-6 py-3 text-center">Jam Masuk</th>
                  <th className="px-6 py-3 text-center">Jam Pulang</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Aktivitas</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentData.map((a, i) => (
                  <tr key={i} className="text-center border-b hover:bg-[#F4F6F9] text-gray-800">
                    <td className="px-6 py-4">{a.tanggal}</td>
                    <td className="px-6 py-4">{a.email}</td>
                    <td className="px-6 py-4">{a.jamMasuk}</td>
                    <td className="px-6 py-4">{a.jamPulang}</td>
                    <td className="px-6 py-4">{a.status}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedCatatan(a.catatan)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal to display selected catatan */}
      {selectedCatatan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-2 text-[#184A72]">Detail Aktivitas</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {selectedCatatan}
            </p>
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedCatatan(null)}
                className="px-4 py-2 bg-[#184A72] text-white rounded hover:bg-[#143e5d]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
