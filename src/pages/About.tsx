import Header from "@/components/Header";
import { siteConfig } from "@/data/siteConfig";

const About = () => {
  const { about } = siteConfig;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Portrait */}
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden sticky top-24">
                <img
                  src={about.portrait}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Content */}
            <div className="py-8 lg:py-16">
              {/* Titel & Locatie */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
                  {siteConfig.name}
                </h1>
                <p className="text-lg text-muted-foreground">{about.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {about.location}
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-6 mb-16">
                {about.bio.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg md:text-xl font-light leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Specialisaties */}
              <div className="mb-16">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Focus
                </h2>
                <div className="flex flex-wrap gap-3">
                  {about.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-4 py-2 border border-border text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clients */}
              {about.clients && about.clients.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Selected Clients
                  </h2>
                  <p className="text-muted-foreground">
                    {about.clients.join(" · ")}
                  </p>
                </div>
              )}

              {/* Contact */}
              <div>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Contact
                </h2>
                <div className="space-y-2">
                  <a
                    href={`mailto:${about.contact.email}`}
                    className="block text-lg hover:opacity-60 transition-opacity duration-300"
                  >
                    {about.contact.email}
                  </a>
                  <a
                    href={`https://instagram.com/${about.contact.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lg hover:opacity-60 transition-opacity duration-300"
                  >
                    {about.contact.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
