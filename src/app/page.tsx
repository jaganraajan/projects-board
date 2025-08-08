'use client';

import { useRouter } from "next/navigation";
import ProjectsBoard from "@/components/board/projects-board";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigateToLogin = () => {
    router.push("/login"); // Navigate to the login page
  };

  const navigateToRegister = () => {
    router.push("/register"); // Navigate to the login page
  };

  const handleSignOut = () => {
    logout();
    router.push("/"); // Navigate to home page after logout
  };

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with Login and Register Buttons */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Project Management Board
            {user?.company_name && (
              <a
                href={`https://${user.company_name.trim().toLowerCase().replace(/\s+/g, '-')}.projects-board-zeta.vercel.app`}
                className="text-blue-400 underline ml-2 text-lg hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                ({user.company_name ? user.company_name : user.email})
              </a>
            )}
          </h1>
          <div className="flex gap-3">
            {user ? (
              <button 
              onClick={handleSignOut} 
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg shadow-md transition-all duration-200 font-medium"
            >
              Sign Out
            </button>
            ) : (
              <>
                <button 
                  onClick={navigateToLogin} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-md transition-all duration-200 font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={navigateToRegister} 
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-md transition-all duration-200 font-medium"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </header>
        <ProjectsBoard />
      </div>
    </main>
  );
}