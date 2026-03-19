import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const TRANSLATIONS = {
  en: {
    welcome: "Your Vote, Your Voice, Protected Forever.",
    candidates: "Candidates",
    verifyPvc: "Verify PVC",
    voteNow: "Cast Your Vote",
    offlineMsg: "You are currently offline. Votes will be saved locally.",
    onlineMsg: "Back online. Syncing data...",
  },
  ha: {
    welcome: "Ƙuri'ar ku, Muryar ku, Kare har abada.",
    candidates: "Yan takara",
    verifyPvc: "Tabbatar da PVC",
    voteNow: "Yarda da kuɗinku",
    offlineMsg: "A halin yanzu kuna offline. Za'a adana ƙuri'un a gida.",
    onlineMsg: "Komawa online. Ana daidaita bayanai...",
  },
  yo: {
    welcome: "Ibo rẹ, Ohùn rẹ, Ti o ni idaabobo lailai.",
    candidates: "Awọn oludije",
    verifyPvc: "Daju PVC rẹ",
    voteNow: "Dibo rẹ",
    offlineMsg: "O wa ni offline bayi. Awọn ibo rẹ yoo wa ni fipamọ sori ẹrọ rẹ.",
    onlineMsg: "Pada si ori ayelujara. N ṣatunṣe data...",
  },
  ig: {
    welcome: "Ntuli aka gị, Olu gị, Chebere ruo mgbe ebighị ebi.",
    candidates: "Ndị ga-azọ ọkwa",
    verifyPvc: "Nyochaa PVC gị",
    voteNow: "Tụọ vootu gị",
    offlineMsg: "Ị nọghị n'ịntanetị ugbu a. A ga-echekwa vootu gị na mpaghara.",
    onlineMsg: "Laghachi n'ịntanetị. Na-emekọrịta data...",
  },
  pg: {
    welcome: "Your Vote, Your Voice, Protected For Life.",
    candidates: "Dem People Wey Want Post",
    verifyPvc: "Check Your PVC",
    voteNow: "Drop Your Vote",
    offlineMsg: "Network no dey. We go keep your vote for here first.",
    onlineMsg: "Network don come back. We dey sync your vote now.",
  }
};

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineVotes, setOfflineVotes] = useState([]);
  const [votes, setVotes] = useState({
    1: 420, 2: 380, 3: 150, 4: 90, 5: 45
  });

  const [fraudAlerts, setFraudAlerts] = useState(() => {
    const saved = localStorage.getItem('voteSmartAlerts');
    return saved ? JSON.parse(saved) : [
      { id: 101, timestamp: new Date().toLocaleTimeString(), message: "Suspicious login attempt from Overseas IP (192.168.1.1)" },
      { id: 102, timestamp: new Date().toLocaleTimeString(), message: "Duplicate PVC access detected for ID: NVN-20000101-0001" }
    ];
  });

  const [votersUsed, setVotersUsed] = useState({ "NVN-20000101-0001": true });

  const [verificationLogs, setVerificationLogs] = useState(() => {
    const saved = localStorage.getItem('voteSmartLogs');
    return saved ? JSON.parse(saved) : [
      { id: 1, timestamp: new Date().toLocaleTimeString(), pvcId: "NVN-20000101-0001", step: "PVC_AUTH", status: "SUCCESS", details: "Voter identified: John Doe" },
      { id: 2, timestamp: new Date().toLocaleTimeString(), pvcId: "NVN-20000101-0001", step: "OTP_AUTH", status: "SUCCESS", details: "Correct code entered" },
      { id: 3, timestamp: new Date().toLocaleTimeString(), pvcId: "NVN-20000101-0001", step: "BIOMETRIC", status: "SUCCESS", details: "Hash match 1024-bits" }
    ];
  });

  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [currentVoterId, setCurrentVoterId] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('voteSmartUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist User
  useEffect(() => {
    if (user) {
      localStorage.setItem('voteSmartUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('voteSmartUser');
    }
  }, [user]);

  // Persist Alerts
  useEffect(() => {
    localStorage.setItem('voteSmartAlerts', JSON.stringify(fraudAlerts));
  }, [fraudAlerts]);

  // Persist Logs
  useEffect(() => {
    localStorage.setItem('voteSmartLogs', JSON.stringify(verificationLogs));
  }, [verificationLogs]);

  // Network Sensitivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addVerificationLog = (pvcId, step, status, details = "") => {
    const timestamp = new Date().toLocaleTimeString();
    setVerificationLogs(prev => [{
      id: Date.now(),
      timestamp,
      pvcId,
      step,
      status,
      details
    }, ...prev]);
  };

  const addVote = (candidateId, voterId) => {
    if (votersUsed[voterId]) {
      addFraudAlert(`Duplicate vote attempt detected for PVC: ${voterId}`);
      addVerificationLog(voterId, "VOTING", "FAIL", "Duplicate attempt");
      return false;
    }
    
    setVotersUsed(prev => ({ ...prev, [voterId]: true }));
    setVotes(prev => ({
      ...prev,
      [candidateId]: (prev[candidateId] || 0) + 1
    }));
    addVerificationLog(voterId, "VOTING", "SUCCESS", `Vote cast for candidate ${candidateId}`);
    return true;
  };

  const addFraudAlert = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setFraudAlerts(prev => [{ id: Date.now(), timestamp, message }, ...prev]);
  };

  const logout = () => {
    setUser(null);
    setCurrentVoterId(null);
  };

  const t = (key) => TRANSLATIONS[lang][key] || key;

  const value = {
    lang, setLang,
    isHighContrast, setIsHighContrast,
    fontSize, setFontSize,
    isOnline, t,
    offlineVotes, setOfflineVotes,
    votes, addVote,
    fraudAlerts, addFraudAlert,
    verificationLogs, addVerificationLog,
    votersUsed,
    selectedCandidateId, setSelectedCandidateId,
    currentVoterId, setCurrentVoterId,
    user, setUser, logout
  };

  return (
    <AppContext.Provider value={value}>
      <div className={isHighContrast ? 'high-contrast' : ''} style={{ fontSize: `${fontSize}px` }}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
