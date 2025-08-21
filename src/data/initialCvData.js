// Données CV principales (version Data actuelle)
export const INITIAL_CV_DATA = {
  nom: 'Yohann YENDI',
  titre: 'Alternant Data | Python · SQL · Power BI | Scoring & analyses actionnables',
  contact: {
    telephone: '06 45 86 35 33',
    email: 'yendiyohann@gmail.com',
    adresse: 'Paris (75000)',
    linkedin: 'https://www.linkedin.com/in/yohannkp',
    portfolio: 'https://www.datascienceportfol.io/yendiyohann',
    github: 'https://github.com/Yohannkp'
  },
  langues: [
    { nom: 'Français', niveau: 'Natif' },
    { nom: 'Anglais', niveau: 'Intermédiaire' }
  ],
  reseaux: [],
  competences: {
    outils: [
      'Python (Pandas, Matplotlib, Scikit-learn)',
      'SQL (PostgreSQL, MySQL)',
      'Power BI',
      'Power Query / Excel avancé',
      'Git'
    ],
    baseDonnees: ['Modélisation relationnelle', 'Jointures complexes', 'Optimisation requêtes', 'Indexation'],
    ia: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
    dataEngineering: ['Pipelines SQL', 'Nettoyage de données', 'Automatisation scripts', 'Indexation'],
    ml: ['Classification', 'Régression', 'Random Forest', 'XGBoost', 'Feature engineering'],
    analyse: ['EDA', 'KPIs & métriques business', 'A/B Testing', 'Scoring', 'Modélisation prédictive', 'Segmentation clients', 'Analyse rétention'],
    visualisation: ['Dashboards Power BI', 'Data storytelling', 'Pyramid Principle', 'Automatisation de rapports'],
    business: ['Recueil des besoins', 'Gestion parties prenantes', 'Amélioration de processus', 'Priorisation orientée ROI', 'Analyse fonctionnelle'],
    soft: ['Sens business & analyse', 'Communication claire', 'Vulgarisation technique', 'Proactivité & autonomie', 'Travail en équipe']
  },
  certifications: [
    'Google Advanced Data Analytics',
    'IBM Data Analyst'
  ],
  profil: "Data Analyst orienté business (fidélisation, scoring client, aide à la décision). Transforme besoins métier en indicateurs actionnables (Python, SQL, Power BI) avec forte adaptabilité, rigueur organisationnelle et focus relation utilisateurs; recherche alternance à impact mesurable.",
  description: '',
  experiences: [
    {
      poste: 'Data Analyst – Analyse comportementale retail',
      entreprise: 'Quantum – Simulation pro Paris',
      dates: '2025',
      details: [
        'Analysé 300 000+ transactions (layouts magasin) → suivi panier moyen & taux conv. par zone',
        'Automatisé attribution magasins témoins + T-tests (cycle analyse -40 % vs manuel)',
        'Priorisé 4 segments (62 % du potentiel ROI) → projection +5–7 % conversion zones test',
        'Coordination 10+ interlocuteurs (magasin, marketing) pour aligner insights & plan d’actions clients'
      ]
    },
    {
      poste: 'Stage Développeur Fullstack',
      entreprise: 'TRUSTLINE Lyon',
      dates: 'Janvier 2024 à mars 2024',
      details: [
        'Développé app mobile Flutter (auth, QR code, notifications, cartes) + API REST',
        'Optimisé requêtes & UI (chargement écran principal ≈ -30 %)',
        'Structuré schémas JSON en modèles réutilisables',
        'Ateliers utilisateurs + partage métriques → priorisation backlog (tickets mineurs -20 %)'
      ]
    }
  ],
  projets: [
    {
      titre: 'Data Scientist – Modélisation du risque client',
      entreprise: 'Kaggle Paris',
      dates: '2025',
      details: [
        'Random Forest défaut paiement (AUC 0.88) pour prioriser revues risques',
        'Faux positifs -18 % à rappel constant (allègement revue manuelle)',
        'App Streamlit + API + dashboard Power BI (120+ vues/mois) → adoption finance'
      ]
    },
    {
      titre: 'Data Scientist – Analyse RH prédictive',
      entreprise: 'Salif Motors - Google - Certification Paris',
      dates: 'Octobre 2024 à mars 2025',
      details: [
        'Exploré données RH de 15 000 employés (analyse churn interne)',
        "Modèle prédiction départs (AUC 0.94) couvrant 150 K salariés (indicateur surcharge & suivi mensuel)",
        'Actions RH (promotions ciblées, coaching, outils) + dashboards (Power BI, Streamlit) pour décisions mensuelles'
      ]
    },
    {
      titre: 'Data Analyst – Optimisation des ventes et marges',
      entreprise: 'Kaggle Paris',
      dates: '2025',
      details: [
        'Analysé 500 000 lignes de vente (SQL) pour isoler produits à faible marge',
        'Recommandé ajustements prix & ciblage promo (+15 % marge nette) en priorisant 10 produits (65 % du CA)'
      ]
    }
  ],
  formations: [
    {
      diplome: 'Cycle ingénieur – ING3 - Data & IA',
      ecole: 'ECE Paris',
      dates: '2025 à 2027',
      details: [
        'Statistiques, probabilités, algèbre linéaire, Python, SQL, Power BI, Machine Learning, IA explicable, modélisation, déploiement'
      ]
    },
    {
      diplome: 'Développeur Fullstack et DevOps',
      ecole: 'IPSSI Paris',
      dates: '2023 à 2024',
      details: [
        'Conception applications web et mobiles (React, Flutter, Node.js, Symfony), intégration d’API REST, UX/UI, bases de données SQL/NoSQL'
      ]
    },
    {
      diplome: 'Licence Génie Logiciel',
      ecole: 'IPNET Togo',
      dates: '2020 à 2023',
      details: [
        "Conception et développement d’applications web et desktop, programmation (Java, Python, C++), bases de données (SQL), modélisation (UML/Merise), gestion de projet Agile"
      ]
    }
  ]
};
