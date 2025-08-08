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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form
        onSubmit={handleRegister}
        className="w-80 bg-white p-6 rounded shadow-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            name="company_name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your company name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          onClick={navigateBack}
          className="w-full mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Back
        </button>
      </form>
    </div>
  );
}