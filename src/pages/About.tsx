import Header from "@/components/Header";
import OptimizedImage from "@/components/OptimizedImage";
import { getBlurPlaceholder } from "@/lib/blur-utils";
import { siteConfig } from "@/data/siteConfig";

const About = () => {
  const { about } = siteConfig;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Portrait */}
            <div className="relative self-start pt-8 lg:pt-16">
              <div className="relative aspect-[3/4] overflow-hidden">
                <OptimizedImage
                  src={about.portrait}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  containerClassName="absolute inset-0"
                  blurDataURL={getBlurPlaceholder(about.portrait)}
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
                <p className="text-[0.81rem] text-muted-foreground">{about.title}</p>
                <p className="text-[0.63rem] text-muted-foreground mt-1">
                  {about.location}
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-6 mb-16">
                {about.bio.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              

              {/* Clients */}
              {about.clients && about.clients.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Selected Clients
                  </h2>
                  <p className="text-[0.72rem] text-muted-foreground">
                    {about.clients.join(" · ")}
                  </p>
                </div>
              )}

              {/* Werkervaring & Opleidingen are shown below as two columns */}

              {/* Contact */}
              <div>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Contact
                </h2>
                <div className="space-y-2">
                  <a
                    href={`mailto:${about.contact.email}`}
                    className="block text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground hover:opacity-60 transition-opacity duration-300"
                  >
                    {about.contact.email}
                  </a>
                  {about.contact.phone && (
                    <a
                      href={`tel:${about.contact.phone.replace(/\s+/g, "")}`}
                      className="block text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground hover:opacity-60 transition-opacity duration-300"
                    >
                      {about.contact.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Two-column Work Experience & Education section placed after initial content */}
        <section className="max-w-6xl mx-auto px-0 md:px-8 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Work Experience Column */}
            <div>
              {about.workExperience && about.workExperience.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Werkervaring
                  </h2>
                  <div className="space-y-6">
                    {about.workExperience.map((item) => (
                      <div key={`${item.period}-${item.role}`} className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {item.period}
                        </p>
                        <h3 className="text-base md:text-lg font-medium leading-tight">
                          {item.role}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.company}</p>
                        {item.description && item.description.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {item.description.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Education Column */}
            <div>
              {about.education && about.education.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Opleidingen
                  </h2>
                  <div className="space-y-6">
                    {about.education.map((item) => (
                      <div key={`${item.period}-${item.program}`} className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {item.period}
                        </p>
                        <h3 className="text-base md:text-lg font-medium leading-tight">{item.program}</h3>
                        <p className="text-sm text-muted-foreground">{item.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
