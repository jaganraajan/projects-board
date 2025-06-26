import ProjectsBoard from "@/components/board/projects-board";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Project Management Board</h1>
        <ProjectsBoard />
      </div>
    </main>
  );
}
