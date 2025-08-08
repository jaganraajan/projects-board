'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const company_name = form.company_name.value;

    if (email && password && company_name) {
      setLoading(true);
      const ok = await register(email, password, company_name);
      setLoading(false);
      if (ok) {
        router.push("/login");
      } else {
        alert("Registration failed.");
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
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Register</h2>
      <form
        onSubmit={handleRegister}
        className="w-80 bg-gray-800 p-6 rounded shadow-md border border-gray-700"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-200">Company Name</label>
          <input
            type="text"
            name="company_name"
            className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="Your company name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>
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
          {loading ? "Registering..." : "Register"}
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