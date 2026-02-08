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
    portrait: "E:\\Portfolio Website\\Portfolio ll\\images\\milan-portret.png",
    
    // Je titel/rol
    title: "Architect & Ingenieur",
    
    // Je locatie
    location: "Nijkerk, Nederland",
    // Je biografie (meerdere paragrafen)
    bio: [
      "Welkom op mijn portfolio. Ik ben een architect en ingenieur gevestigd in Nijkerk, met een passie voor het ontwerpen en bouwen van duurzame en esthetische gebouwen.",
      "Mijn werk balanceert tussen commerciële opdrachten en persoonlijke projecten, altijd op zoek naar authenticiteit en innovatie in elk ontwerp.",
      "Met meer dan 10 jaar ervaring in de industrie heb ik samengewerkt met diverse klanten en projecten, waarbij ik een onderscheidende visuele taal heb ontwikkeld.",
    ],
    
    // Je specialisaties/focus gebieden
    specializations: [
      "Architectuur",
      "Ontwerpen",
      "Verduurzaming",
      "Duurzaamheid",
      "Bouwtechniek",
    ],
    
    // Contact informatie
    contact: {
      email: "milanbuitink03@gmail.com",
      mobiel: "06 42444390",
    },
  },

  // ===========================================
  // FOOTER TEKST
  // ===========================================
  footer: {
    copyright: `© ${new Date().getFullYear()} Alle rechten voorbehouden`,
  },
};
