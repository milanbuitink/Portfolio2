// ===========================================
// PROJECT DATA - Pas dit bestand aan om je projecten te beheren
// ===========================================

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  year: string;
  category: string;
  thumbnail: string;
  images: ProjectImage[];
}

// ===========================================
// JOUW PROJECTEN - Voeg hier je projecten toe
// ===========================================

export const projects: Project[] = [
  {
    id: "1",
    title: "TIMBER TUNES",
    slug: "urban-landscapes",
    description: "Een serie over de schoonheid van stedelijke architectuur en het contrast tussen oud en nieuw in de moderne stad.",
    year: "2024",
    category: "Photography",
    thumbnail: new URL('../../images/Timbertunes.png', import.meta.url).href,
    images: [
      { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80", alt: "Stadsgezicht" },
      { src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", alt: "Skyline" },
      { src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80", alt: "Architectuur" },
    ],
  },
  {
    id: "2",
    title: "PUBLIC BUILDING",
    slug: "portraits-of-silence",
    description: "Intieme portretten die de stilte en kwetsbaarheid van het menselijk bestaan vastleggen.",
    year: "2024",
    category: "Portrait",
    thumbnail: new URL('../../images/pbposter.png', import.meta.url).href,
    images: [
      { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80", alt: "Portret 1" },
      { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", alt: "Portret 2" },
      { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80", alt: "Portret 3" },
    ],
  },
  {
    id: "3",
    title: "SLOTERDRIJK",
    slug: "natural-elements",
    description: "De kracht en sereniteit van de natuur, vastgelegd in zijn meest pure vorm.",
    year: "2023",
    category: "Nature",
    thumbnail: new URL('../../images/Sloterdijk.png', import.meta.url).href,
    images: [
      { src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80", alt: "Waterval" },
      { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80", alt: "Bergen" },
      { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80", alt: "Bos" },
    ],
  },
  {
    id: "4",
    title: "GRADUATION TUD",
    slug: "abstract-forms",
    description: "Experimentele fotografie die de grenzen tussen realiteit en abstractie verkent.",
    year: "2023",
    category: "Abstract",
    thumbnail: new URL('../../images/milan-portret.png', import.meta.url).href,
    images: [
      { src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80", alt: "Abstract 1" },
      { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80", alt: "Abstract 2" },
      { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80", alt: "Abstract 3" },
    ],
  },
  {
    id: "5",
    title: "VILLA 10A",
    slug: "street-stories",
    description: "Momenten uit het dagelijks leven op straat, vol emotie en authenticiteit.",
    year: "2023",
    category: "Street",
    thumbnail: "https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=1200&q=80", alt: "Straat 1" },
      { src: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&q=80", alt: "Straat 2" },
      { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80", alt: "Straat 3" },
    ],
  },
  {
    id: "6",
    title: "GRADUATION TUD",
    slug: "minimal-spaces",
    description: "Architecturale composities die de schoonheid van leegte en vorm benadrukken.",
    year: "2022",
    category: "Architecture",
    thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80", alt: "Ruimte 1" },
      { src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80", alt: "Ruimte 2" },
      { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80", alt: "Ruimte 3" },
    ],
  },
];

// Helper functie om een project te vinden op slug
export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

// Helper functie om volgende/vorige project te krijgen
export const getAdjacentProjects = (currentSlug: string) => {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  };
};
