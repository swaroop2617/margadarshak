import React, { useState } from "react";

// StatPill component for gems and level display
function StatPill({ icon, label, value }) {
  return (
    <div
      className="pill"
      style={{
        display: "inline-flex",
        gap: 6,
        alignItems: "center",
        background: "var(--bg-soft, #222)",
        border: "1px solid rgba(212,167,77,.25)",
        borderRadius: 999,
        padding: "6px 10px",
        fontWeight: 600,
        color: "#fff",
        fontSize: "1rem",
      }}
    >
      <span className="pill-icn">{icon}</span>
      <span>{label}:</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function HeaderBar({
  setShowSettings,
  setTheme,
  theme,
  resetAll,
  setView,
  loggedInUser,
  setShowLoginModal,
  gems,
  level,
  fmt,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // MOBILE MENU: collapsible, contains all nav, settings, login/logout, theme toggle
  const renderMobileMenu = () => (
    <div
      className="mobile-menu"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(26, 24, 22, 0.95)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        padding: "36px 18px 18px 18px",
        boxSizing: "border-box",
      }}
    >
      <button
        className="close-btn"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close Menu"
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          fontSize: 28,
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          zIndex: 2010,
        }}
      >
        ✕
      </button>
      <button
        className="nav-btn"
        onClick={() => {
          setMobileMenuOpen(false);
          setView("vedhas");
        }}
      >
        Vedhas
      </button>
      <button
        className="nav-btn"
        onClick={() => {
          setMobileMenuOpen(false);
          setView("quests");
        }}
      >
        Quest Arena
      </button>
      <button
        className="nav-btn"
        onClick={() => {
          setMobileMenuOpen(false);
          setView("rewards");
        }}
      >
        Rewards & Inventory
      </button>
      <button
        className="nav-btn"
        onClick={() => {
          setMobileMenuOpen(false);
          setView("mentor");
        }}
      >
        Mentor Chamber
      </button>
      <button
        className="nav-btn"
        onClick={() => {
          setMobileMenuOpen(false);
          setView("roadmap");
        }}
      >
        Road Map
      </button>
      <hr style={{ margin: "8px 0", borderColor: "#333", opacity: 0.3 }} />
      <button
        className="settings-btn"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
          setMobileMenuOpen(false);
        }}
        style={{
          margin: "10px 0",
          background: "none",
          border: "none",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <button
        className="settings-btn"
        onClick={() => {
          resetAll();
          setMobileMenuOpen(false);
        }}
        style={{
          background: "#8b1c1c",
          color: "#fff",
          fontWeight: 600,
          margin: "10px 0",
          border: "none",
          borderRadius: 8,
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Reset Journey
      </button>
      {loggedInUser ? (
        <>
          <span
            className="mobile-welcome"
            style={{ fontWeight: "bold", marginBottom: 8 }}
          >
            Welcome, {loggedInUser}
          </span>
          <button
            onClick={() => {
              setShowLoginModal(true);
              setMobileMenuOpen(false);
            }}
            className="settings-btn"
            style={{
              color: "#fff",
              border: "none",
              background: "#444",
              fontWeight: 600,
              padding: "10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className="login-btn"
          onClick={() => {
            setShowLoginModal(true);
            setMobileMenuOpen(false);
          }}
        >
          Login / Sign Up
        </button>
      )}
      <div
        className="mobile-stats"
        style={{
          display: "flex",
          gap: 12,
          marginTop: 18,
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <StatPill icon="💎" label="Gems" value={fmt(gems)} />
        <StatPill icon="⭐" label="Level" value={fmt(level)} />
      </div>
    </div>
  );

  return (
    <header className="topbar" style={{ position: "relative" }}>
      {/* MOBILE HEADER (show on small screens only) */}
      <div className="mobile-header">
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Menu"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            background: "none",
            border: "none",
            color: "var(--gold, #d4a74d)",
            cursor: "pointer",
            padding: "6px 12px",
            zIndex: 1001,
          }}
        >
          ☰
        </button>
        <div
          className="brand"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.4rem",
            userSelect: "none",
            gap: "8px",
          }}
        >
          <span className="brand-logo" aria-hidden="true">
            卍
          </span>
          <span className="brand-text">MargaDarshak</span>
        </div>
      </div>

      {/* Render mobile sliding menu when open */}
      {mobileMenuOpen && renderMobileMenu()}

      {/* DESKTOP HEADER (show on wider screens only) */}
      <div
        className="desktop-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            className="brand"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "bold",
              fontSize: "26px",
              cursor: "pointer",
            }}
            onClick={() => setView("landing")}
          >
            <span className="brand-logo" aria-hidden="true">
              卍
            </span>
            <span className="brand-text">MargaDarshak</span>
          </div>
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Open Settings"
            style={{
              background: "#221610",
              border: "1px solid #cbd5e1",
              color: "#d4a74d",
              borderRadius: "8px",
              fontSize: 18,
              marginLeft: 10,
              cursor: "pointer",
              width: 45,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⚙️
          </button>
        </div>
        <nav
          className="nav"
          style={{ display: "flex", gap: 18, alignItems: "center" }}
        >
          <button className="nav-btn" onClick={() => setView("vedhas")}>
            Vedhas
          </button>
          <button className="nav-btn" onClick={() => setView("quests")}>
            Quest Arena
          </button>
          <button className="nav-btn" onClick={() => setView("rewards")}>
            Rewards & Inventory
          </button>
          <button className="nav-btn" onClick={() => setView("mentor")}>
            Mentor Chamber
          </button>
          <button className="nav-btn" onClick={() => setView("Road Map")}>
            Road Map
          </button>
          {loggedInUser && (
            <span
              style={{
                marginLeft: 14,
                padding: "8px 20px",
                borderRadius: 8,
                background: "rgba(86, 78, 10, 0.25)",
                color: "white",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              Welcome, {loggedInUser}
            </span>
          )}
        </nav>
        <div className="stats" style={{ display: "flex", gap: 16 }}>
          <StatPill icon="💎" label="Gems" value={fmt(gems)} />
          <StatPill icon="⭐" label="Level" value={fmt(level)} />
        </div>
      </div>
    </header>
  );
}
