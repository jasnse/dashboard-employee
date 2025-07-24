"use client";

import { useState } from "react";
import ActivityTable from "../components/ActivityTable";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import useAuth from "../hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // State to hold filter values
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterEmail, setFilterEmail] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);  // Lift currentPage here

  // Reset filters to default
  const handleResetFilters = () => {
    setSelectedDate("");
    setFilterEmail("");
    setSearchTerm("");  // Reset search term as well
    setCurrentPage(1);  // Reset page to 1 on reset
  };

  // Reset page to 1 when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Force reset to page 1 when search term changes
  };

  if (loading) return <p className="text-gray-400">Memuat user...</p>;
  if (!user) return <p className="text-red-500">User belum login.</p>;

  const nama =
    user.displayName ?? 
    user.email?.split("@")[0].split(".").join(" ") ?? 
    "User";

  return (
    <div className="p-6 bg-[#F8F9FB] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#184A72]">
          <span className="text-[#56B4B3] mr-2">
            <Typewriter
              words={["Hola,", "Hallo,", "Bonjour,", "こんにちは,", "안녕하세요,"]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={60}
              delaySpeed={1500}
            />
          </span>
          {nama} 👋
        </h1>

        <button
          onClick={() => router.push("/form-activity")}
          className="bg-[#184A72] text-white px-4 py-2 rounded-md hover:bg-[#56B4B3] transition-all"
        >
          Input Aktivitas
        </button>
      </div>

      {/* Filter Area */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-md border-[#184A72] focus:outline-none focus:ring-2 focus:ring-[#56B4B3] text-black"
        />
        {/* <input
          type="text"
          placeholder="Search employee"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="px-4 py-2 border rounded-md border-[#184A72] focus:outline-none focus:ring-2 focus:ring-[#56B4B3] text-black"
        /> */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}  // Ensure that searchTerm is updated here
          onChange={handleSearchChange} // Update searchTerm state and reset page
          className="px-4 py-2 border rounded-md border-[#184A72] focus:outline-none focus:ring-2 focus:ring-[#56B4B3] text-black"
        />
        <button
          onClick={handleResetFilters}
          className="bg-[#56B4B3] text-white px-4 py-2 rounded-md hover:bg-[#184A72] transition-all"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <ActivityTable
        selectedDate={selectedDate}
        filterEmail={filterEmail}
        searchTerm={searchTerm}
        currentPage={currentPage} // Pass currentPage as a prop
        setCurrentPage={setCurrentPage} // Pass setCurrentPage to allow ActivityTable to modify it
      />
    </div>
  );
}
