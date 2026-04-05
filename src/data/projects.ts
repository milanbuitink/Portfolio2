// ===========================================
// PROJECT DATA - Pas dit bestand aan om je projecten te beheren
// ===========================================

export interface ProjectImage {
  src: string | string[];
  alt: string;
  zoomable?: boolean;
  caption?: string;
  captions?: string[];
  width?: "full" | "half";
}

export interface ProjectInfo {
  jaar?: string;
  programma?: string;
  locatie?: string;
  course?: string;
  studietijd?: string;
  cijfer?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  year?: string;
  category?: string;
  subtext?: string[];
  info: ProjectInfo;
  thumbnail: string;
  images: ProjectImage[];
}

// Helper: maak een image expliciet inzoombaar (opt-in)
export const zoomable = (image: ProjectImage): ProjectImage => ({
  ...image,
  zoomable: true,
});

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
    subtext: [
      "Tijdens het laatste vak van mijn premaster stond één opgave centraal: het ontwerpen van een poppodium dat niet op zichzelf staat, maar zich verweeft met een bestaande context. In dit geval de voormalige gistfabriek in Delft, een plek met een sterk industrieel karakter en een rijke geschiedenis. De uitdaging lag niet alleen in het creëren van nieuwe architectuur, maar juist in het aangaan van een dialoog met het bestaande.",
      "Het project vroeg om een integrale benadering. Hoe laat je oud en nieuw samenwerken, zonder dat één van de twee zijn identiteit verliest? Hoe ontwerp je een gebouw dat bestand is tegen de intensiteit van harde muziek en grote bezoekersstromen, terwijl comfort en techniek op hoog niveau blijven functioneren? Denk hierbij aan bouwfysische vraagstukken zoals akoestiek, met box-in-box principes, en geavanceerde ventilatieconcepten voor een gezond binnenklimaat.",
      "Binnen deze complexiteit heb ik mijn ontwerp benaderd vanuit drie heldere principes. Duurzaamheid speelde daarin een belangrijke rol. Door waar mogelijk te kiezen voor hout, zowel in constructie als in gevelafwerking, ontstaat een bewuste tegenstelling met de robuuste, industriële baksteen van de bestaande fabriek. Deze materialisatie versterkt de leesbaarheid van oud en nieuw, zonder de samenhang te verliezen.",
    ],
    info: {
      jaar: "2024",
      programma: "Poppodium",
      locatie: "Delft",
      course: "ON6, Premaster",
      studietijd: "7 weken",
      cijfer: "8.0",
    },
    thumbnail: new URL('../../images/timbertunes/Timbertunes.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/timbertunes/Timbertunes.webp', import.meta.url).href, alt: "Stadsgezicht" },
      { src: new URL('../../images/timbertunes/ttvisie.png', import.meta.url).href, alt: "Visie", width: "half" },
      { 
        src: [
          new URL('../../images/timbertunes/ttbegane.webp', import.meta.url).href,
          new URL('../../images/timbertunes/tteerste.webp', import.meta.url).href,
        ], 
        alt: "Een carrousel van de begane grond en de eerste verdieping.",
        captions: ["Begane grond", "1e verdieping"],
      },
      {
        src: [
          new URL('../../images/timbertunes/ttklimaatz.png', import.meta.url).href,
          new URL('../../images/timbertunes/ttklimaatw.png', import.meta.url).href,
        ],
        alt: "Klimaat",
        captions: ["Zomer", "Winter"],
      },
      { src: new URL('../../images/timbertunes/gevelfragment.png', import.meta.url).href, alt: "Eerste verdieping" },
      {
        src: [
          new URL('../../images/timbertunes/detail1.png', import.meta.url).href,
          new URL('../../images/timbertunes/detail2.png', import.meta.url).href,
          new URL('../../images/timbertunes/detail3.png', import.meta.url).href,
        ],
        alt: "Details",
        captions: [""],
      },
       { src: new URL('../../images/timbertunes/krachtschema.jpg', import.meta.url).href, alt: "Architectuur" },
      {
        src: [
          new URL('../../images/timbertunes/render1.webp', import.meta.url).href,
          new URL('../../images/timbertunes/render2.webp', import.meta.url).href,
          new URL('../../images/timbertunes/render3.webp', import.meta.url).href,
          new URL('../../images/timbertunes/render4.webp', import.meta.url).href,
          new URL('../../images/timbertunes/render5.webp', import.meta.url).href,
          new URL('../../images/timbertunes/ttmodel.webp', import.meta.url).href,
          new URL('../../images/timbertunes/qr.webp', import.meta.url).href,
        ],
        alt: "Renders",
        captions: [],
      },
      
    ],
  },
  { id: "2",
    title: "SLOTERDIJK",
    slug: "sloterdijk",
    description: "Een serie over de schoonheid van stedelijke architectuur en het contrast tussen oud en nieuw in de moderne stad.",
    year: "2025",
    category: "MSc 1",
    info: {
      jaar: "2025",
      programma: "Woongebouw",
      locatie: "Sloterdijk, Amsterdam",
      course: "Fundamentals of housing design",
      studietijd: "18 weken",
      cijfer: "8.0",
    },
    thumbnail: new URL('../../images/sloterdijk/sloterdijkaxo.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/sloterdijk/sloterdijkaxo.webp', import.meta.url).href, alt: "Sloterdijk" },
      { src: new URL('../../images/sloterdijk/principles.webp', import.meta.url).href, alt: "Stadsgezicht" },
      { src: new URL('../../images/sloterdijk/dwellingtypes.webp', import.meta.url).href, alt: "Stadsgezicht" },
       {
        src: [
          new URL('../../images/sloterdijk/begane.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/25.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/68.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/911.webp', import.meta.url).href,
        ],
        alt: "Sloterdijk",
        captions: ["Begane grond", "2e - 5e verdieping", "6e - 8e verdieping", "9e - 11e verdieping"],
      },

      {
        src: [
          new URL('../../images/sloterdijk/gallery.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/corridor.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/maisonette.webp', import.meta.url).href,
        ],
        alt: "Sloterdijk",
        captions: ["Gallery", "Corridor", "Maisonette"],
      },
   { src: new URL('../../images/sloterdijk/klimaat.jpg', import.meta.url).href, alt: "Stadsgezicht" },
      { src: new URL('../../images/sloterdijk/fragment.webp', import.meta.url).href, alt: "Stadsgezicht" },
         {
        src: [
          new URL('../../images/sloterdijk/detail 1.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/detail 2.webp', import.meta.url).href,
          new URL('../../images/sloterdijk/detail 3.webp', import.meta.url).href,
        ],
        alt: "Sloterdijk",
        captions: ["Detail 1", "Detail 2", "Detail 3"],
      },

        {
          src: [
            new URL('../../images/sloterdijk/voor.webp', import.meta.url).href,
            new URL('../../images/sloterdijk/achter.webp', import.meta.url).href,
            new URL('../../images/sloterdijk/puntdak.webp', import.meta.url).href,
            new URL('../../images/sloterdijk/totaalmodel.webp', import.meta.url).href,
            new URL('../../images/sloterdijk/fragmentmodel.webp', import.meta.url).href,
          ],
          alt: "Sloterdijk",
          captions: [],
        },
   
    ],
  },
  { id: "3",
    title: "PUBLIC BUILDING",
    slug: "portraits-of-silence",
    description: "Intieme portretten die de stilte en kwetsbaarheid van het menselijk bestaan vastleggen.",
    year: "2024",
    category: "Portrait",
    info: {
      jaar: "2024",
      programma: "Portrait",
      locatie: "",
      course: "",
      studietijd: "",
      cijfer: "",
    },
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
    info: {
      jaar: "2023",
      programma: "Nature",
      locatie: "",
      course: "",
      studietijd: "",
      cijfer: "",
    },
    thumbnail: new URL('../../images/sloterdijk/sloterdijkaxo.webp', import.meta.url).href,
    images: [
      { src: new URL('../../images/sloterdijk/sloterdijkaxo.webp', import.meta.url).href, alt: "Sloterdijk" },
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
    info: {
      jaar: "2023",
      programma: "Abstract",
      locatie: "",
      course: "",
      studietijd: "",
      cijfer: "",
    },
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
    info: {
      jaar: "2023",
      programma: "Street",
      locatie: "",
      course: "",
      studietijd: "",
      cijfer: "",
    },
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
    info: {
      jaar: "2022",
      programma: "Architecture",
      locatie: "",
      course: "",
      studietijd: "",
      cijfer: "",
    },
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
