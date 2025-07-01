import ProjectsBoard from "@/components/board/projects-board";
import { ProjectsBoardProvider } from "@/context/projects-board-context";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Project Management Board 2</h1>
        <ProjectsBoardProvider>
          <ProjectsBoard />
        </ProjectsBoardProvider>
      </div>
    </main>
  );
}
