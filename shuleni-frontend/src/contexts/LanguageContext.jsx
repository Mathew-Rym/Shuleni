import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navigation & General
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    close: 'Close',
    submit: 'Submit',
    
    // Dashboard titles
    adminDashboard: 'Admin Dashboard',
    teacherDashboard: 'Teacher Dashboard',
    studentDashboard: 'Student Dashboard',
    
    // Common labels
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    description: 'Description',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    actions: 'Actions',
    total: 'Total',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    
    // User roles
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
    
    // School management
    school: 'School',
    schools: 'Schools',
    schoolName: 'School Name',
    createSchool: 'Create School',
    joinSchool: 'Join School',
    manageSchool: 'Manage School',
    
    // User management
    users: 'Users',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    firstName: 'First Name',
    lastName: 'Last Name',
    fullName: 'Full Name',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    role: 'Role',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    nationality: 'Nationality',
    emergencyContact: 'Emergency Contact',
    
    // Profile
    profilePhoto: 'Profile Photo',
    changePhoto: 'Change Photo',
    
    // Settings
    accountSettings: 'Account Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    privacy: 'Privacy',
    
    // Welcome messages
    welcomeMessage: 'Welcome to Shuleni',
    
    // Landing page
    landingHeroTitle: 'Welcome to Shuleni',
    landingHeroSubtitle: 'Create, manage and grow your school community easily with our platform.',
    learnMore: 'Learn More',
    watchDemo: 'Watch Demo',
    createYourSchool: 'Create Your School',
    whyChooseUs: 'Why Choose Us?',
    whyChooseUsSubtitle: 'Learn about the key features that make our platform stand out.',
    getStarted: 'Get Started',
    userFriendly: 'User-Friendly',
    userFriendlyDesc: 'Our interface is simple and intuitive for all users.',
    comprehensiveTools: 'Comprehensive Tools',
    comprehensiveToolsDesc: 'All necessary tools for managing schools in one place.',
    support247: '24/7 Support',
    support247Desc: 'We provide around-the-clock support to ensure your success.',
    readyToStart: 'Ready to Get Started?',
    readyToStartDesc: 'Join thousands of schools already using Shuleni to manage their educational communities.',
    startSchoolToday: 'Start Your School Today',
    
    // Demo modal
    demoModalTitle: 'Shuleni App Demo',
    demoModalDescription: 'Experience the power of Shuleni school management platform',
    getStartedNow: 'Get Started Now',
    
    // Dashboard common
    myClasses: 'My Classes',
    viewStudents: 'View Students',
    takeAttendance: 'Take Attendance',
    createAssignment: 'Create Assignment',
    makeAnnouncement: 'Make Announcement',
    gradeAssignments: 'Grade Assignments',
    recentAnnouncements: 'Recent Announcements',
    myAssignments: 'My Assignments',
    
    // Quick navigation
    quickLinks: 'Quick Links',
    support: 'Support',
    helpCenter: 'Help Center',
    faq: 'FAQ',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    contactSupport: 'Contact Support',
    platformDescription: 'A comprehensive school management platform designed to connect teachers, students, and administrators.'
  },
  
  sw: {
    // Navigation & General
    dashboard: 'Dashibodi',
    profile: 'Wasifu',
    settings: 'Mipangilio',
    logout: 'Ondoka',
    login: 'Ingia',
    home: 'Nyumbani',
    about: 'Kuhusu',
    contact: 'Wasiliana',
    back: 'Rudi',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    delete: 'Futa',
    edit: 'Hariri',
    loading: 'Inapakia...',
    close: 'Funga',
    submit: 'Wasilisha',
    
    // Dashboard titles
    adminDashboard: 'Dashibodi ya Msimamizi',
    teacherDashboard: 'Dashibodi ya Mwalimu',
    studentDashboard: 'Dashibodi ya Mwanafunzi',
    
    // Common labels
    name: 'Jina',
    email: 'Barua Pepe',
    phone: 'Simu',
    address: 'Anwani',
    description: 'Maelezo',
    date: 'Tarehe',
    time: 'Muda',
    status: 'Hali',
    actions: 'Vitendo',
    total: 'Jumla',
    active: 'Amilifu',
    inactive: 'Isiyo Amilifu',
    pending: 'Inasubiri',
    approved: 'Imeidhinishwa',
    rejected: 'Imekataliwa',
    
    // User roles
    admin: 'Msimamizi',
    teacher: 'Mwalimu',
    student: 'Mwanafunzi',
    parent: 'Mzazi',
    
    // School management
    school: 'Shule',
    schools: 'Shule',
    schoolName: 'Jina la Shule',
    createSchool: 'Unda Shule',
    joinSchool: 'Jiunge na Shule',
    manageSchool: 'Simamia Shule',
    
    // User management
    users: 'Watumiaji',
    addUser: 'Ongeza Mtumiaji',
    editUser: 'Hariri Mtumiaji',
    deleteUser: 'Futa Mtumiaji',
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    fullName: 'Jina Kamili',
    username: 'Jina la Utumiaji',
    password: 'Nenosiri',
    confirmPassword: 'Thibitisha Nenosiri',
    role: 'Jukumu',
    dateOfBirth: 'Tarehe ya Kuzaliwa',
    gender: 'Jinsia',
    nationality: 'Utaifa',
    emergencyContact: 'Mawasiliano ya Dharura',
    
    // Profile
    profilePhoto: 'Picha ya Wasifu',
    changePhoto: 'Badilisha Picha',
    
    // Settings
    accountSettings: 'Mipangilio ya Akaunti',
    language: 'Lugha',
    theme: 'Mandhari',
    notifications: 'Arifa',
    privacy: 'Faragha',
    
    // Welcome messages
    welcomeMessage: 'Karibu Shuleni',
    
    // Landing page
    landingHeroTitle: 'Karibu Shuleni',
    landingHeroSubtitle: 'Unda, simamia na kukuza jamii ya shule yako kwa urahisi na jukwaa letu.',
    learnMore: 'Jifunze Zaidi',
    watchDemo: 'Tazama Onyesho',
    createYourSchool: 'Unda Shule Yako',
    whyChooseUs: 'Kwa Nini Utuchague?',
    whyChooseUsSubtitle: 'Jifunze kuhusu vipengele muhimu vinavyofanya jukwaa letu litofautike.',
    getStarted: 'Anza',
    userFriendly: 'Rahisi Kutumia',
    userFriendlyDesc: 'Kiolesura chetu ni rahisi na cha kielelezo kwa watumiaji wote.',
    comprehensiveTools: 'Zana Kamili',
    comprehensiveToolsDesc: 'Zana zote muhimu za kusimamia shule katika mahali pamoja.',
    support247: 'Msaada wa Saa 24/7',
    support247Desc: 'Tunatoa msaada wa saa kumi na nne za siku ili kuhakikisha mafanikio yako.',
    readyToStart: 'Uko Tayari Kuanza?',
    readyToStartDesc: 'Jiunge na maelfu ya shule zinazotumia Shuleni kusimamia jamii zao za kielimu.',
    startSchoolToday: 'Anza Shule Yako Leo',
    
    // Demo modal
    demoModalTitle: 'Onyesho la Programu ya Shuleni',
    demoModalDescription: 'Furahia nguvu za jukwaa la usimamizi wa shule la Shuleni',
    getStartedNow: 'Anza Sasa',
    
    // Dashboard common
    myClasses: 'Madarasa Yangu',
    viewStudents: 'Tazama Wanafunzi',
    takeAttendance: 'Chukua Mahudhurio',
    createAssignment: 'Unda Kazi',
    makeAnnouncement: 'Fanya Tangazo',
    gradeAssignments: 'Alama za Kazi',
    recentAnnouncements: 'Matangazo ya Hivi Karibuni',
    myAssignments: 'Kazi Zangu',
    
    // Quick navigation
    quickLinks: 'Viungo vya Haraka',
    support: 'Msaada',
    helpCenter: 'Kituo cha Msaada',
    faq: 'Maswali Yanayoulizwa Mara kwa Mara',
    contactUs: 'Wasiliana Nasi',
    privacyPolicy: 'Sera ya Faragha',
    termsOfUse: 'Masharti ya Matumizi',
    contactSupport: 'Wasiliana na Msaada',
    platformDescription: 'Jukwaa kamili la usimamizi wa shule lililobuniwa kuunganisha walimu, wanafunzi, na wasimamizi.'
  },
  
  fr: {
    // Navigation & General
    dashboard: 'Tableau de Bord',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    home: 'Accueil',
    about: 'À Propos',
    contact: 'Contact',
    back: 'Retour',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    loading: 'Chargement...',
    close: 'Fermer',
    submit: 'Soumettre',
    
    // Dashboard titles
    adminDashboard: 'Tableau de Bord Admin',
    teacherDashboard: 'Tableau de Bord Enseignant',
    studentDashboard: 'Tableau de Bord Étudiant',
    
    // Common labels
    name: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    address: 'Adresse',
    description: 'Description',
    date: 'Date',
    time: 'Heure',
    status: 'Statut',
    actions: 'Actions',
    total: 'Total',
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En Attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    
    // User roles
    admin: 'Administrateur',
    teacher: 'Enseignant',
    student: 'Étudiant',
    parent: 'Parent',
    
    // School management
    school: 'École',
    schools: 'Écoles',
    schoolName: 'Nom de l\'École',
    createSchool: 'Créer une École',
    joinSchool: 'Rejoindre une École',
    manageSchool: 'Gérer l\'École',
    
    // User management
    users: 'Utilisateurs',
    addUser: 'Ajouter Utilisateur',
    editUser: 'Modifier Utilisateur',
    deleteUser: 'Supprimer Utilisateur',
    firstName: 'Prénom',
    lastName: 'Nom de Famille',
    fullName: 'Nom Complet',
    username: 'Nom d\'Utilisateur',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    role: 'Rôle',
    dateOfBirth: 'Date de Naissance',
    gender: 'Genre',
    nationality: 'Nationalité',
    emergencyContact: 'Contact d\'Urgence',
    
    // Profile
    profilePhoto: 'Photo de Profil',
    changePhoto: 'Changer la Photo',
    
    // Settings
    accountSettings: 'Paramètres du Compte',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    privacy: 'Confidentialité',
    
    // Welcome messages
    welcomeMessage: 'Bienvenue à Shuleni',
    
    // Landing page
    landingHeroTitle: 'Bienvenue à Shuleni',
    landingHeroSubtitle: 'Créez, gérez et développez facilement votre communauté scolaire avec notre plateforme.',
    learnMore: 'En Savoir Plus',
    watchDemo: 'Regarder la Démo',
    createYourSchool: 'Créez Votre École',
    whyChooseUs: 'Pourquoi Nous Choisir?',
    whyChooseUsSubtitle: 'Découvrez les fonctionnalités clés qui distinguent notre plateforme.',
    getStarted: 'Commencer',
    userFriendly: 'Convivial',
    userFriendlyDesc: 'Notre interface est simple et intuitive pour tous les utilisateurs.',
    comprehensiveTools: 'Outils Complets',
    comprehensiveToolsDesc: 'Tous les outils nécessaires pour gérer les écoles en un seul endroit.',
    support247: 'Support 24/7',
    support247Desc: 'Nous fournissons un support 24h/24 pour assurer votre succès.',
    readyToStart: 'Prêt à Commencer?',
    readyToStartDesc: 'Rejoignez des milliers d\'écoles utilisant déjà Shuleni pour gérer leurs communautés éducatives.',
    startSchoolToday: 'Commencez Votre École Aujourd\'hui',
    
    // Demo modal
    demoModalTitle: 'Démo de l\'App Shuleni',
    demoModalDescription: 'Découvrez la puissance de la plateforme de gestion scolaire Shuleni',
    getStartedNow: 'Commencer Maintenant',
    
    // Dashboard common
    myClasses: 'Mes Classes',
    viewStudents: 'Voir les Étudiants',
    takeAttendance: 'Prendre les Présences',
    createAssignment: 'Créer un Devoir',
    makeAnnouncement: 'Faire une Annonce',
    gradeAssignments: 'Noter les Devoirs',
    recentAnnouncements: 'Annonces Récentes',
    myAssignments: 'Mes Devoirs',
    
    // Quick navigation
    quickLinks: 'Liens Rapides',
    support: 'Support',
    helpCenter: 'Centre d\'Aide',
    faq: 'Questions Fréquentes',
    contactUs: 'Contactez-Nous',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfUse: 'Conditions d\'Utilisation',
    contactSupport: 'Contacter le Support',
    platformDescription: 'Une plateforme complète de gestion scolaire conçue pour connecter les enseignants, les étudiants et les administrateurs.'
  }
};

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'en'
    return localStorage.getItem('shuleni_language') || 'en';
  });

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('shuleni_language', languageCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations: translations[currentLanguage],
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
