import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 md:px-8"
      onMouseMove={handleMouseMove}
    >
      {/* Project hover images */}
      {projects.map((project) => (
        <div
          key={`image-${project.id}`}
          className={cn(
            "fixed pointer-events-none z-30 transition-opacity duration-300 ease-out",
            hoveredProject === project.id ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-64 md:w-80 lg:w-96 h-auto object-cover"
          />
        </div>
      ))}

      {/* Project lijst */}
      <nav className="relative z-20 text-center py-32">
        <ul className="space-y-2 md:space-y-3">
          {projects.map((project, index) => {
            // Bereken opacity voor gradatie effect (donker naar licht)
            const opacity = 1 - (index / (projects.length - 1)) * 0.5;

            return (
              <li key={project.id}>
                <Link
                  to={`/project/${project.slug}`}
                  className="block group"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <span
                    className="text-3xl md:text-5xl lg:text-7xl font-semibold tracking-tight transition-all duration-300 group-hover:tracking-wider"
                    style={{
                      opacity: hoveredProject
                        ? hoveredProject === project.id
                          ? 1
                          : 0.2
                        : opacity,
                    }}
                  >
                    {project.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ProjectList;
