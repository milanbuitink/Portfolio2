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
    slug: "Timber-tunes",
    description: "Een serie over de schoonheid van stedelijke architectuur en het contrast tussen oud en nieuw in de moderne stad.",
    year: "2024",
    category: "Premaster",
    thumbnail: new URL('../../images/Timbertunes.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/Timbertunes.webp', import.meta.url).href, alt: "Stadsgezicht" },
      { src: new URL('../../images/ttvisie.webp', import.meta.url).href, alt: "Visie" },
      { src: new URL('../../images/ttbegane.webp', import.meta.url).href, alt:  "Begane grond" },
      { src: new URL('../../images/tteerste.webp', import.meta.url).href, alt: "Eerste verdieping" },
      { src: new URL('../../images/ttklimaat.webp', import.meta.url).href, alt: "Klimaat" },
      { src: new URL('../../images/gevelfragment.webp', import.meta.url).href, alt: "Eerste verdieping" },
      { src: new URL('../../images/details.webp', import.meta.url).href, alt: "Skyline" },
      { src: new URL('../../images/ttrenders.webp', import.meta.url).href, alt: "Architectuur" },
    ],
  },
  { id: "2",
    title: "THESIS TURIN",
    slug: "thesis-turin",
    description: "Een serie over de schoonheid van stedelijke architectuur en het contrast tussen oud en nieuw in de moderne stad.",
    year: "2025",
    category: "MSc 2",
    thumbnail: new URL('../../images/thesis.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/thesis.webp', import.meta.url).href, alt: "Thesis Turin" },
    ],
  },
  { id: "3",
    title: "PUBLIC BUILDING",
    slug: "portraits-of-silence",
    description: "Intieme portretten die de stilte en kwetsbaarheid van het menselijk bestaan vastleggen.",
    year: "2024",
    category: "Portrait",
    thumbnail: new URL('../../images/prototype.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/prototype.webp', import.meta.url).href, alt: "Portret 1" },
      { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80", alt: "Portret 2" },
      { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80", alt: "Portret 3" },
    ],
  },
  {
    id: "4",
    title: "SLOTERDRIJK",
    slug: "natural-elements",
    description: "De kracht en sereniteit van de natuur, vastgelegd in zijn meest pure vorm.",
    year: "2023",
    category: "Nature",
    thumbnail: new URL('../../images/Sloterdijk.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/Sloterdijk.webp', import.meta.url).href, alt: "Waterval" },
      { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80", alt: "Bergen" },
      { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80", alt: "Bos" },
    ],
  },
  {
    id: "5      ",
    title: "GRADUATION TUD",
    slug: "abstract-forms",
    description: "Experimentele fotografie die de grenzen tussen realiteit en abstractie verkent.",
    year: "2023",
    category: "Abstract",
    thumbnail: new URL('../../images/graduation.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/graduation.webp', import.meta.url).href , alt: "Abstract 1" },
      { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80", alt: "Abstract 2" },
      { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80", alt: "Abstract 3" },
    ],
  },
  {
    id: "6",
    title: "VILLA 10A",
    slug: "street-stories",
    description: "Momenten uit het dagelijks leven op straat, vol emotie en authenticiteit.",
    year: "2023",
    category: "Street",
    thumbnail: new URL('../../images/10a.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/10a.webp', import.meta.url).href, alt: "Straat 1" },
      { src: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&q=80", alt: "Straat 2" },
      { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80", alt: "Straat 3" },
    ],
  },
  {
    id: "7",
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

// ===========================================
// HOVER POSITIES - Pas hier de afbeelding-posities aan voor de homepage
// x: horizontale positie ("10%" = links, "50%" = midden, "90%" = rechts)
// y: verticale positie   ("10%" = boven, "50%" = midden, "90%" = onder)
// size: breedte van de afbeelding (bijv. "30vw", "400px", "50%")
// ===========================================

export interface HoverPosition {
  x: string;    // bijv. "40%", "200px"
  y: string;    // bijv. "50%", "300px"
  size: string; // bijv. "35vw", "400px"
}

export const projectHoverPositions: Record<string, HoverPosition> = {
  // Project ID :  { x (links/rechts), y (boven/onder), size (breedte) }
  
  "1": { x: "65%",  y: "54%",  size: "55vw" },   // TIMBER TUNES
  "2": { x: "40%",  y: "50%",  size: "70vw" },   // THESIS TURIN
  "3": { x: "50%",  y: "45%",  size: "100vw" },   // PUBLIC BUILDING
  "4": { x: "55%",  y: "40%",  size: "70vw" },   // SLOTERDRIJK
  "5": { x: "45%",  y: "55%",  size: "40vw" },   // GRADUATION TUD
  "6": { x: "50%",  y: "45%",  size: "34vw" },   // VILLA 10A
  "7": { x: "42%",  y: "48%",  size: "38vw" },   // GRADUATION TUD (2)
};

// Standaard positie als project niet in de tabel staat
export const defaultHoverPosition: HoverPosition = {
  x: "50%",
  y: "50%",
  size: "35vw",
};

// Haal hover-positie op voor een project (op basis van ID)
export const getHoverPosition = (projectId: string): HoverPosition => {
  return projectHoverPositions[projectId.trim()] ?? defaultHoverPosition;
};

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
