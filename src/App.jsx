//imports

import {useEffect, useMemo, useState } from "react";
import MonkImg from "./assets/sage.png";
import CodingChar from "/codingchar.png";
import LoginModal from "./login.jsx";
import SignupForm from "./SignupForm.jsx";
import Roadmap from "./RoadMap";
import { Routes, Route, useNavigate } from "react-router-dom";
import React from "react";




// put this right below your import lines at the top
const API = 'http://localhost:4000';

// =============================================================
// MargaDarshak â€“ Gamified Career Readiness (Frontend Prototype)
// Tech: React + HTML + CSS + JS (no external UI libs)
// Single-file component that you can drop into a React project.
// Fully responsive + localStorage persistence + RPG UX.
// =============================================================


export default function MargaDarshakApp() {
  // ---------------------- Persistent App State ----------------------
  const [view, setView] = useState(() => localStorage.getItem("md_view") || "landing");
  const [domain, setDomain] = useState(() => localStorage.getItem("md_domain") || "");
  const [avatar, setAvatar] = useState(() => JSON.parse(localStorage.getItem("md_avatar") || "null"));
  const [gems, setGems] = useState(() => Number(localStorage.getItem("md_gems")) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem("md_level")) || 1);
  const [xp, setXp] = useState(() => Number(localStorage.getItem("md_xp") || 0));
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem("md_badges") || "[]"));
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem("md_inv") || "[]"));
  const [mentorNotes, setMentorNotes] = useState(() => JSON.parse(localStorage.getItem("md_notes") || "[]"));
  const [activeQuestId, setActiveQuestId] = useState(() => localStorage.getItem("md_activeQuestId") || "");
  const [showMenu, setShowMenu] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  
  // NEW: Settings + Theme state (persisted)
  const [showSettings, setShowSettings] = useState(false);
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState(
    () => localStorage.getItem("md_theme") || (systemPrefersDark ? "dark" : "light")
  );
//login user
const [loggedInUser, setLoggedInUser] = useState(
  () => localStorage.getItem("md_username") || null
);


  
  // Track completion status
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("md_completed") || "{}"));
  useEffect(() => localStorage.setItem("md_completed", JSON.stringify(completed)), [completed]);

useEffect(() => {
  const userId = localStorage.getItem("md_userId");
  if (!userId) return;

  (async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/state/${userId}`);
      if (!res.ok) throw new Error("Failed to load user state");
      const data = await res.json();

      // Set gems, level, and XP directly from backend data
      setGems(data.md_gems ?? 0);
      setLevel(data.md_level ?? 1);
      setXp(data.md_xp ?? 0);

      // Also store them in localStorage for consistency
      localStorage.setItem("md_gems", data.md_gems ?? 0);
      localStorage.setItem("md_level", data.md_level ?? 1);
      localStorage.setItem("md_xp", data.md_xp ?? 0);

      // Hydrate other related states similarly if needed
      setDomain(data.md_domain || '');
      setAvatar(data.md_avatar || null);
      setBadges(data.md_badges || []);
      setInventory(data.md_inv || []);
      setMentorNotes(data.md_notes || []);
      setActiveQuestId(data.md_activeQuestId || '');
      setCompleted(data.md_completed || {});
    } catch {
        console.error("Failed to load state on init");
  
        // Fallback to defaults if backend fetch fails
        setGems(0);
        setLevel(1);
        setXp(0);
        localStorage.setItem("md_gems", 0);
        localStorage.setItem("md_level", 1);
        localStorage.setItem("md_xp", 0);
      }
  })();
}, []);





  // FETCH-ON-MOUNT: bootstrap userId, then load md_* state from the server
useEffect(() => {
  (async () => {
    try {
      // 1) Reuse or create a userId
      let userId = localStorage.getItem('md_userId');
      if (!userId) {
        const r = await fetch(`${API}/api/users/bootstrap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await r.json();
        userId = data.userId;
        localStorage.setItem('md_userId', userId);
      }

      // 2) Load state and hydrate React state with the exact md_* keys
      const res = await fetch(`${API}/api/state/${userId}`);
      if (!res.ok) return;
      const st = await res.json();

      setDomain(st.md_domain || '');
      setAvatar(st.md_avatar || null);


      setLevel(st.md_level || 1);
      setXp(st.md_xp || 0);
      setBadges(st.md_badges || []);
      setInventory(st.md_inv || []);
      setMentorNotes(st.md_notes || []);
      setActiveQuestId(st.md_activeQuestId || '');
      setCompleted(st.md_completed || {});
    } catch (e) {
      console.warn('Hydrate failed', e);
    }
  })();
}, []);


