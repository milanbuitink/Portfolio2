import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProjectBySlug, getAdjacentProjects } from "@/data/projects";
import Header from "@/components/Header";
import { useEffect } from "react";

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { prev, next } = slug ? getAdjacentProjects(slug) : { prev: null, next: null };

  useEffect(() => {
    // Scroll naar top bij pagina wissel
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Project niet gevonden</h1>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-32">
        {/* Hero Image */}
        <section className="w-full px-4 md:px-8 lg:px-16 mb-12 md:mb-16">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src={project.images[0]?.src || project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Project Info */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
                {project.title}
              </h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{project.year}</span>
                <span>•</span>
                <span>{project.category}</span>
              </div>
            </div>
            <div className="md:pt-4">
              <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="px-4 md:px-8 lg:px-16 space-y-4 md:space-y-8">
          {project.images.slice(1).map((image, index) => (
            <div
              key={index}
              className="relative w-full overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </section>

        {/* Navigation */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 mt-16 md:mt-24">
          <div className="flex justify-between items-center border-t border-border pt-8">
            {prev ? (
              <button
                onClick={() => navigate(`/project/${prev.slug}`)}
                className="group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                <div className="text-left">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Vorig project
                  </span>
                  <span className="text-lg font-medium">{prev.title}</span>
                </div>
              </button>
            ) : (
              <div />
            )}

            {next ? (
              <button
                onClick={() => navigate(`/project/${next.slug}`)}
                className="group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300 text-right"
              >
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">
                    Volgend project
                  </span>
                  <span className="text-lg font-medium">{next.title}</span>
                </div>
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Project;
