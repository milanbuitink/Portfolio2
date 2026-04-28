// ===========================================
// SITE CONFIGURATIE - Pas dit bestand aan om je site te personaliseren
// ===========================================

export const siteConfig = {
  // ===========================================
  // JOUW NAAM - Dit verschijnt in de header
  // ===========================================
  name: "MILAN BUITINK",
  
  // ===========================================
  // NAVIGATIE LINKS
  // ===========================================
  navigation: {
    archive: "Archive",
    about: "About",
  },

  // ===========================================
  // ABOUT/BIO PAGINA - Pas dit aan met jouw informatie
  // ===========================================
  about: {
    // Je portretfoto URL
    portrait: new URL('../../images/milan-portret.webp', import.meta.url).href,
    
    // Je titel/rol
    title: "Architect & Ingenieur",
    
    // Je locatie
    location: "Nijkerk, Nederland",
    // Je biografie (meerdere paragrafen)
    bio: [
      "Welkom op mijn portfolio. Ik ben een student Architectuur en heb daarnaast mijn diploma Bouwkunde behaald. In dit portfolio presenteer ik een selectie van mijn werk en ontwikkeling binnen het vakgebied.",
      "Mijn passie ligt bij het ontwerpen van gebouwen die niet alleen esthetisch sterk zijn, maar ook technisch doordacht. Dankzij mijn studieachtergrond heb ik zowel op het gebied van ontwerp als bouwtechniek brede kennis opgebouwd. Deze combinatie stelt mij in staat om ontwerpen te maken die niet alleen visueel aantrekkelijk zijn, maar ook uitvoerbaar en realistisch.",
      "Ik hecht veel waarde aan de technische haalbaarheid van mijn ontwerpen. Daarnaast ben ik sterk geïnteresseerd in duurzaamheid en innovatie. Ik zoek continu naar manieren om met mijn werk bij te dragen aan een toekomstbestendige gebouwde omgeving, waarin verantwoord omgaan met klimaat en materialen centraal staat.",
    ],
    
    // Je specialisaties/focus gebieden
    specializations: [
   
    ],

    workExperience: [
       {
        period: "2017 - 2019",
        role: "Vakkenvuller",
        company: "Boni Supermarkt, Nijkerk",
      },
      {
        period: "2019 - 2023",
        role: "Eerste verkoopmedewerker",
        company: "Boni Supermarkt, Nijkerk",
        description: [
          "Zelfstandig verantwoordelijk voor het aansturen van het team tijdens avond- en zondagdiensten.",
          "Operationele leiding op de werkvloer.",
        ],
      },
      {
        period: "2023",
        role: "Stagiair (6 maanden)",
        company: "AG Nova, Amersfoort",
      },
      {
        period: "2023",
        role: "Technisch ontwerper (5 maanden)",
        company: "AG Nova, Amersfoort",
      },
      {
        period: "2025 - 2026",
        role: "Tekenaar / Werkvoorbereider (5 maanden)",
        company: "Folkers Toegangstechniek",
      },
    ],

    education: [
      {
        period: "2024 - heden",
        program: "MSc Architecture, Urbanism and Building Sciences",
        institution: "Technische Universiteit Delft",
      },
      {
        period: "2024",
        program: "WO premaster (Architectuur)",
        institution: "Technische Universiteit Delft",
      },
      {
        period: "2019 - 2023",
        program: "HBO Bouwkunde",
        institution: "Hogeschool Windesheim, Zwolle",
      },
      {
        period: "2013 - 2019",
        program: "HAVO",
        institution: "Corlaer College, Nijkerk",
      },
    ],
    
    // Contact informatie
    contact: {
      email: "milanbuitink03@gmail.com",
      phone: "+31 6 42644390",
      instagram: "@milanbuitink",
    },
  },

  // ===========================================
  // FOOTER TEKST
  // ===========================================
  footer: {
    copyright: `© ${new Date().getFullYear()} Alle rechten voorbehouden`,
  },
};