// SAVE-ON-CHANGE: whenever these values change, persist to the API
useEffect(() => {
  const userId = localStorage.getItem('md_userId');
  if (!userId) return;

  const body = {
    md_domain: domain,
    md_avatar: avatar,
    md_gems: gems,
    md_level: level,
    md_xp: xp,
    md_badges: badges,
    md_inv: inventory,
    md_activeQuestId: activeQuestId,
    md_completed: completed
  };

  fetch(`${API}/api/state/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).catch(console.error);
}, [domain, avatar, gems, level, xp, badges, inventory, activeQuestId, completed]);

  // Persist to localStorage
  useEffect(() => localStorage.setItem("md_view", view), [view]);
  useEffect(() => localStorage.setItem("md_domain", domain), [domain]);
  useEffect(() => localStorage.setItem("md_avatar", JSON.stringify(avatar)), [avatar]);
  useEffect(() => localStorage.setItem("md_gems", gems), [gems]);
  useEffect(() => localStorage.setItem("md_level", level), [level]);

  useEffect(() => localStorage.setItem("md_xp", xp), [xp]);
  useEffect(() => localStorage.setItem("md_badges", JSON.stringify(badges)), [badges]);
  useEffect(() => localStorage.setItem("md_inv", JSON.stringify(inventory)), [inventory]);
  useEffect(() => localStorage.setItem("md_notes", JSON.stringify(mentorNotes)), [mentorNotes]);
  useEffect(() => localStorage.setItem("md_activeQuestId", activeQuestId), [activeQuestId]);
  useEffect(() => localStorage.setItem("md_theme", theme), [theme]); // NEW

  // ---------------------- Level / XP Mechanics ----------------------
  const xpForNext = useMemo(() => 100 + (level - 1) * 75, [level]);
  useEffect(() => {
    if (xp >= xpForNext) {
      const overflow = xp - xpForNext;
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(overflow);
      addNote("Level Up!", `The Monk smiles: your spirit ascends to Level ${newLevel}. Your aura glows brighter.`);
    }
  }, [addNote, level, xp, xpForNext]);

  // ---------------------- Content Data ----------------------
  const domains = [
    { id: "software", name: "Software", title: "Code Warrior", color: "#3ea1ff" },
    { id: "data", name: "Data", title: "Data Sage", color: "#34d399" },
    { id: "design", name: "Design", title: "Design Alchemist", color: "#f59e0b" },
    { id: "product", name: "Product", title: "Strategy Ronin", color: "#ef4444" },
    { id: "cloud", name: "Cloud/DevOps", title: "Cloud Shugenja", color: "#7c3aed" },
  ];

  const vedhasByDomain = {
    software: [
      { k: "DSA Basics", d: "Arrays, Hashing, Stacks/Queues, Trees/Graphs" },
      { k: "OOP & Design", d: "SOLID, patterns, architecture basics" },
      { k: "Web Basics", d: "HTTP, REST, auth, state" },
      { k: "System Design Intro", d: "scalability, caching, DB sharding" },
    ],
    data: [
      { k: "Stats & Prob.", d: "distributions, hypothesis tests" },
      { k: "ML Essentials", d: "supervised, unsupervised, metrics" },
      { k: "SQL + Pandas", d: "joins, window funcs, data wrangling" },
      { k: "Visualization", d: "storytelling, charts, dashboards" },
    ],
    design: [
      { k: "Design Systems", d: "grids, spacing, color, typography" },
      { k: "UX Flows", d: "IA, wireframes, heuristics" },
      { k: "Prototyping", d: "Figma basics, interactions" },
      { k: "Portfolio", d: "case studies, storytelling" },
    ],
    product: [
      { k: "PRD & Specs", d: "problem, goals, scoping" },
      { k: "Metrics", d: "north-star, funnels, experiments" },
      { k: "Roadmaps", d: "prioritization, trade-offs" },
      { k: "Comms", d: "stakeholders, storytelling" },
    ],
    cloud: [
      { k: "Linux & Networking", d: "basic cmds, TCP/IP, DNS" },
      { k: "CI/CD", d: "pipelines, testing, releases" },
      { k: "Containers", d: "Docker, K8s foundations" },
      { k: "Cloud Basics", d: "AWS/GCP/Azure core services" },
    ],
  };


  const quests = useMemo(() => ([
    { id: "apt-1", type: "Aptitude", title: "Numbers Trial", diff: 1, xp: 30, gems: 5 },
    { id: "eng-1", type: "English", title: "Grammar Shrine", diff: 1, xp: 25, gems: 4 },
    { id: "code-1", type: "Coding", title: "Array Oni", diff: 2, xp: 50, gems: 10, domain: "software" },
    { id: "code-2", type: "Coding", title: "Graph Kitsune", diff: 3, xp: 80, gems: 16, domain: "software" },
    { id: "data-1", type: "Data", title: "SQL Torii", diff: 2, xp: 50, gems: 10, domain: "data" },
    { id: "design-1", type: "Design", title: "Grid Mandala", diff: 2, xp: 40, gems: 8, domain: "design" },
    { id: "soft-1", type: "Soft Skills", title: "Confidence Dojo", diff: 1, xp: 25, gems: 5 },
    { id: "int-1", type: "Interview", title: "Mock Samurai", diff: 3, xp: 90, gems: 18 },
  ]), []);


  

  // ---------------------- Mentor / Notes ----------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function addNote(title, text) {
    const note = { id: cryptoId(), title, text, at: new Date().toISOString() };
    setMentorNotes((n) => [note, ...n].slice(0, 30));
  }


  // ---------------------- Avatar Generation ----------------------
  function makeAvatar(domainId) {
    const dom = domains.find((d) => d.id === domainId);
    if (!dom) return null;
    const base = {
      name: dom.title,
      domain: dom.id,
      stage: 1, // evolves on level-up milestones
      color: dom.color,
      relics: [],
    };
    return base;
  }
  

  // Evolve avatar on milestone levels
  useEffect(() => {
    if (!avatar) return;
    let stage = avatar.stage;
    if (level >= 2) stage = 2;
    if (level >= 4) stage = 3;
    if (level >= 6) stage = 4;
    if (stage !== avatar.stage) {
      setAvatar({ ...avatar, stage });
      addNote("Evolution", `Your ${avatar.name} form strengthens (Stage ${stage}).`);
    }
  }, [addNote, avatar, level]);


  // ---------------------- Utility ----------------------
  function cryptoId() { return Math.random().toString(36).slice(2, 9); }
  function fmt(n) { return new Intl.NumberFormat().format(n); }

// (removed duplicate saveUserStateToBackend)

  function resetAll() {
    if (!window.confirm("This will reset your MargaDarshak journey.")) return;
    localStorage.clear();
    setView("landing");
    setDomain("");
    setAvatar(null);
    setGems(0);
    setLevel(1);
    setXp(0);
    setBadges([]);
    setInventory([]);
    setMentorNotes([]);
    setCompleted({});
    setActiveQuestId("");
  }


  // ---------------------- Actions ----------------------

// (Removed unused onQuestComplete function)

function App() {
  const navigate = useNavigate();

  return (
    <>
      {/* Your custom header/menu */}
      <div className="header-menu">
        <button onClick={() => navigate("/roadmap")}>Road Map</button>
        {/* add other buttons here similarly */}
      </div>

      {/* Routing */}
      <Routes>
        {/* Add your other routes here */}
        <Route path="/roadmap" element={<Roadmap />} />
        {/* Add a default or home route */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}
function HomePage() {
  return <div>Welcome Home</div>;
}


    
    // multiple updates of reward to backend
function saveUserStateToBackend(newGems, newLevel, newXp) {
  const userId = localStorage.getItem("md_userId");
  if (!userId) return;
  fetch(`${API}/api/state/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ md_gems: newGems, md_level: newLevel, md_xp: newXp }),
  }).catch(console.error);
}


function claimReward(q) {
  if (completed[q.id]) return;

  // Mark quest complete in state
  setCompleted(c => ({ ...c, [q.id]: { xp: q.xp, gems: q.gems, at: Date.now() } }));

  // Calculate new state values
  const newGems = gems + q.gems;
  const newXp = xp + q.xp;

  const xpForNext = 100 + (level - 1) * 75;
  let newLevel = level;
  let remainingXp = newXp;

  if (newXp >= xpForNext) {
    newLevel = level + 1;
    remainingXp = newXp - xpForNext;
  }

  // Update local state
  setGems(newGems);
  setXp(remainingXp);
  setLevel(newLevel);

  // Sync gems, level, xp to backend
  saveUserStateToBackend(newGems, newLevel, remainingXp);

  // Badge and mentor note updates as usual
  const badgeMaybe = badgeForQuest(q);
  if (badgeMaybe && !badges.includes(badgeMaybe)) setBadges(b => [...b, badgeMaybe]);

  addNote(
    "Quest Complete",
    `You bested “${q.title}”. +${q.xp} XP, +${q.gems} gems.`
  );
}



