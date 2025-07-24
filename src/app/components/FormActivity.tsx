"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function FormActivity() {
  const [jamMasuk, setJamMasuk] = useState("");
  const [jamPulang, setJamPulang] = useState("");
  const [status, setStatus] = useState("WFH");
  const [catatan, setCatatan] = useState(""); 
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();
  if (loading) return <p className="text-gray-500">Memuat data user...</p>;
  if (!user) return <p className="text-red-500">User belum login.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (jamMasuk >= jamPulang) {
      alert("Jam Masuk tidak boleh setelah atau sama dengan Jam Pulang.");
      return;
    }

    const uid = user.uid;
    const today = new Date();
     today.setDate(today.getDate() ); // Adjust for 2 days ago, or any value


      const formattedDate = today.toISOString().split("T")[0];  // "2025-07-24" (for example)

    try {
      await setDoc(doc(db, "activities", uid, "hari", formattedDate), {
        jamMasuk,
        jamPulang,
        status,
        catatan, // ✅ simpan catatan ke Firestore
        createdAt: serverTimestamp(),
        email: user.email,
      });

      setSuccess(true);
      setJamMasuk("");
      setJamPulang("");
      setStatus("WFH");
      setCatatan(""); 

      router.push("/dashboard");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Gagal simpan aktivitas", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-[#184A72] mb-4">Input Aktivitas Hari Ini</h2>

      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Jam Masuk</label>
        <input
          type="time"
          className="w-full border px-3 py-2 rounded text-black"
          value={jamMasuk}
          onChange={(e) => setJamMasuk(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Jam Pulang</label>
        <input
          type="time"
          className="w-full border px-3 py-2 rounded text-black"
          value={jamPulang}
          onChange={(e) => setJamPulang(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Status Kerja</label>
        <select
          className="w-full border px-3 py-2 rounded text-black"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="WFH">WFH</option>
          <option value="WFO">WFO</option>
          <option value="On-Site">On-Site</option>
          <option value="Cuti">Cuti</option>
        </select>
      </div>

      {/* ✅ input catatan aktivitas */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Aktivitas Hari Ini</label>
        <textarea
          className="w-full border px-3 py-2 rounded text-black"
          rows={4}
          placeholder="Tulis aktivitas pekerjaan hari ini..."
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#184A72] text-white font-semibold py-2 rounded hover:bg-[#143e5d]"
      >
        Simpan Aktivitas
      </button>

      {success && (
        <p className="text-green-600 text-sm mt-3">Aktivitas berhasil disimpan ✅</p>
      )}
    </form>
  );
}
