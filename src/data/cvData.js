// Base Data CV (Data oriented)
export const CV_DATA = {
  nom: 'Yendi Yohann',
  titre: 'Data Analyst',
  profil: 'Profil data orienté...',
  description: '',
  contact: {
    telephone: '+33 6 00 00 00 00',
    email: 'email@example.com',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username',
    adresse: 'Ville, Pays',
    portfolio: 'https://portfolio.example.com'
  },
  langues: [
    { nom: 'Français', niveau: 'C2' },
    { nom: 'Anglais', niveau: 'C1' }
  ],
  competences: {
    outils: ['Python', 'SQL', 'Excel'],
    baseDonnees: ['PostgreSQL'],
    analyse: ['Pandas'],
    visualisation: ['Power BI'],
    ia: ['Scikit-learn'],
    soft: ['Communication']
  },
  certifications: ['Certification Data 1'],
  experiences: [
    {
      poste: 'Data Analyst',
      entreprise: 'Entreprise A',
      dates: '2023 - Présent',
      details: ['Analyse de données', 'Création de dashboards']
    }
  ],
  projets: [
    {
      titre: 'Projet Data',
      entreprise: 'Personnel',
      dates: '2024',
      details: ['Description du projet']
    }
  ],
  formations: [
    {
      diplome: 'Master Data',
      ecole: 'Université X',
      dates: '2021 - 2023',
      details: ['Spécialisation Data Science']
    }
  ]
};

// Dev oriented CV
export const CV_DEV = {
  nom: 'Yohann YENDI',
  titre: 'Développeur Fullstack – Web, Mobile & API sécurisées',
  profil: 'Développeur fullstack orienté projet (web, mobile, API sécurisées). Recherche alternance pour concevoir des solutions concrètes, maintenables et évolutives, avec sens UX, autonomie et rigueur.',
  description: '',
  contact: {
    telephone: '06 45 86 35 33',
    email: 'yendiyohann@gmail.com',
    linkedin: 'https://www.linkedin.com/in/yohannkp',
    github: 'https://github.com/Yohannkp',
    adresse: 'Paris (75000)',
    portfolio: 'https://yohannkp.github.io/portfolio/'
  },
  langues: [
    { nom: 'Français', niveau: 'Natif' },
    { nom: 'Anglais', niveau: 'Intermédiaire' }
  ],
  competences: {
    outils: [
      'React', 'Vue.js', 'Angular', 'JavaScript',
      'Node.js', 'Express', 'Django', 'Flask', 'Symfony', 'FastAPI',
      'Git', 'Docker', 'VS Code', 'CI/CD', 'Kubernetes'
    ],
    baseDonnees: ['MongoDB', 'PostgreSQL', 'MySQL', 'Neo4j', 'SQLite'],
    analyse: [
      'Conception APIs REST', 'Tests & qualité', 'Optimisation performance', 'UX & accessibilité'
    ],
    visualisation: [],
    ia: ['Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'Spark'],
    soft: [
      'Autonome', 'Rigoureux', 'Curieux', 'Bon sens UX', 'Esprit d’équipe',
      'Résolution de problèmes', 'Veille techno', 'Code maintenable'
    ]
  },
  certifications: [
    'Google Advanced Data Analytics',
    'IBM Data Analyst'
  ],
  experiences: [
    {
      poste: 'Stage Développeur Full Stack & mobile',
      entreprise: 'TRUSTLINE Lyon',
      dates: 'Jan 2024 – Avr 2024',
      details: [
        'App mobile Flutter (auth, géolocalisation, QR code, notifications push)',
        'Intégration API REST + interfaces UI/UX responsives',
        'Participation sprints Agile (Git, debug, tests, documentation)',
        'Livraison fonctionnalités clés (login sécurisé, carte interactive, lecteur code)',
        "Contribution déploiement & amélioration continue"
      ]
    }
  ],
  projets: [
    {
      titre: 'Application Movies Database (Full Stack)',
      entreprise: 'Indépendant Paris',
      dates: '2025',
      details: [
        'Application React + FastAPI + Neo4j (exploration base films)',
        'Recherche floue & recommandations + monitoring API'
      ]
    },
    {
      titre: 'Déploiement Microservices – Docker & Kubernetes',
      entreprise: 'IPSSI Paris',
      dates: '2025',
      details: [
        'Architecture conteneurisée multi-services',
        'Orchestration Kubernetes & CI/CD automatisé'
      ]
    },
    {
      titre: 'API REST sécurisée – Projet CloudUs (Symfony)',
      entreprise: 'Indépendant Paris',
      dates: '2025',
      details: [
        'Conception API (utilisateurs, uploads, permissions)',
        'Sécurité JWT + MySQL'
      ]
    },
    {
      titre: 'Marketplace MERN – type LeBonCoin',
      entreprise: 'Indépendant Paris',
      dates: '2025',
      details: [
        'Plateforme MERN (auth JWT, géolocalisation, UI responsive)',
        'CRUD complet & publication sécurisée'
      ]
    }
  ],
  formations: [
    {
      diplome: 'Cycle ingénieur – ING3 - Data & IA',
      ecole: 'ECE Paris',
      dates: 'Depuis 2025',
      details: [
        'Data, IA, architectures logicielles, statistiques'
      ]
    },
    {
      diplome: 'Bachelor Développeur Fullstack et DevOps',
      ecole: 'IPSSI Paris',
      dates: '2023 – 2024',
      details: [
        'Apps web & mobiles (React, Flutter, Node.js, Symfony), APIs, UX/UI, bases SQL/NoSQL'
      ]
    },
    {
      diplome: 'Licence Génie Logiciel',
      ecole: 'IPNET Togo',
      dates: '2020 – 2023',
      details: [
        'Conception & développement (Java, Python, C++), bases SQL, UML/Merise, Agile'
      ]
    }
  ]
};
