// frontend/src/context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — Navigate Inform Verify Reach Assist",
    subtitle: "Unified Citizen & Student Assistance Platform",
    tagline: "Navigate. Inform. Verify. Reach. Assist.",
    navAi: "🤖 AI Assistant",
    navStudent: "🎓 Student Hub",
    navCitizen: "🏛️ Citizen Services",
    navEmergency: "🚨 Emergency & Disaster",
    navTracker: "📊 Application Tracker",
    sosButton: "🚨 SOS Emergency 112 / 108",
    selectRole: "Select Your Portal View:",
    roleStudent: "Student Portal",
    roleCitizen: "Citizen Portal",
    roleEmergency: "Emergency & Disaster",
    searchPlaceholder: "Describe your problem in plain language (e.g. 'I am a student needing tuition fee help')...",
    askButton: "Ask NIVRA AI",
    disasterAlert: "ACTIVE DISASTER WARNING: Flooding / Extreme Weather alert active in low-lying sectors.",
    officialNotice: "Official Guidance: Eligibility advice is indicative. Final approval rests with respective government departments."
  },
  hi: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — नेविगेट सूचित सत्यापन पहुंच सहायता",
    subtitle: "एकीकृत नागरिक और छात्र सहायता मंच",
    tagline: "नेविगेट। सूचित। सत्यापित। पहुंच। सहायता।",
    navAi: "🤖 एआई सहायक",
    navStudent: "🎓 छात्र केंद्र",
    navCitizen: "🏛️ नागरिक सेवाएं",
    navEmergency: "🚨 आपातकाल और आपदा",
    navTracker: "📊 आवेदन ट्रैकर",
    sosButton: "🚨 आपातकालीन SOS 112 / 108",
    selectRole: "अपनी पोर्टल स्थिति चुनें:",
    roleStudent: "छात्र पोर्टल",
    roleCitizen: "नागरिक पोर्टल",
    roleEmergency: "आपातकाल और आपदा",
    searchPlaceholder: "अपनी समस्या सरल भाषा में लिखें (जैसे: 'मुझे कॉलेज फीस में मदद चाहिए')...",
    askButton: "NIVRA AI से पूछें",
    disasterAlert: "सक्रिय आपदा चेतावनी: तटीय/निचले इलाकों में बाढ़ और भारी बारिश का अलर्ट जारी।",
    officialNotice: "आधिकारिक सूचना: एआई मार्गदर्शन केवल जानकारी के लिए है। अंतिम निर्णय संबंधित विभाग का होगा।"
  },
  te: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — నావిగేట్ ఇన్ఫార్మ్ వెరిఫై రీచ్ అసిస్ట్",
    subtitle: "ఏకీకృత పౌర మరియు విద్యార్థి సహాయ వేదిక",
    tagline: "నావిగేట్. సమాచారం. ధృవీకరించు. చేరు. సహాయం.",
    navAi: "🤖 AI సహాయకుడు",
    navStudent: "🎓 విద్యార్థి కేంద్రం",
    navCitizen: "🏛️ పౌర సేవలు",
    navEmergency: "🚨 అత్యవసర & విపత్తు",
    navTracker: "📊 అప్లికేషన్ ట్రాకర్",
    sosButton: "🚨 SOS అత్యవసరం 112 / 108",
    selectRole: "పోర్టల్ రకాన్ని ఎంచుకోండి:",
    roleStudent: "విద్యార్థి పోర్టల్",
    roleCitizen: "పౌర పోర్టల్",
    roleEmergency: "అత్యవసర & విపత్తు",
    searchPlaceholder: "మీ సమస్యను సాధారణ భాషలో చెప్పండి (ఉదా: 'నాకు కాలేజీ ఫీజు సహాయం కావాలి')...",
    askButton: "NIVRA AI ని అడగండి",
    disasterAlert: "విపత్తు హెచ్చరిక: భారీ వర్షాలు మరియు వరదల సమాచారం ఉనికిలో ఉంది.",
    officialNotice: "అధికారిక గమనిక: అర్హత సమాచారం మార్గదర్శకం మాత్రమే."
  },
  ta: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — வழிசெல் தெரிவி சரிபார் அடை உதவு",
    subtitle: "ஒருங்கிணைந்த குடிமக்கள் மற்றும் மாணவர் உதவி தளம்",
    tagline: "வழிசெலுத்து. தெரிவி. சரிபார். அடை. உதவு.",
    navAi: "🤖 AI உதவியாளர்",
    navStudent: "🎓 மாணவர் மையம்",
    navCitizen: "🏛️ குடிமக்கள் சேவைகள்",
    navEmergency: "🚨 அவசரம் & பேரிடர்",
    navTracker: "📊 விண்ணப்ப டிராக்கர்",
    sosButton: "🚨 அவசர SOS 112 / 108",
    selectRole: "போர்ட்டல் தேர்வு செய்க:",
    roleStudent: "மாணவர் போர்ட்டல்",
    roleCitizen: "குடிமக்கள் போர்ட்டல்",
    roleEmergency: "அவசரம் & பேரிடர்",
    searchPlaceholder: "உங்கள் பிரச்சனையை எளிய தமிழில் உள்ளிடவும்...",
    askButton: "NIVRA AI கேளுங்கள்",
    disasterAlert: "பேரிடர் எச்சரிக்கை: வெள்ளப் பெருக்கு பாதுகாப்பு முன்னெச்சரிக்கை.",
    officialNotice: "அதிகாரப்பூர்வ அறிவிப்பு: தகுதித் தகவல் வழிகாட்டுதலுக்கு மட்டுமே."
  },
  mr: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — नेव्हिगेट माहिती सत्यापन पोहोच सहाय्य",
    subtitle: "एकत्रित नागरिक आणि विद्यार्थी सहाय्य व्यासपीठ",
    tagline: "नेव्हिगेट. माहिती. सत्यापित. पोहोच. सहाय्य.",
    navAi: "🤖 एआय सहाय्यक",
    navStudent: "🎓 विद्यार्थी केंद्र",
    navCitizen: "🏛️ नागरिक सेवा",
    navEmergency: "🚨 आपत्कालीन आणि आपत्ती",
    navTracker: "📊 अर्ज ट्रॅकर",
    sosButton: "🚨 आपत्कालीन SOS 112 / 108",
    selectRole: "तुमचा विभाग निवडा:",
    roleStudent: "विद्यार्थी पोर्टल",
    roleCitizen: "नागरिक पोर्टल",
    roleEmergency: "आपत्कालीन आणि आपत्ती",
    searchPlaceholder: "तुमची समस्या साध्या भाषेत सांगा...",
    askButton: "NIVRA AI ला विचारा",
    disasterAlert: "आपत्ती इशारा: पूर परिस्थितीचा सतर्कतेचा इशारा.",
    officialNotice: "अधिकृत सूचना: पात्रता माहिती केवळ मार्गदर्शनासाठी आहे."
  },
  bn: {
    appTitle: "NIVRA",
    appFullName: "NIVRA — নেভিগেট অবহিত যাচাই পৌঁছান সহায়তা",
    subtitle: "ঐক্যবদ্ধ নাগরিক ও ছাত্র সহায়তা প্ল্যাটফর্ম",
    tagline: "নেভিগেট। অবহিত। যাচাই। পৌঁছান। সহায়তা।",
    navAi: "🤖 এআই সহকারী",
    navStudent: "🎓 ছাত্র কেন্দ্র",
    navCitizen: "🏛️ নাগরিক পরিষেবা",
    navEmergency: "🚨 জরুরি ও দুর্যোগ",
    navTracker: "📊 অ্যাপ্লিকেশন ট্র্যাকার",
    sosButton: "🚨 জরুরি SOS 112 / 108",
    selectRole: "পোর্টাল নির্বাচন করুন:",
    roleStudent: "ছাত্র পোর্টাল",
    roleCitizen: "নাগরিক পোর্টাল",
    roleEmergency: "জরুরি ও দুর্যোগ",
    searchPlaceholder: "আপনার সমস্যা সহজ ভাষায় লিখুন...",
    askButton: "NIVRA AI কে জিজ্ঞাসা করুন",
    disasterAlert: "দুর্যোগ সতর্কতা: বন্যা এবং সতর্কতার বার্তা।",
    officialNotice: "অফিসিয়াল বিজ্ঞপ্তি: যোগ্যতার তথ্য কেবল নির্দেশনার জন্য।"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('nivra_lang') || 'en'; } catch { return 'en'; }
  });
  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('nivra_lang', lang); } catch { /* storage unavailable */ }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
