"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Login gagal. Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F4]">
      <div className="mb-6">
        <img src="/logo-skyworx.png" alt="Skyworx" className="h-20" />
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm border-t-4 border-[#56B4B3]"
      >
        <h2 className="text-2xl font-bold text-[#184A72] mb-6 text-center">Login Pegawai</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#56B4B3] text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#56B4B3] text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#184A72] text-white font-semibold py-2 rounded hover:bg-[#143e5d] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
