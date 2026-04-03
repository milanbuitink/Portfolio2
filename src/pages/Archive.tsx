import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import Header from "@/components/Header";
import OptimizedImage from "@/components/OptimizedImage";
import { getBlurPlaceholder } from "@/lib/blur-utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Archive = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Archive
            </h1>
            <p className="text-muted-foreground mt-4">
              {projects.length} Projects
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="group relative block"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <OptimizedImage
                    src={project.thumbnail}
                    alt={project.title}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-500",
                      hoveredId && hoveredId !== project.id
                        ? "opacity-30"
                        : "opacity-100",
                      "group-hover:scale-105"
                    )}
                    containerClassName="absolute inset-0"
                    blurDataURL={getBlurPlaceholder(project.thumbnail)}
                  />
                </div>

                {/* Info */}
                <div className="mt-3">
                  <h3
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Archive;
