'use client';

import { useRouter } from "next/navigation";
import ProjectsBoard from "@/components/board/projects-board";
import { ProjectsBoardProvider } from "@/context/projects-board-context";

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
        
        <ProjectsBoardProvider>
          <ProjectsBoard />
        </ProjectsBoardProvider>
      </div>
    </main>
  );
}
