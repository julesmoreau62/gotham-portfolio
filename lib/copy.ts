/* ------------------------------------------------------------------
   COPY — every visible string of the home page, in English and French.
   The French object must mirror the English one.
   ------------------------------------------------------------------ */

import type { ContractSlug } from "@/lib/contracts"
import type { Locale } from "@/lib/i18n"
import { PROJECT_STORIES, type HomeSectionId, type ProjectStory, type StorySlug } from "@/lib/journey"


const en = {
  sections: {
    hero: "Start",
    contracts: "Selected work",
  } as Record<HomeSectionId, string>,

  nav: {
    skip: "Skip to content",
    home: "Home",
    tagline: "// Digital transformation & AI",
    sections: "Sections",
    sectionIndex: "Section index",
    storyNav: "Story navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    switchTo: { label: "Version française", short: "FR", lang: "fr" },
  },

  hero: {
    kicker: "A player's perspective",
    portfolio: "Jules Moreau / Portfolio 2026",
    availability: "Open to an internship",
    window: "FEB — JUN 2027",
    role: "Digital transformation & AI",
    title: ["Upgrade", "the game."],
    specialty: "AI, automation and better processes for sport organisations.",
    intro: "Club communication, partnerships and events showed me where small sport organisations lose time. Now I build the AI tools and automations that give it back, and help teams actually use them. M2 International Sport Administration student in Lille, writing my thesis on generative AI in sports associations.",
    explore: "Explore my work",
    talk: "Let's talk",
    stamp: ["FROM THE FIELD", "TO THE TOOLS."],
    edge: "WITH THE TEAM / INSIDE THE TOOLS",
  },

  work: {
    chapter: "02 / Selected work",
    chapterRight: "Four projects / AI, tools & the field",
    title: ["Find the friction.", "Build the tool."],
    introLabel: "Real teams. Real tools.",
    intro: "An AI workspace I built for my thesis, fed by a research engine running 24/7. A sponsor system built so a club can run it without me. Then the tournament and the season where I learned how sport organisations really work.",
    languageNote: "",
    status: { "ono-sendai": "In daily use", daring: "Built to last", "field-ops": "On the ground", signal: "Built from scratch" },
    terminal: {
      title: "jules@portfolio: ~/projects — zsh",
      region: "Interactive terminal: type a command to explore the projects",
      inputLabel: "Type a command, for example: open daring",
      monitor: "Monitor",
      suggestions: "Try",
      fetch: { role: "role", field: "field", fieldValue: "Sport organisations", status: "status", base: "based in", tools: "tools" },
      featured: "featured/",
      archive: "archive/",
      projects: "projects",
      hint: ["Type ", "open <project>", " or click a line · ", "help", " lists every command."],
      helpTitle: "Commands",
      help: [
        ["ls [-a]", "list the projects, -a adds the archive"],
        ["cat <project>", "read a project summary"],
        ["open <project>", "open the full case study"],
        ["whoami", "who I am"],
        ["contact", "how to reach me"],
        ["library", "the books behind this site"],
        ["clear", "clear the screen"],
      ],
      tip: "Tab autocompletes · ↑ ↓ browse your history",
      opening: "Opening",
      notFound: "command not found:",
      tryHelp: ["Try ", "help", "."],
      noProject: "no such project:",
      tryLs: ["Type ", "ls", " to see them."],
      usage: "usage:",
      exit: "There is no exit. Only the next project.",
      sudoDenied: "Nice try. Only one command runs as root here: ",
      sudo: "[sudo] password for recruiter:",
      granted: "Access granted. Here is how to reach me:",
      cv: "Download my CV (PDF)",
      library: {
        title: "~/library · favourite books",
        books: [
          { title: "Neuromancer", by: "William Gibson, 1984", note: "Where this site's look comes from.", command: "jack in" },
          { title: "The Robot series", by: "Isaac Asimov, 1950–1985", note: "Where my three laws come from.", command: "asimov" },
        ],
      },
      jack: { opening: "Jacking in", connected: "Connected. In this matrix, the data is clubs, volunteers and spreadsheets.", next: ["Type ", "ls", " to see what I built in here."] },
    },
    open: "Explore the case study",
    lab: {
      identity: "Ono-Sendai",
      chapter: "Personal AI workspace · M2 thesis",
      offer: ["Built for a thesis", "Adaptable to any team"],
      verb: ["Make it", "think."],
      text: "My thesis asks what generative AI can do for a team with little time and money. So I built my own answer: one desktop app for my whole master's year. I write the thesis there with APA citations to the exact page, search my library by meaning, record and transcribe lectures, and revise. A local research engine feeds it new sources every day.",
      proof: "4",
      proofLabel: "spaces · thesis, library, lectures, ask",
      cost: "≈ €0",
      costLabel: "transcription & search run on my Mac",
      open: "Explore the app",
    },
    more: {
      strategy: { chapter: "Esports business · case study", proof: "23p", proofLabel: "strategy dossier" },
      build: { chapter: "Websites built with AI", proof: "1 live", proofLabel: "+ 1 in development" },
      imagery: { chapter: "Photography", proof: "50", proofLabel: "frames · 3 sectors" },
    },
    archive: {
      strategy: "Understanding the business behind esports.",
      build: "Websites for real organisations, built with AI.",
      imagery: "Capturing the people and moments behind the event.",
    } as Partial<Record<ContractSlug, string>>,
    titles: {} as Partial<Record<ContractSlug, string>>,
    stories: PROJECT_STORIES as Record<StorySlug, ProjectStory>,
  },


  approach: {
    tools: ["Tools, when they help", "Notion · Obsidian · Canva", "Claude Code · Codex · Ollama · local LLMs"],
    laws: {
      title: "The three laws of my tools",
      items: [
        "A tool may not harm the team or, through inaction, allow it to lose time.",
        "A tool must obey the volunteers who use it, except where that would conflict with the First Law.",
        "A tool must outlive my internship, as long as that does not conflict with the First or Second Law.",
      ],
      credit: "After Isaac Asimov, I, Robot (1950)",
    },
  },



  footer: {
    line: ["Jules Moreau / From the field to the tools.", "Built with curiosity, field experience and AI-assisted tools."],
    label: "Footer",
    projects: "Projects",
    top: "Back to top ↑",
    marquee: ["PLAY", "UNDERSTAND", "BUILD"],
  },

  intro: {
    title: "Jules Moreau — Enter the matrix",
    description: "A short coded introduction before the portfolio. You can skip it.",
    topline: "Secure line / Lille, FR",
    wake: ["The sky above Lille was the colour of a dead channel.", "Follow the white rabbit."],
    role: "Digital transformation & AI / Sport",
    phases: { wake: "Incoming signal", rain: "Decoding profile", choose: "Awaiting your choice", exit: "Access granted" },
    skip: "Skip intro",
    choose: {
      label: "Choose your access",
      dossier: { title: "The full dossier", meta: "Narrated · sound on · desktop" },
      enter: "Enter the portfolio",
    },
  },

}