function resetUserState() {
  setGems(0);
  setLevel(1);
  setXp(0);
  setBadges([]);
  setInventory([]);
  setMentorNotes([]);
  setActiveQuestId('');
  setCompleted({});
  setAvatar(null);
  setDomain('');
  
  setLoggedInUser(null);
  setView('landing');  // or whatever is your initial screen

  // Clear relevant localStorage keys
  localStorage.removeItem('md_gems');
  localStorage.removeItem('md_level');
  localStorage.removeItem('md_xp');
  localStorage.removeItem('md_badges');
  localStorage.removeItem('md_inv');
  localStorage.removeItem('md_notes');
  localStorage.removeItem('md_activeQuestId');
  localStorage.removeItem('md_completed');
  localStorage.removeItem('md_avatar');
  localStorage.removeItem('md_domain');
  localStorage.removeItem('username');
  localStorage.removeItem('md_userId');  // Optional, if you want to clear user session completely
}




  function badgeForQuest(q) {
    if (q.type === "Aptitude") return "Aptitude Novice";
    if (q.type === "English") return "Silver Tongue";
    if (q.type === "Coding" && q.diff >= 3) return "Code Warrior";
    if (q.type === "Data") return "Data Sage";
    if (q.type === "Design") return "Design Adept";
    if (q.type === "Interview") return "Interview Samurai";
    return null;
  }


 function spendGemForHint() {
  if (gems <= 0) {
    addNote("Hint", "The vault is empty. Earn gems by finishing quests.");
    return;
  }

  // Decrement gems locally
  const newGems = gems - 1;
  setGems(newGems);

  // Sync updated gems count to backend
  saveUserStateToBackend(newGems, level, xp);

  // Generate hint and show
  const tip = aiHint(domain, activeQuestId || "");
  addNote("Hidden Secret", tip);
  setShowHint(true);
}



  // Offline, rule-based â€œAIâ€ hint generator (no external APIs)
  function aiHint(dom, qid) {
    const base = {
      software: [
        "For arrays, use two-pointers to cut O(n^2) to O(n).",
        "Hashmaps turn searching into O(1) on average.",
        "Explain your approach first, then code. Communicate trade-offs.",
      ],
      data: [
        "Check distribution; outliers can skew your mean.",
        "Start with a baseline model; improve iteratively.",
        "SQL windows: ROW_NUMBER, RANK unlock many problems.",
      ],
      design: [
        "Use an 8px spacing system; it creates harmony.",
        "Text hierarchy: size, weight, colorâ€”donâ€™t use all caps everywhere.",
        "Contrast + proximity guide the eye along the story.",
      ],
      product: [
        "Define success metrics before building.",
        "Prioritize by impact Ã— confidence Ã· effort.",
        "User interviews: ask open-ended, non-leading questions.",
      ],
      cloud: [
        "Automate repetitive tasks; CI/CD is your ally.",
        "Use health checks and autoscaling for resilience.",
        "Logs + metrics + traces = observability triad.",
      ],
    };
    const arr = base[dom] || ["Mastery comes from deliberate practice."];
    const pick = arr[Math.floor(Math.random() * arr.length)];
    if (!qid) return pick;
    return `${pick} (Quest: ${qid})`;;
  }


  function chooseDomain(domId) {
    setDomain(domId);
    const av = makeAvatar(domId);
    setAvatar(av);
    addNote("The Choice", `You chose the path of ${domains.find(d=>d.id===domId)?.title}. Your avatar awakens.`);
    setTimeout(() => setView("vedhas"), 600);
  }
  
  
  


  // ---------------------- Render Helpers ----------------------
  
  function ProgressBar({ value, max }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="md-progress" aria-label="progress">
        <div className="md-progress-fill" style={{ width: pct + "%" }} />
        <span className="md-progress-text">{value}/{max} XP</span>
      </div>
    );
    
  }


  function StatPill({ icon, label, value }) {
  return (
    <div className="pill">
      <span className="pill-icn" aria-hidden>{icon}</span>
      <span className="pill-txt">{label}: <b>{value}</b></span>
    </div>
  );
}



async function handleLoginSuccess(username, userId) {
  setLoggedInUser(username);
  localStorage.setItem("md_username", username);
  localStorage.setItem("md_userId", userId);

  try {
    const res = await fetch(`http://localhost:4000/api/state/${userId}`);
    const data = await res.json();
    setGems(data.md_gems || 0);
    setLevel(data.md_level || 1);
    localStorage.setItem("md_gems", data.md_gems || 0);
    localStorage.setItem("md_level", data.md_level || 1);
  } catch {
    setGems(0);
    setLevel(1);
    localStorage.setItem("md_gems", 0);
    localStorage.setItem("md_level", 1);
  }

  setShowLoginModal(false);
}



  





