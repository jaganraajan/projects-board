'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    if (email && password) {
      setLoading(true);
      const ok = await login(email, password);
      setLoading(false);
      if (ok) {
        router.push("/");
      } else {
        alert("Login failed.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const navigateBack = () => {
    router.push("/"); // Navigate back to the home page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Login</h2>
      <form className="w-80 bg-gray-800 p-6 rounded shadow-md border border-gray-700" onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-200">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={navigateBack}
          className="w-full mt-4 px-4 py-2 bg-gray-600 text-gray-100 rounded hover:bg-gray-700 transition-colors duration-200"
        >
          Back
        </button>
      </form>
    </div>
  );
}