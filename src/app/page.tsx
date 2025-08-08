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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with Login and Register Buttons */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Project Management Board
            {user?.company_name && (
              <a
                href={`https://${user.company_name.trim().toLowerCase().replace(/\s+/g, '-')}.projects-board-zeta.vercel.app`}
                className="text-blue-500 underline ml-2 text-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                ({user.company_name})
              </a>
            )}
          </h1>
          <div className="flex gap-3">
            {user ? (
              <button 
                onClick={handleSignOut} 
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button 
                  onClick={navigateToLogin} 
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={navigateToRegister} 
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
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