function HeaderBar({
  showSettings,
  setShowSettings,
  theme,
  setTheme,
  resetAll,
  setView,
  showMenu,
  setShowMenu,
  loggedInUser,
  showLoginModal,
  setShowLoginModal,
  handleLoginSuccess,
  gems,
  level,
  fmt
}) {
  
  return (
    <header className="topbar">
      <div className="left-group">
        <button
          className="settings-btn"
          aria-haspopup="menu"
          aria-expanded={showSettings}
          aria-label="Open Settings"
          title="Settings"
          onClick={() => setShowSettings(s => !s)}
        >
          ⚙️
        </button>

        <div className="brand" onClick={() => setView("landing")}>
          <span className="brand-logo" aria-hidden>卍</span>
          <span className="brand-text">MargaDarshak</span>
        </div>

        {showSettings && (
          <div className="settings-panel" role="menu">
            <div className="settings-row">
              <span>Theme</span>
              <button
                className="switch"
                role="switch"
                aria-checked={theme === "dark"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle light/dark"
              >
                {theme === "dark" ? "Dark" : "Light"}
              </button>
            </div>
            <div className="settings-row">
              <button className="reset-btn" onClick={resetAll}>Reset Journey</button>
            </div>
            {loggedInUser && (
            <div className="settings-row">
              <button
                className="reset-btn"
                onClick={() => {
                  resetUserState();        // your function to clear all user state and localStorage
                  setShowSettings(false);
                }}
              >
                Logout
              </button>
            </div>
            )}

          </div>
        ) }
      </div>

      <nav className={"nav " + (showMenu ? "show" : "")}>
        <button className="nav-btn" onClick={() => setView("vedhas")}>Vedhas</button>
        <button className="nav-btn" onClick={() => setView("quests")}>Quest Arena</button>
        <button className="nav-btn" onClick={() => setView("rewards")}>Rewards & Inventory</button>
        <button className="nav-btn" onClick={() => setView("mentor")}>Mentor Chamber</button>
        <button className="nav-btn" onClick={() => setView("Road Map")}>Road Map</button>
        
        {loggedInUser ? (
          <span
            style={{
              marginLeft: "14px",
              padding: "8px 20px",
              borderRadius: "8px",
              boxSizing: "border-box",
              background: "#564e0a47",
              color: "white",
              fontWeight: "bold"
            }}
          >
            Welcome, {loggedInUser}
          </span>
        ) : (
          <button
            style={{
              marginLeft: "14px",
              padding: "6px 20px",
              borderRadius: "8px",
              boxSizing: "border-box",
              background: "#634b38ff",
              color: "white",
              fontWeight: "bold"
            }}
            onClick={() => setShowLoginModal(true)}
          >
            Login / Sign Up
          </button>
        )}
      </nav>

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <div className="stats">
        <StatPill icon="💎" label="Gems" value={fmt(gems)} />
        <StatPill icon="⭐" label="Level" value={level} />
      </div>
      <button className="hamburger" onClick={() => setShowMenu(s=>!s)} aria-label="Open Menu">
        ☰
      </button>
    </header>
  );
}









  // ---------------------- Screens ----------------------
  function ScreenLanding() {
    return (
      <section className="screen landing">
        <div className="hero">
          <img src={MonkImg} alt="Monk avatar" className="monk" width="200" height="200" />
          <div className="hero-copy">
            <h1 className="title glow">MargaDarshak</h1>
            <p className="subtitle">.</p>
            <button className="cta" onClick={() => setView("choose")}>Start Your Quest</button>
          </div>
        </div>
        <AmbientDecor/>
      </section>
    );
  }


  function ScreenChoose() {
    return (
      <section className="screen choose">
        <div className="choose-head">
          <MonkBubble text="Choose your path, seeker. Each domain reveals a different avatar and destiny."/>
        </div>
        <div className="domains">
          {domains.map(d => (
            <button key={d.id} className="domain-card" onClick={() => chooseDomain(d.id)}>
              <AvatarBadge title={d.title} color={d.color} stage={1} small/>
              <span className="domain-name">{d.name}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }


  function ScreenVedhas() {
    const list = vedhasByDomain[domain] || [];
    return (
      <section className="screen vedhas">
        <div className="screen-head">
          <MonkBubble text="Within the Vedhas temple, wisdom sleeps on glowing scrolls. Awaken it."/>
          <div className="head-right">
            <StatPill icon="⭐" label="Level" value={level} />
            <ProgressBar value={xp} max={xpForNext} />
          </div>
        </div>
        <div className="scrolls">
          {list.map((s) => (
            <article key={s.k} className="scroll-card">
              <h3>{s.k}</h3>
              <p>{s.d}</p>
              <button
 className="ghost"
 onClick={() =>
   addNote("Study", `You studied "${s.k}". Keep momentum.`)
               } 
>
              Read Scroll
              </button>


            </article>
          ))}
          {list.length === 0 && (
            <article className="scroll-card">
              <h3>Pick a Domain</h3>
              <p>Return to the Monk and choose your path to unlock domain scrolls.</p>
              <button className="ghost" onClick={() => setView("choose")}>Choose Now</button>
            </article>
          )}
        </div>
      </section>
    );
  }


  function ScreenQuests() {
    const available = quests.filter(q => !q.domain || q.domain === domain);
    return (
      <section className="screen quests">
        <div className="screen-head">
          <MonkBubble text="Every challenge is a gate. Pass through, and the path brightens."/>
          <div className="head-right">
            <StatPill icon="💎" label="Gems" value={fmt(gems)} />
            <StatPill icon="🏅" label="Badges" value={badges.length} />
          </div>
        </div>
        <div className="quest-grid">
          {available.map(q => (
            <div key={q.id} className={"quest-card " + (completed[q.id] ? "done" : "") }>
              <div className="quest-top">
                <span className="q-type">{q.type}</span>
                <span className="q-diff" title="Difficulty">{"★".repeat(q.diff)}</span>
              </div>
              <h3 className="q-title">{q.title}</h3>
              <div className="q-rewards">
                <span>+{q.xp} XP</span>
                <span>+{q.gems} 💎</span>
              </div>
              <div className="q-actions">
                {!completed[q.id] ? (
                  <>
                    <button className="primary" onClick={() => { setActiveQuestId(q.id); setView("challenge"); }}>Enter Quest</button>
                    <button className="hint" onClick={() => { setActiveQuestId(q.id); spendGemForHint(); }}>Hint (1💎)</button>
                  </>
                ) : (
                  <span className="done-badge">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  function ScreenChallenge() {
    const q = quests.find(q => q.id === activeQuestId);
    if (!q) return (
      <section className="screen center">
        <p>No quest selected.</p>
        <button className="ghost" onClick={() => setView("quests")}>Back</button>
      </section>
    );


    return (
      <section className="screen challenge">
        <div className="challenge-head">
          <h2>{q.title}</h2>
          <div className="head-right">
            <span className="q-meta">Type: {q.type} â€¢ Difficulty: {"★".repeat(q.diff)}</span>
            <div className="q-rwds"><span>Reward: +{q.xp} XP, +{q.gems} 💎</span></div>
          </div>
        </div>
        <div className="challenge-body">
          <div className="timer" data-run>
            <QuestTimer seconds={q.diff * 60 + 60} onExpire={() => addNote("Time", "The sands fall; focus on pace next time.")} />
          </div>
          <div className="prompt">
            {q.type === "Coding" && (
              <>
                <p>Implement a function to solve the challenge described. Pseudocode first, then refine.</p>
                <ul>
                  <li>State complexity (time/space).</li>
                  <li>Consider edge cases.</li>
                  <li>Write clean, readable code.</li>
                </ul>
              </>
            )}
            {q.type === "Aptitude" && (
              <>
                <p>Practice 5 quick problems on percentages & ratios. Explain your reasoning succinctly.</p>
              </>
            )}
            {q.type === "English" && (
              <>
                <p>Correct grammar in given sentences and rewrite professionally.</p>
              </>
            )}
            {q.type === "Soft Skills" && (
              <>
                <p>Record or rehearse a 60s pitch: Who you are, what you do, what you want.</p>
              </>
            )}
            {q.type === "Interview" && (
              <>
                <p>Answer 3 behavioral questions using the STAR format.</p>
              </>
            )}
            {q.type === "Data" && (
              <>
                <p>Write an SQL query: Top 3 products by revenue per month. Consider window functions.</p>
              </>
            )}
          </div>
          <div className="challenge-actions">
            <button className="hint" onClick={() => spendGemForHint()}>Get Hint (1💎)</button>
            {!completed[q.id] ? (
              <button className="primary" onClick={() => { claimReward(q); setView("mentor"); }}>Submit & Claim</button>
            ) : (
              <button className="ghost" onClick={() => setView("quests")}>Back to Arena</button>
            )}
          </div>
        </div>
      </section>
    );
  }


  function ScreenRewards() {
    return (
      <section className="screen rewards">
        <div className="screen-head">
          <MonkBubble text="Treasures mirror your effort. Use them wisely to unveil deeper secrets."/>
          <div className="head-right">
            <StatPill icon="💎" label="Gems" value={fmt(gems)} />
            <StatPill icon="⭐" label="Level" value={level} />
          </div>
        </div>
        <div className="inv">
          <div className="inv-card">
            <h3>Avatar</h3>
            {avatar ? (
              <div className="avatar-wrap">
                <AvatarBadge title={avatar.name} color={avatar.color} stage={avatar.stage} />
                <p className="muted">Domain: {domains.find(d=>d.id===avatar?.domain)?.name}</p>
              </div>
            ) : (
              <p>Select a domain to awaken your avatar.</p>
            )}
          </div>
          <div className="inv-card">
            <h3>Badges</h3>
            <div className="badges">
              {badges.length === 0 && <p className="muted">No badges yet. Conquer quests to earn some.</p>}
              {badges.map(b => <span key={b} className="badge" title={b}>{b}</span>)}
            </div>
          </div>
          <div className="inv-card">
            <h3>Artifacts</h3>
            <div className="artifacts">
              {inventory.length === 0 && <p className="muted">Your inventory is empty. Artifacts appear on milestone levels.</p>}
              {inventory.map((it, i) => (
                <div key={i} className="artifact">
                  <span className="art-title">{it.name}</span>
                  <span className="art-meta">{it.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }


  function ScreenMentor() {
    return (
      <section className="screen mentor">
        <div className="screen-head">
          <MonkBubble text="I am your guide. Read the scrolls of feedback after each trial."/>
          <div className="head-right">
            <button className="ghost" onClick={() => addNote("Daily Wisdom", "Consistency is the sharpest blade.")}>New Wisdom</button>
          </div>
        </div>
        <div className="notes">
          {mentorNotes.length === 0 && <p className="muted">No messages yet. Complete quests to receive guidance.</p>}
          {mentorNotes.map(n => (
            <div key={n.id} className="note">
              <h4>{n.title}</h4>
              <p>{n.text}</p>
              <span className="note-time">{new Date(n.at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }


  // ---------------------- Small Components ----------------------
  function MonkBubble({ text }) {
    return (
      <div className="monk-bubble">
        <img src={MonkImg} alt="Monk avatar" className="mini-monk" width="56" height="56" />
        <div className="bubble glow-border">
          <p>{text}</p>
        </div>
      </div>
    );
  }


  function MonkSVG({ className }) {
    // Minimal decorative SVG (animeâ€‘ish monk silhouette)
    return (
      <svg className={className} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9bd7ff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#halo)"/>
        <path d="M60 28c12 0 16 10 16 18 0 12-8 18-16 18s-16-6-16-18c0-8 4-18 16-18z" fill="#d97706"/>
        <path d="M26 92c4-18 20-26 34-26s30 8 34 26c-7 6-22 10-34 10S33 98 26 92z" fill="#92400e"/>
      </svg>
    );
  }


  function AvatarBadge({ title, color, stage, small }) {
    return (
      <div className={"avatar-badge stage-" + stage + (small ? " small" : "") } style={{ borderColor: color }}>
        <div className="avatar-icon" style={{ background: color }}>
          {/* stylized mask */}
          <img src={CodingChar} alt={title} className="avatar-img" width="100" height="100" />
        </div>
        <div className="avatar-meta">
          <strong>{title}</strong>
          <span>Stage {stage}</span>
        </div>
      </div>
    );
  }


  function AmbientDecor() {
    return (
      <div className="ambient">
        <div className="sakura"/>
        <div className="torii"/>
        <div className="lantern"/>
      </div>
    );
  }


  function QuestTimer({ seconds = 120, onExpire }) {
    const [left, setLeft] = useState(seconds);
    useEffect(() => {
      if (left <= 0) { onExpire && onExpire(); return; }
      const id = setTimeout(() => setLeft((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }, [left, onExpire]);
    const m = Math.floor(left / 60); const s = left % 60;
    return <div className="timer-box" aria-live="polite">â³ {m}:{String(s).padStart(2, "0")}</div>;
  }

  useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  // ---------------------- Root Render ----------------------
  // ---------------------- Root Render ----------------------
return (
  <>
    <div className={showLoginModal ? "app-content blurred" : "app-content"}>
      <div className="md-root" data-theme={theme}>
        <StyleTag />

        {/* HeaderBar with all required props */}
        <HeaderBar
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        theme={theme}
        setTheme={setTheme}
        resetAll={resetAll}
        setView={setView}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        loggedInUser={loggedInUser}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        handleLoginSuccess={handleLoginSuccess}
        gems={gems}
        level={level}
        fmt={fmt}
      />

        <main className="main">
          {/* Insert SignupForm conditionally */}
          {view === "signup" && <SignupForm />}
          {view === "landing" && <ScreenLanding />}
          {view === "choose" && <ScreenChoose />}
          {view === "vedhas" && <ScreenVedhas />}
          {view === "quests" && <ScreenQuests />}
          {view === "challenge" && <ScreenChallenge />}
          {view === "rewards" && <ScreenRewards />}
          {view === "mentor" && <ScreenMentor />}
          

        </main>

        <footer className="footer">
          <div className="left">
            <button className="link" onClick={() => setView("choose")}>
              Change Domain
            </button>
            <button className="link" onClick={() => setView("quests")}>
              Arena
            </button>
            <button className="link" onClick={() => setView("vedhas")}>
              Vedhas
            </button>
          </div>
          <div className="right">
            <button className="reset-btn reset-btn--fixed" onClick={resetAll}>
              Reset Journey
            </button>
          </div>
        </footer>

        {showHint && (
          <div className="modal" onClick={() => setShowHint(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Secret Revealed</h3>
              <p>{mentorNotes?.text}</p>
              <button className="primary" onClick={() => setShowHint(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu - slide down */}
      {showMenu && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(26, 24, 22, 0.95)",
            zIndex: 3000,
            display: "flex",
            flexDirection: "column",
            padding: "100px 70px 50px 70px",
            boxSizing: "border-box",
          }}
        >
          <button
            className="close-btn"
            onClick={() => setShowMenu(false)}
            style={{
              position: "absolute",
              top: '5%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 28,
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              zIndex: 3010,
            }}
          >
            ✕
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              setShowMenu(false);
              setView("vedhas");
            }}
          >
            Vedhas
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              setShowMenu(false);
              setView("quests");
            }}
          >
            Quest Arena
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              setShowMenu(false);
              setView("rewards");
            }}
          >
            Rewards
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              setShowMenu(false);
              setView("mentor");
            }}
          >
            Mentor
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              setShowMenu(false);
              setView("Road Map");
            }}
          >
            Road Map
          </button>
          <hr style={{ margin: "8px 0", borderColor: "#333", opacity: 0.3 }} />
          <button
            className="settings-btn"
            onClick={() => {
              setShowMenu(false);
              setShowSettings(true);
            }}
            style={{
              margin: "10px 0",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Settings
          </button>
          <button
            className="reset-btn"
            onClick={() => {
              setShowMenu(false);
              if (window.confirm("Are you sure you want to reset your journey?")) {
                resetAll();
              }
            }}
            style={{
              backgroundColor: "#8b1c1c",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Reset Journey
          </button>
        </div>
      )}

      
    </div>
    <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
  </>
);

}



// ---------------------- Styles (No external CSS) ----------------------
function StyleTag() {
  return (
    <style>{`
      :root{
        --bg:#140d0a;             /* deep earth */
        --bg-card:#1b120e;         /* temple wood */
        --bg-soft:#221610;         /* darker panel */
        --gold:#d4a74d;            /* sacred gold */
        --ember:#b45309;           /* deep orange */
        --ruby:#8b1c1c;            /* deep red */
        --jade:#10b981;            /* emerald glow */
        --sky:#38bdf8;             /* blue glow */
        --silver:#cbd5e1;          /* silver text */
        --text:#f8fafc;            /* near-white */
        --muted:#cbd5e6b0;
        --shadow: 0 10px 30px rgba(0,0,0,.35);
        --radius: 16px;
        --app-bg: radial-gradient(1200px 600px at 10% 0%, #2a1a13 0%, #140d0a 40%, #0b0705 100%); /* NEW */
      }
      *{box-sizing:border-box}
      html,body,#root,.md-root{height:100%}
      body{margin:0;background:radial-gradient(1200px 600px at 10% 0%, #2a1a13 0%, #140d0a 40%, #0b0705 100%); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Hiragino Kaku Gothic Pro", "Noto Sans", sans-serif;}
      .md-root{ background: var(--app-bg); } /* NEW: app paints via variable */

      .topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:12px;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(212,167,77,.2);background:linear-gradient(180deg, rgba(20,13,10,.85), rgba(20,13,10,.55));backdrop-filter: blur(6px)}
      .brand{display:flex;align-items:center;gap:10px;cursor:pointer}
      .brand-logo{font-size:22px; color:var(--gold); text-shadow:0 0 12px rgba(212,167,77,.6)}
      .brand-text{font-weight:800; letter-spacing:.5px}
      .nav{display:flex;gap:8px}
      .nav.show{display:flex}
      .nav-btn{background:transparent;color:var(--silver);border:1px solid rgba(212,167,77,.25);padding:8px 12px;border-radius:999px;cursor:pointer;transition:.2s}
      .nav-btn:hover{border-color:var(--gold); color:var(--text); box-shadow:0 0 18px rgba(56,189,248,.25)}
      .stats{display:flex;gap:8px;align-items:center}
      .pill{display:flex;gap:6px;align-items:center;background:var(--bg-soft);border:1px solid rgba(212,167,77,.25);border-radius:999px;padding:6px 10px}
      .pill-icn{filter:drop-shadow(0 0 6px rgba(56,189,248,.35))}
      .hamburger{display:none;background:transparent;color:var(--gold);border:1px solid rgba(212,167,77,.25);padding:8px 12px;border-radius:8px}

      /* NEW: Top-left settings cluster */
      .left-group{ display:flex; align-items:center; gap:10px; position:relative; }
      .settings-btn{
        background:transparent; border:1px solid rgba(212,167,77,.35);
        color:var(--silver); padding:6px 10px; border-radius:8px; cursor:pointer;
      }
      .settings-btn:hover{ border-color:var(--gold); color:var(--text); }
      .settings-panel{
        position:absolute; left:0; top:42px; width:260px;
        background:var(--bg-card); border:1px solid rgba(212,167,77,.35);
        border-radius:14px; box-shadow: var(--shadow); padding:10px; z-index:30;
      }
      .settings-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 6px; }
      .settings-row + .settings-row{ border-top:1px dashed rgba(212,167,77,.25); }
      .switch{
        background:linear-gradient(90deg, var(--sky), var(--jade));
        color:#0b0705; border:none; padding:6px 10px; border-radius:999px; cursor:pointer; font-weight:800;
      }
      .danger.full{ width:100%; }

      @media (max-width: 820px){
        .nav{display:none}
        .nav.show{ display:flex; flex-direction:column; gap:8px; } 
      }


      .main{padding:16px; max-width:1200px; margin:0 auto;}
      .footer{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-top:1px solid rgba(212,167,77,.2); color:var(--muted)}
      .link{background:transparent;border:none;color:var(--silver);cursor:pointer;margin-right:8px}
      /* default (dark) â€“ keep your current styling */
          .reset-btn { background: #2a1913;color: #fff; }
          .reset-btn:hover { background: #000; border-color: #2a1913; }

          /* LIGHT MODE override */
          :root[data-theme="light"] .reset-btn {
            color: #000;                 /* black text in light mode */
            text-shadow: none;           /* avoid glow meant for dark */
            background: #fde8ef;         /* optional: light pink background */
            border-color: #f8b4c6;       /* optional: matching border */
          }
            :root[data-theme="light"] .reset-btn:hover {
            background: #f9dbe6;      /* slightly darker/livelier on hover */
            border-color: #f3a4bd;    /* optional tweak */
            color: #000;              /* keep text black */
          }

          /* ensure the fixed bottom-right one also obeys light mode */
          :root[data-theme="light"] .reset-btn--fixed { color: #000; }



      /* LANDING */
      .landing .hero{display:grid;grid-template-columns: 220px 1fr; gap:18px; align-items:center; background:linear-gradient(90deg, rgba(139,28,28,.15), rgba(16,185,129,.08)); border:1px solid rgba(212,167,77,.25); box-shadow: var(--shadow); padding:18px; border-radius: var(--radius); position:relative; overflow:hidden}
      .title{font-size: clamp(28px, 6vw, 52px); margin:0;}
      .subtitle{margin:4px 0 16px; color:var(--silver)}
      .cta{background:linear-gradient(90deg, #d4a74d, #38bdf8); color:#0b0705; border:none;border-radius:999px; padding:12px 18px; cursor:pointer; font-weight:800; box-shadow:0 0 18px rgba(56,189,248,.35)}
      .cta:hover{transform: translateY(-1px)}
      .monk{
        width:200px;
        height:200px;
        display:block;                 /* avoids inline-gap issues */
        object-fit: cover;             /* fill the square, crop if needed */
        object-position: center;       /* center the crop */
        animation: float 4s ease-in-out infinite;
      }


      .ambient .sakura, .ambient .torii, .ambient .lantern{position:absolute; pointer-events:none}
      .ambient .sakura{right:-40px; top:-40px; width:160px; height:160px; background: radial-gradient(circle at 30% 30%, rgba(248,113,113,.8), rgba(248,113,113,0) 60%); filter: blur(10px)}
      .ambient .torii{left:-60px; bottom:-60px; width:200px; height:120px; background: conic-gradient(from 0deg, rgba(212,167,77,.35), transparent 60%)}
      .ambient .lantern{right:30%; bottom:-40px; width:60px; height:120px; background: radial-gradient(circle at 50% 20%, rgba(212,167,77,.85), rgba(212,167,77,0) 70%); filter: blur(8px)}


      /* Animation */
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}


/* Global responsiveness */
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: #0d0d0d;
  color: #fff;
}


/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.85);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.3rem;
}
.navbar-links {
  display: flex;
  gap: 1rem;
}
.navbar-links button {
  background: none;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;
}
.navbar-links button:hover {
  color: gold;
}


/* Cards */
.scroll-card, .quest-card, .reward-card, .mentor-note {
  background: rgba(255,255,255,0.05);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  animation: float 4s ease-in-out infinite;
}


/* Buttons */
button {
  padding: 0.6rem 1.2rem;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
button.primary {
  background: linear-gradient(90deg, gold, orange);
  color: #000;
}
button.ghost {
  background: none;


  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
}
button.ghost:hover {
  border-color: gold;
  color: gold;
}


/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  .scroll-card, .quest-card, .reward-card, .mentor-note {
    margin: 0.5rem;
    padding: 0.8rem;
  }
  h1, h2, h3 {
    font-size: 1.2rem;
  }
  p {
    font-size: 0.9rem;
  }
}
@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  button {
    width: 100%;
  }
}



      /* CHOOSE */
      .choose .domains{display:grid;grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap:12px}
      .domain-card{background:var(--bg-card); border:1px solid rgba(249, 248, 246, 0.2); border-radius:var(--radius); padding:12px; cursor:pointer; display:flex; gap:10px; align-items:center; transition:.2s;min-width:0; overflow:hidden}
      .domain-card:hover{transform: translateY(-2px); box-shadow: 0 12px 24px rgba(16,185,129,.15)}
      .domain-name{font-weight:700; color:#FFFFFF;}

      

      .monk-bubble{display:flex; align-items:flex-start; gap:10px; margin-bottom:12px}
      .mini-monk{width:56px;height:56px;display:block;object-fit:cover;object-position:center}
      .bubble{flex:1; padding:10px; background:linear-gradient(180deg, rgba(56,189,248,.08), rgba(16,185,129,.06)); border:1px solid rgba(212,167,77,.35); border-radius:12px}
      .glow-border{box-shadow: inset 0 0 16px rgba(56,189,248,.15), 0 0 20px rgba(16,185,129,.1)}


      /* VEDHAS */
      .screen-head{display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:12px}
      .head-right{display:flex; gap:10px; align-items:center}
      .scrolls{display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px}
      .scroll-card{background: repeating-linear-gradient(180deg, rgba(212,167,77,.08), rgba(212,167,77,.08) 8px, rgba(0,0,0,0) 9px); border:1px solid rgba(212,167,77,.25); border-radius: 18px; padding:12px; min-height:140px; position:relative}
      .scroll-card h3{margin:0 0 6px; color:var(--gold)}
      .scroll-card .ghost{position:absolute; right:10px; bottom:10px; background:transparent; border:1px dashed rgba(212,167,77,.35); color:var(--silver); padding:8px 10px; border-radius:8px; cursor:pointer}


      /* QUESTS */
      .quest-grid{display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:12px}
      .quest-card{background:var(--bg-card); border:1px solid rgba(212,167,77,.25); border-radius:var(--radius); padding:12px; position:relative; overflow:hidden}
      .quest-card.done{opacity:.7}
      .quest-top{display:flex; justify-content:space-between; align-items:center; color:var(--muted)}
      .q-title{margin:8px 0}
      .q-rewards{display:flex; gap:10px; color:var(--silver)}
      .q-actions{display:flex; gap:8px; margin-top:8px}
      .primary{background:linear-gradient(90deg, var(--gold), var(--sky)); color:#0b0705; border:none; padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:800}
      .hint{background:transparent; border:1px solid rgba(56,189,248,.5); color:#bfe5fb; padding:8px 12px; border-radius:10px; cursor:pointer}
      .done-badge{position:absolute; right:-32px; top:10px; transform: rotate(30deg); background:#16a34a; color:white; padding:4px 40px}


      /* CHALLENGE */
      .challenge .challenge-head{display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:10px}
      .q-meta{color:var(--muted)}
      .timer-box{display:inline-block; padding:6px 10px; border-radius:999px; background:rgba(56,189,248,.12); border:1px solid rgba(56,189,248,.35)}
      .prompt{background:var(--bg-soft); border:1px solid rgba(212,167,77,.2); border-radius:12px; padding:12px;}
      .challenge-actions{display:flex; gap:8px; margin-top:12px}


      /* REWARDS */
      .inv{display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:12px}
      .inv-card{background:var(--bg-card); border:1px solid rgba(212,167,77,.25); border-radius:var(--radius); padding:12px}
      .avatar-wrap{text-align:center}
      .badge{display:inline-flex; align-items:center; justify-content:center; padding:6px 10px; border-radius:999px; margin:4px; background:linear-gradient(180deg, rgba(212,167,77,.18), rgba(212,167,77,.05)); border:1px solid rgba(212,167,77,.35)}
      .artifacts{display:grid; gap:8px}
      .artifact{display:flex; justify-content:space-between; gap:8px; padding:8px; border:1px solid rgba(212,167,77,.2); border-radius:10px}


      /* MENTOR */
      .notes{display:grid; gap:10px}
      .note{background:linear-gradient(180deg, rgba(56,189,248,.06), rgba(16,185,129,.05)); border:1px solid rgba(212,167,77,.25); border-radius:14px; padding:10px}
      .note h4{margin:0 0 4px; color:var(--gold)}
      .note-time{color:var(--muted); font-size:12px}


      /* PROGRESS */
      .md-progress{position:relative; height:14px; width:200px; background:rgba(212,167,77,.15); border:1px solid rgba(212,167,77,.35); border-radius:999px; overflow:hidden}
      .md-progress-fill{position:absolute; left:0; top:0; bottom:0; width:0; background:linear-gradient(90deg, var(--jade), var(--sky)); box-shadow:0 0 12px rgba(56,189,248,.35); transition: width .35s ease}
      .md-progress-text{position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:12px; color:#082f2a}


      /* AVATAR BADGE */
      .avatar-badge{display:flex; gap:10px; align-items:center; padding:8px; border:2px solid var(--gold); border-radius:14px; background:linear-gradient(180deg, rgba(245,158,11,.1), rgba(56,189,248,.08)); box-shadow: var(--shadow)}
      .avatar-badge.small{transform: scale(.9)}
      .avatar-icon{width:56px; height:56px; border-radius:12px; display:grid; place-items:center; overflow:hidden; box-shadow: inset 0 0 18px rgba(0,0,0,.35)}
      .avatar-meta{display:flex; flex-direction:column;}
      .avatar-meta strong{letter-spacing:.3px; color:#FFFFFF}
      .avatar-meta span{color:#FFFFFF}
      .avatar-img{width:100%;height:100%;display:block;object-fit:cover;object-position:center;border-radius:12px}


      /* Buttons */
      .ghost{background:transparent;border:1px solid rgba(212,167,77,.35);color:var(--silver);padding:8px 12px;border-radius:10px;cursor:pointer}


      /* Modal */
      .modal{position:fixed; inset:0; background:rgba(0,0,0,.6); display:grid; place-items:center; z-index:40}
      .modal-content{background:var(--bg-card); border:1px solid rgba(212,167,77,.35); border-radius:16px; padding:16px; width:min(520px, 92vw); box-shadow: var(--shadow)}


      /* Helpers */
      .screen{position:relative}
      .center{display:grid; place-items:center; min-height:40vh}
      .muted{color:var(--muted)}


      /* Mobile Tweaks */
      @media (max-width: 560px){
        .landing .hero{grid-template-columns: 1fr; text-align:center}
        .md-progress{width:160px}
        .topbar .stats{display:none}
      }

      /* NEW: Light theme overrides via data-theme */
      /* Grey light theme */
/* Grey light theme */
.md-root[data-theme="light"]{
  /* Greys instead of pure whites */
  --bg:#f0f2f5;        /* app surfaces (soft grey) */
  --bg-card:#f7f8fa;   /* cards (near-grey) */
  --bg-soft:#eceff3;   /* panels (slightly darker grey) */

  /* Brand accents unchanged */
  --gold:#b88a32;
  --ember:#be6a1a;
  --ruby:#b91c1c;
  --jade:#0f766e;
  --sky:#0ea5e9;

  /* Text and secondary (ALL BLACK NOW) */
  --silver:#000000;    /* menus/links/pills now black */
  --text:#000000;      /* primary text now black */
  --muted:#000000;     /* muted text also black */

  /* Grey radial bg */
  --app-bg: radial-gradient(
    1200px 600px at 10% 0%,
    #95918c 0%,
    #95918c 45%,
    #95918c 100%
  );
}
  /* Light-mode header background override */
.md-root[data-theme="light"] .topbar{
  background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.55)); /* example light gradient */
  border-bottom: 1px solid rgba(0,0,0,.08);
}


/* Default text color fallback in light theme */
.md-root[data-theme="light"]{
  color:#000000;
}

/* Keep domain tiles and Monk bubble identical in both themes */
.md-root[data-theme="light"] .domain-card{
  background:#ffffff;
  border-color:rgba(249, 248, 246, 0.2);
  color:#000000; /* uses the new all-black text */
}
.md-root[data-theme="light"] .bubble{
  background:linear-gradient(180deg, rgba(56,189,248,.08), rgba(16,185,129,.06));
  border-color:rgba(212,167,77,.35);
}

/* Ensure theme-aware text */
.domain-name{font-weight:700; color:var(--text);}
.avatar-meta strong{letter-spacing:.3px; color:var(--text);}
.avatar-meta span{color:var(--text);}


/* Keep domain tiles and Monk bubble identical in both themes */
      .md-root[data-theme="light"] .domain-card{
        background:#1b120e;
        border-color:rgba(249,248,246,0.2);
        color:var(--text);
      }
      .md-root[data-theme="light"] .bubble{
        background:linear-gradient(180deg, rgba(56,189,248,.08), rgba(16,185,129,.06));
        border-color:rgba(212,167,77,.35);
      }

/* Ensure theme-aware text */
.domain-name{font-weight:700; color:var(--text);}
.avatar-meta strong{letter-spacing:.3px; color:var(--text);}
.avatar-meta span{color:var(--text);}


      .md-root[data-theme="light"] .nav-btn,
      .md-root[data-theme="light"] .ghost,
      .md-root[data-theme="light"] .hint{
        color:var(--text); border-color: rgba(184,138,50,.35);
      }
      .md-root[data-theme="light"] .quest-card,
      .md-root[data-theme="light"] .inv-card,
      .md-root[data-theme="light"] .scroll-card,
      .md-root[data-theme="light"] .note{
        border-color: rgba(184,138,50,.25); background: #ffffffd9;
      }
        /* Keep domain cards dark even in light theme (pic 2) */
        .md-root[data-theme="light"] .domain-card{
        background: #ffffff;                       /* same as dark --bg-card */
        border-color: rgba(249, 248, 246, 0.2);     /* same as original */
        color: var(--text);                         /* text still respects theme */
      }

      /* Keep Monk bubble identical across themes (pic 3) */
      .md-root[data-theme="light"] .bubble{
        background: linear-gradient(180deg, rgba(56,189,248,.08), rgba(16,185,129,.06));
        border-color: rgba(212,167,77,.35);
      }

.app-content {
  transition: filter 0.3s ease;
}

.blurred {
  filter: blur(5px);
  pointer-events: none; /* Optional: to block interaction with blurred background */
  user-select: none;    /* Optional: prevent text selection on blurred background */
}

/* Ensure your LoginModal container has high z-index and centered fixed positioning */
.login-modal {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.login-modal.show {
  opacity: 1;
  pointer-events: auto;
}
.modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-loading-text {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}
.modal-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: white;
  color: black;
  box-sizing: border-box;
  outline: none;
  transition: border 0.2s;
}

.modal-input:focus {
  border-color: #3ea1ff;
  box-shadow: 0 0 5px #3ea1ff;
  background: white;
}

.modal-button {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #3ea1ff;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s;
}

.modal-button:disabled {
  background: #99cdfa;
  cursor: not-allowed;
}

.modal-button:hover:not(:disabled) {
  background: #2080ff;
}

.signup-message {
  margin-top: 10px;
  font-size: 1.1rem;
  text-align: center;
}
/* Desktop view - wide screens */
@media (min-width: 1200px) {
  .nav {
    display: flex !important; /* show nav buttons */
    gap: 12px;
    align-items: center;
  }
  .hamburger {
    display: none !important; /* hide hamburger menu */
  }
}

/* Mobile / small window view */
@media (max-width: 899px) {
  .nav {
    display: none !important; /* hide nav buttons */
  }
  .hamburger {
    display: block !important; /* show hamburger menu */
  }
}

/* Desktop: show nav, hide hamburger */
@media (min-width: 900px) {
  .nav { display: flex !important; }
  .hamburger { display: none !important; }
}

/* Mobile/tablet: hide nav, show hamburger */
@media (max-width: 899px) {
  .nav { display: none !important; }
  .hamburger { display: block !important; }
}


    `}</style>
  );
}