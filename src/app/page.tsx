'use client';

import { useRouter } from "next/navigation";
import ProjectsBoard from "@/components/board/projects-board";
import { useAuth } from "@/context/auth-context";

// function BoardLink() {
//   const { user } = useAuth();
//   if (!user?.company_name) return null;
//   // Sanitize company name for subdomain: lowercase, remove spaces, etc.
//   const sub = user.company_name.trim().toLowerCase().replace(/\s+/g, '-');
//   const url = `https://${sub}.projects-board-zeta.vercel.app`;
//   return (
//     <div className="my-6 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
//       <div className="flex items-center space-x-2">
//         <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//         </svg>
//         <span className="font-medium text-blue-900 dark:text-blue-100">Your Board URL:</span>
//       </div>
//       <a 
//         href={url} 
//         className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline break-all text-sm mt-1 block transition-colors duration-200" 
//         target="_blank" 
//         rel="noopener noreferrer"
//       >
//         {url}
//       </a>
//     </div>
//   );
// }

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with Login and Register Buttons */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
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