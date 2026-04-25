import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectList />
      </main>
    </div>
  );
};

export default Projects;
