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
      titre: 'Supermarket Sales Analysis – SQL-Driven Business Insights',
      entreprise: '',
      dates: '',
      details: [
        'SQL Exploration de données',
        'Analyse métier',
        'Analyse temporelle',
        'Insights stratégiques',
        'Modèle relationnel solide',
        'Projet 100% SQL basé sur des données réelles de ventes en supermarché. Extraction, modélisation, et analyses avancées des performances commerciales, marges, pertes et comportements d’achat.'
      ]
    },
    {
      titre: 'Prédiction du départ des Employés avec le Machine Learning',
      entreprise: '',
      dates: '',
      details: [
        'pandas', 'scikit-learn', 'matplotlib', 'Streamlit', 'Random Forest', 'analyse exploratoire', 'évaluation AUC', 'dashboard interactif', 'recommandations business', 'Excel',
        "L'objectif est d'aider les entreprises à mieux comprendre les raisons du départ et à améliorer la rétention des employés grâce à une analyse de données et des modèles prédictifs."
      ]
    },
    {
      titre: 'Finance Analytics - Credit Scoring',
      entreprise: '',
      dates: '',
      details: [
        'Power BI', 'Python', 'Scikit-learn', 'XGBoost', 'SHAP', 'SMOTE', 'Data Visualization', 'Model Evaluation', 'Feature Engineering', 'Credit Risk Modeling', 'Fraud Detection',
        "Développement d'un modèle de scoring de crédit pour identifier les clients à risque de défaut de paiement grave. Utilisation de techniques avancées de machine learning et gestion des déséquilibres de classes."
      ]
    },
    {
      titre: 'Optimisation des ventes de chips via l\'analyse comportementale client et A/B testing',
      entreprise: '',
      dates: '',
      details: [
        'Python (Pandas Matplotlib)', 'PowerPoint', 'Visualisation de données', 'Méthodes statistiques', 'corrélation magnitude distance', 'A/B testing', 'Analyse client', 'Insight commercial', 'Rapport stratégique',
        "Analyse complète des données transactionnelles pour un Category Manager en retail, identification des segments clients clés, évaluation de l’impact d’un nouveau layout en magasin à l’aide de tests statistiques."
      ]
    },
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
    },
    {
      titre: 'Data Analyst – Analyse comportementale retail',
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
      titre: 'Stage Développeur Fullstack',
      entreprise: 'TRUSTLINE Lyon',
      dates: 'Janvier 2024 à mars 2024',
      details: [
        'Développé app mobile Flutter (auth, QR code, notifications, cartes) + API REST',
        'Optimisé requêtes & UI (chargement écran principal ≈ -30 %)',
        'Structuré schémas JSON en modèles réutilisables',
        'Ateliers utilisateurs + partage métriques → priorisation backlog (tickets mineurs -20 %)'
      ]
    },
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
  ,
    // --- Projets ajoutés depuis le portfolio ---
    {
      titre: 'Tableau de Bord des Statistiques Automobiles',
      entreprise: '',
      dates: '',
      details: [
        'Python, Pandas, Plotly, Dash, Matplotlib, Seaborn, Folium',
        'Visualisation de données, analyse exploratoire, cartographie, dashboarding',
        'Création d’un tableau de bord interactif pour explorer les tendances des ventes automobiles.'
      ]
    },
    {
      titre: 'Analyse Exploratoire et Segmentation des Clients',
      entreprise: '',
      dates: '',
      details: [
        'Python, pandas, scikit-learn, Streamlit, clustering (K-Means, DBSCAN), PCA',
        'Analyse marketing, segmentation client, visualisation, recommandations business',
        'Identification des segments clients rentables à partir d’un dataset marketing.'
      ]
    },
    {
      titre: 'Apprentissage par renforcement Snake Game (Deep Learning, PyTorch)',
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, Python 3.8+, PyTorch, Pygame, NumPy, Matplotlib, Gymnasium, CUDA',
        'Implémentation d’un agent d’apprentissage par renforcement (Deep Q-Network, DQN) pour apprendre à jouer à Snake de façon autonome.',
        'Utilisation de réseaux de neurones profonds, accélération GPU, exploration/exploitation, replay buffer.'
      ]
    },
    {
      titre: "Projet d'Analyse de Clustering",
      entreprise: '',
      dates: '',
      details: [
        'Python, Machine Learning, K-Means, Clustering Hiérarchique',
        'Analyse de groupes naturels dans les données, comparaison de méthodes',
        'Clustering non supervisé sur différents jeux de données.'
      ]
    },
    {
      titre: 'Détection de fraudes bancaires',
      entreprise: '',
      dates: '',
      details: [
        'Python, pandas, seaborn, matplotlib, Streamlit',
        'Détection de valeurs aberrantes, analyse de transactions, AED',
        'Application Streamlit interactive pour visualiser les tendances et détecter la fraude.'
      ]
    },
    {
      titre: 'Analyse du churn client',
      entreprise: '',
      dates: '',
      details: [
        'Python, Machine Learning, Data Science, Data viz',
        'Analyse des facteurs de départ client, recommandations pour réduire le churn',
        'Étude sur données transactionnelles et comportementales.'
      ]
    },
    {
      titre: 'Projet de Régression Linéaire - Prédiction des Prix de l\'Immobilier',
      entreprise: '',
      dates: '',
      details: [
        'Machine Learning, Python',
        'Modèles de régression pour prédire les prix immobiliers',
        'Utilisation de caractéristiques comme l’âge, la localisation, la proximité des transports.'
      ]
    },
    {
      titre: 'Projet de Classification de Vins',
      entreprise: '',
      dates: '',
      details: [
        'Classification, Python, ML',
        'Modèle de classification pour identifier la variété de vin',
        'Pipeline complet : exploration, préparation, entraînement, évaluation.'
      ]
    },
    {
      titre: "Application de Prédiction de Productivité d'une équipe",
      entreprise: '',
      dates: '',
      details: [
        'Flutter, Machine Learning, FastAPI, Python',
        'Application mobile/web pour le suivi et la prédiction de la productivité',
        'Workspace ML avancé, multi-plateforme.'
      ]
    },
    {
      titre: "Projet d'Analyse d'Émotions en Temps Réel avec PyTorch (Deep Learning, CNN)",
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, Computer Vision, Python, PyTorch, OpenCV',
        'Reconnaissance d’émotions en temps réel via webcam avec réseaux de neurones convolutifs (CNN).',
        'Entraînement et optimisation de modèles CNN pour la classification d’images et la détection d’émotions.'
      ]
    },
    {
      titre: 'Réseaux de Neurones Convolutifs avec PyTorch (CNN, Deep Learning)',
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, PyTorch, CNN, Machine Learning',
        'Développement et entraînement de réseaux de neurones convolutifs (CNN) pour la classification d’images.',
        'Projet de computer vision : distinction automatique entre cercles, carrés et triangles à partir d’images.'
      ]
    },
    {
      titre: 'Classification des Manchots avec PyTorch (Deep Learning)',
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, PyTorch, Machine Learning, réseaux de neurones profonds (DNN)',
        'Classification d’espèces de manchots à partir de mesures physiques avec un réseau de neurones profond.',
        'Prétraitement, entraînement, évaluation et interprétation des résultats.'
      ]
    },
    {
      titre: 'Transfer Learning avec PyTorch (Deep Learning, Computer Vision)',
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, PyTorch, Transfer Learning, Computer Vision',
        'Classification d’images géométriques par transfert de modèle (fine-tuning d’un modèle pré-entraîné).',
        'Réutilisation de réseaux de neurones pré-entraînés pour accélérer l’apprentissage sur un nouveau dataset.'
      ]
    },
    {
      titre: 'Tableau de bord des ventes – Analyse E-commerce multicanal',
      entreprise: '',
      dates: '',
      details: [
        'Power BI, Data analytics',
        'Tableau de bord interactif pour ventes e-commerce',
        'Suivi des performances, détection des produits et canaux rentables.'
      ]
    },
    {
      titre: 'Landing Page A/B Test',
      entreprise: '',
      dates: '',
      details: [
        'Pandas, matplotlib, seaborn, Streamlit',
        'Comparaison de deux versions de landing page',
        'Analyse des taux de conversion et visualisation des résultats.'
      ]
    },
    {
      titre: 'Fake News Detection with Machine Learning (Deep Learning, LSTM, NLP)',
      entreprise: '',
      dates: '',
      details: [
        'Deep Learning, LSTM, NLP, Python, Keras/TensorFlow',
        'Classification automatique d’articles d’actualité avec réseaux de neurones récurrents (LSTM bidirectionnel).',
        'Détection de fausses nouvelles, prétraitement de texte, embedding, évaluation des performances.'
      ]
    },
    {
      titre: 'Détection Cancer du seins',
      entreprise: '',
      dates: '',
      details: [
        'Python, Scikit-learn, Kaggle',
        'Régression logistique pour classer les cas de cancer',
        'Classification binaire (malin/bénin) sur le dataset Breast Cancer Wisconsin.'
      ]
    },
    {
      titre: 'Analyse et Modélisation des Données Automobiles',
      entreprise: '',
      dates: '',
      details: [
        'Python, nettoyage, visualisation, statistiques, corrélation, pipeline',
        'Régression linéaire simple, multiple, polynomiale',
        'Analyse des relations entre caractéristiques et prix des voitures.'
      ]
    },
    {
      titre: 'Création de graphiques de base avec Excel',
      entreprise: '',
      dates: '',
      details: [
        'Excel, visualisation de données, reporting',
        'Création de graphiques (colonnes, aires, barres, lignes)',
        'Projet pratique dans le cadre du IBM Data Analyst Professional Certificate.'
      ]
    },
    {
      titre: 'Analyse des Prix des Ordinateurs Portables',
      entreprise: '',
      dates: '',
      details: [
        'Python (pandas, numpy), matplotlib, seaborn, scipy',
        'Analyse exploratoire, transformation, corrélation, encoding',
        'Étude des facteurs influençant les prix des ordinateurs portables.'
      ]
    },
    {
      titre: 'Analyse et de Modélisation des Prix des Maisons',
      entreprise: '',
      dates: '',
      details: [
        'Python, Pandas, Matplotlib, Seaborn, Scikit-learn',
        'Régression linéaire, validation croisée, grid search',
        'Prédiction des prix des maisons à partir de multiples variables.'
      ]
    },
    {
      titre: 'Analyse de données médicales',
      entreprise: '',
      dates: '',
      details: [
        'Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn',
        'Analyse exploratoire, nettoyage, modélisation, prédiction',
        'Estimation des frais médicaux selon les caractéristiques des patients.'
      ]
    },
    {
      titre: 'Hands-on Lab – Visualisations avec IBM Cognos Analytics',
      entreprise: '',
      dates: '',
      details: [
        'IBM Cognos Analytics, dashboards interactifs',
        'Création de tableaux de bord pour analyse de ventes automobiles',
        'Projet réalisé dans le cadre du IBM Data Analyst Professional Certificate.'
      ]
    },
    {
      titre: 'Recommandation de films',
      entreprise: '',
      dates: '',
      details: [
        'Machine learning, Python',
        'Modèle de recommandation de films personnalisée',
        'Prise en compte des préférences utilisateurs.'
      ]
    },
    {
      titre: 'Montgomery Fleet Inventory Analysis part1',
      entreprise: '',
      dates: '',
      details: [
        'Excel, nettoyage, reporting',
        'Analyse d’inventaire de flotte pour le comté de Montgomery',
        'Projet final évalué par les pairs.'
      ]
    },
    {
      titre: 'Montgomery Fleet Inventory Analysis part2',
      entreprise: '',
      dates: '',
      details: [
        'Excel, nettoyage, reporting',
        'Suite de l’analyse d’inventaire de flotte',
        'Projet final évalué par les pairs.'
      ]
    },
    {
      titre: 'Peer-Graded Assignment',
      entreprise: '',
      dates: '',
      details: [
        'Excel, visualisation, dashboards',
        'Création de visualisations à partir de données réelles du secteur automobile',
        'Projet de synthèse du IBM Data Analyst Professional Certificate.'
      ]
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