export type Copy = typeof en

const fr: Copy = {
  sections: {
    hero: "Accueil",
    contracts: "Projets",
  },

  nav: {
    skip: "Aller au contenu",
    home: "Accueil",
    tagline: "// Transformation digitale & IA",
    sections: "Sections",
    sectionIndex: "Index des sections",
    storyNav: "Navigation",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    switchTo: { label: "English version", short: "EN", lang: "en" },
  },

  hero: {
    kicker: "Le regard du joueur",
    portfolio: "Jules Moreau / Portfolio 2026",
    availability: "Disponible pour un stage",
    window: "FÉV. — JUIN 2027",
    role: "Transformation digitale & IA",
    title: ["Outiller", "le sport."],
    specialty: "IA, automatisation et process pour les structures sportives.",
    intro: "La communication de club, les partenariats et l’événementiel m’ont montré où les petites structures sportives perdent du temps. Aujourd’hui, je construis les outils IA et les automatisations qui leur en font gagner, et j’aide les équipes à s’en servir. En M2 International Sport Administration à Lille, mémoire sur l’IA générative dans les associations sportives.",
    explore: "Voir mes projets",
    talk: "Discutons",
    stamp: ["DU TERRAIN", "AUX OUTILS."],
    edge: "AVEC L’ÉQUIPE / DANS LES OUTILS",
  },

  work: {
    chapter: "02 / Projets choisis",
    chapterRight: "Quatre projets / IA, outils & terrain",
    title: ["Trouver le frein.", "Bâtir l’outil."],
    introLabel: "De vraies équipes. De vrais outils.",
    intro: "Un espace de travail IA construit pour mon mémoire, nourri par un moteur de recherche qui tourne 24h/24. Un système sponsors pensé pour qu’un club le fasse vivre sans moi. Puis le tournoi et la saison où j’ai appris comment fonctionnent vraiment les structures sportives.",
    languageNote: "Les études de cas détaillées sont en anglais.",
    status: { "ono-sendai": "Utilisé chaque jour", daring: "Conçu pour durer", "field-ops": "Sur le terrain", signal: "Parti de zéro" },
    terminal: {
      title: "jules@portfolio: ~/projects — zsh",
      region: "Terminal interactif : tapez une commande pour explorer les projets",
      inputLabel: "Tapez une commande, par exemple : open daring",
      monitor: "Moniteur",
      suggestions: "Essayez",
      fetch: { role: "rôle", field: "terrain", fieldValue: "Structures sportives", status: "statut", base: "basé à", tools: "outils" },
      featured: "featured/",
      archive: "archive/",
      projects: "projets",
      hint: ["Tapez ", "open <projet>", " ou cliquez sur une ligne · ", "help", " liste toutes les commandes."],
      helpTitle: "Commandes",
      help: [
        ["ls [-a]", "lister les projets, -a ajoute les archives"],
        ["cat <projet>", "lire le résumé d’un projet"],
        ["open <projet>", "ouvrir l’étude de cas complète"],
        ["whoami", "qui je suis"],
        ["contact", "me contacter"],
        ["library", "les livres derrière ce site"],
        ["clear", "effacer l’écran"],
      ],
      tip: "Tab complète automatiquement · ↑ ↓ parcourent l’historique",
      opening: "Ouverture de",
      notFound: "commande introuvable :",
      tryHelp: ["Essayez ", "help", "."],
      noProject: "projet introuvable :",
      tryLs: ["Tapez ", "ls", " pour les voir."],
      usage: "usage :",
      exit: "Pas de sortie. Seulement le prochain projet.",
      sudoDenied: "Bien essayé. Une seule commande tourne en root ici : ",
      sudo: "[sudo] mot de passe pour recruteur :",
      granted: "Accès autorisé. Voici comment me joindre :",
      cv: "Télécharger mon CV (PDF)",
      library: {
        title: "~/library · livres favoris",
        books: [
          { title: "Neuromancien", by: "William Gibson, 1984", note: "D’où vient l’esthétique de ce site.", command: "jack in" },
          { title: "Le cycle des Robots", by: "Isaac Asimov, 1950–1985", note: "D’où viennent mes trois lois.", command: "asimov" },
        ],
      },
      jack: { opening: "Connexion à la matrice", connected: "Connecté. Dans cette matrice, les données sont des clubs, des bénévoles et des tableurs.", next: ["Tapez ", "ls", " pour voir ce que j’y ai construit."] },
    },
    open: "Voir l’étude de cas",
    lab: {
      identity: "Ono-Sendai",
      chapter: "Espace de travail IA · mémoire M2",
      offer: ["Conçu pour un mémoire", "Adaptable à toute équipe"],
      verb: ["Faire", "réfléchir."],
      text: "Mon mémoire étudie ce que l’IA générative peut apporter à une équipe qui manque de temps et d’argent. Alors j’ai construit ma propre réponse : une app de bureau pour toute mon année de master. J’y rédige le mémoire avec des citations APA à la page près, je cherche dans ma bibliothèque par le sens, j’enregistre et transcris les cours, et je révise. Un moteur de recherche local l’alimente en sources chaque jour.",
      proof: "4",
      proofLabel: "espaces · mémoire, bibliothèque, cours, questions",
      cost: "≈ 0 €",
      costLabel: "transcription et recherche sur mon Mac",
      open: "Explorer l’app",
    },
    more: {
      strategy: { chapter: "Business de l’esport · étude de cas", proof: "23 p", proofLabel: "dossier stratégique" },
      build: { chapter: "Sites web construits avec l’IA", proof: "1 en ligne", proofLabel: "+ 1 en développement" },
      imagery: { chapter: "Photographie", proof: "50", proofLabel: "photos · 3 secteurs" },
    },
    archive: {
      strategy: "Comprendre le business derrière l’esport.",
      build: "Des sites pour de vraies organisations, construits avec l’IA.",
      imagery: "Capter les personnes et les moments derrière l’événement.",
    },
    titles: {
      "field-ops": "Tournoi ASI",
      strategy: "Stratégie BLAST",
      build: "Sites clients",
      imagery: "Photographie",
    },
    stories: {
      "field-ops": {
        verb: "Faire tourner.", chapter: "Opérations événementielles",
        text: "Communication et opérations terrain pour un tournoi universitaire de plus de 500 personnes : un briefing bilingue pour chaque participant, et une nouvelle salle trouvée en 45 minutes quand le plan a changé.",
        takeaway: "Un événement fonctionne quand les personnes, l’information et le timing fonctionnent ensemble.",
        proof: "500+", proofLabel: "personnes · un tournoi",
      },
      signal: {
        verb: "Faire rayonner.", chapter: "Digital & activation sponsors",
        text: "La présence digitale d’un club construite de zéro, sans calendrier ni charte au départ : trois formats récurrents, un jeu de pronostics sponsorisé chaque semaine et un premier concept d’appli.",
        takeaway: "L’expérience commence avant le jour de match et continue après le coup de sifflet final.",
        proof: "1M+", proofLabel: "vues · une saison",
      },
      daring: {
        verb: "Faire durer.", chapter: "Outils & passation",
        text: "Un système sponsors conçu pour survivre à mon stage : charte graphique, site partenaires bilingue, modèles Canva et un espace Notion pour que les bénévoles continuent de produire seuls, exporté en Markdown pour n’importe quel assistant IA.",
        takeaway: "Un projet doit laisser à l’équipe suivante une base sur laquelle construire.",
        proof: "11", proofLabel: "modèles de posts prêts à l’emploi",
      },
    },
  },


  approach: {
    tools: ["Des outils, quand ils servent", "Notion · Obsidian · Canva", "Claude Code · Codex · Ollama · LLM locaux"],
    laws: {
      title: "Les trois lois de mes outils",
      items: [
        "Un outil ne doit pas nuire à l’équipe ni, en restant inactif, lui faire perdre du temps.",
        "Un outil doit obéir aux bénévoles qui l’utilisent, sauf si cela contredit la Première Loi.",
        "Un outil doit survivre à mon stage, tant que cela ne contredit ni la Première ni la Deuxième Loi.",
      ],
      credit: "D’après Isaac Asimov, Les Robots (1950)",
    },
  },



  footer: {
    line: ["Jules Moreau / Du terrain aux outils.", "Conçu avec curiosité, expérience terrain et outils assistés par l’IA."],
    label: "Pied de page",
    projects: "Projets",
    top: "Haut de page ↑",
    marquee: ["JOUER", "COMPRENDRE", "CONSTRUIRE"],
  },

  intro: {
    title: "Jules Moreau — Entrez dans la matrice",
    description: "Une courte introduction codée avant le portfolio. Vous pouvez la passer.",
    topline: "Ligne sécurisée / Lille, FR",
    wake: ["Le ciel de Lille avait la couleur d’un écran sans signal.", "Suivez le lapin blanc."],
    role: "Transformation digitale & IA / Sport",
    phases: { wake: "Signal entrant", rain: "Décodage du profil", choose: "En attente de votre choix", exit: "Accès autorisé" },
    skip: "Passer l’intro",
    choose: {
      label: "Choisissez votre accès",
      dossier: { title: "Le dossier complet", meta: "Narré en anglais · son activé · ordinateur" },
      enter: "Entrer dans le portfolio",
    },
  },

}

export const COPY: Record<Locale, Copy> = { en, fr }
