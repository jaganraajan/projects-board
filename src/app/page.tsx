'use client';

import { useRouter } from "next/navigation";
import ProjectsBoard from "@/components/board/projects-board";
import { ProjectsBoardProvider } from "@/context/projects-board-context";
import { useAuth } from "@/context/auth-context";

function BoardLink() {
  const { user } = useAuth();
  if (!user?.company_name) return null;
  // Sanitize company name for subdomain: lowercase, remove spaces, etc.
  const sub = user.company_name.trim().toLowerCase().replace(/\s+/g, '-');
  const url = `https://${sub}.projects-board-zeta.vercel.app`;
  return (
    <div className="my-4 border p-3 rounded bg-gray-50 dark:bg-gray-900">
      <span className="font-semibold">Your Board URL: </span>
      <a href={url} className="text-blue-700 underline break-all" target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/login"); // Navigate to the login page
  };

  const navigateToRegister = () => {
    router.push("/register"); // Navigate to the login page
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        {/* Header with Login and Register Buttons */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Project Management Board 2</h1>
          <div className="flex gap-4">
            <button onClick={navigateToLogin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </button>
            <button onClick={navigateToRegister} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Register
            </button>
          </div>
        </header>
        <BoardLink />
        <ProjectsBoardProvider>
          <ProjectsBoard />
        </ProjectsBoardProvider>
      </div>
    </main>
  );
}