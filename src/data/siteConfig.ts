// ===========================================
// SITE CONFIGURATIE - Pas dit bestand aan om je site te personaliseren
// ===========================================

export const siteConfig = {
  // ===========================================
  // JOUW NAAM - Dit verschijnt in de header
  // ===========================================
  name: "Jouw Naam",
  
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
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    
    // Je titel/rol
    title: "Fotograaf & Creative Director",
    
    // Je locatie
    location: "Amsterdam, Nederland",
    
    // Je biografie (meerdere paragrafen)
    bio: [
      "Welkom op mijn portfolio. Ik ben een fotograaf en creative director gevestigd in Amsterdam, met een passie voor het vastleggen van momenten die verhalen vertellen.",
      "Mijn werk balanceert tussen commerciële opdrachten en persoonlijke projecten, altijd op zoek naar authenticiteit en emotie in elk beeld.",
      "Met meer dan 10 jaar ervaring in de industrie heb ik samengewerkt met diverse merken en publicaties, waarbij ik een onderscheidende visuele taal heb ontwikkeld.",
    ],
    
    // Je specialisaties/focus gebieden
    specializations: [
      "Portrait Photography",
      "Commercial Work",
      "Editorial",
      "Art Direction",
    ],
    
    // Clients/merken waarmee je hebt gewerkt (optioneel)
    clients: [
      "Nike",
      "Vogue",
      "Apple",
      "Adidas",
      "GQ Magazine",
    ],
    
    // Contact informatie
    contact: {
      email: "hello@jouwdomein.nl",
      instagram: "@jouwinstagram",
    },
  },

  // ===========================================
  // FOOTER TEKST
  // ===========================================
  footer: {
    copyright: `© ${new Date().getFullYear()} Alle rechten voorbehouden`,
  },
};
