import React, { useState, useEffect } from "react";
import SignupForm from "./SignupForm.jsx";

export default function LoginModal({ visible, onClose, onLoginSuccess }) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [loginMessage, setLoginMessage] = useState("");
  
  useEffect(() => {
    let timeout;
    if (visible) {
      setShow(true);
      setLoginMessage("");
      setLoginData({ identifier: "", password: "" });
    } else {
      timeout = setTimeout(() => setShow(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [visible]);

  if (!show) return null;

  function handleLoginInputChange(e) {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setLoginMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: loginData.identifier,
    password: loginData.password,
  }),
  credentials: "include",  // Needed for cross-origin cookies
});

      const data = await res.json();

      if (res.ok && data.username) {
        setLoginMessage("Login successful");
        onLoginSuccess(data.username, data.userId)

      } else if (res.status === 401) {
        setLoginMessage("Incorrect username/password, try again");
      } else {
        setLoginMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      setLoginMessage("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  function setLoadingHandler(isLoading) {
    setLoading(isLoading);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 20,
        boxSizing: "border-box",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
        transition: "opacity 300ms ease, transform 300ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          width: "480px",
          minHeight: "400px",
          padding: "32px",
          background: "#1a1b24",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          borderRadius: "18px",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
            gap: 20,
            width: "260px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <button
            style={{
              width: "400px",
              background: mode === "login" ? "#3ea1ff" : "transparent",
              color: mode === "login" ? "white" : "#bbb",
              padding: "8px 0",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              textAlign: "center",
            }}
            onClick={() => setMode("login")}
            disabled={loading}
          >
            Login
          </button>
          <button
            style={{
              width: "400px",
              background: mode === "signup" ? "#3ea1ff" : "transparent",
              color: mode === "signup" ? "white" : "#bbb",
              padding: "8px 0",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              textAlign: "center",
            }}
            onClick={() => setMode("signup")}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ position: "relative" }}>
            {loginMessage && (
              <p
                style={{
                  color:
                    loginMessage === "Login successful" ? "#34d399" : "#fd413a",
                  textAlign: "center",
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                {loginMessage}
              </p>
            )}
            <input
              type="text"
              name="identifier"
              placeholder="UserID / Email"
              className="modal-input"
              value={loginData.identifier}
              onChange={handleLoginInputChange}
              required
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="modal-input"
              value={loginData.password}
              onChange={handleLoginInputChange}
              required
              disabled={loading}
            />
            <button type="submit" className="modal-button" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
        )}
        {mode === "signup" && <SignupForm setLoading={setLoadingHandler} />}
        <button
          style={{
            marginTop: 20,
            background: "none",
            color: "#bbb",
            border: "none",
            width: "100%",
            fontWeight: "400",
            fontSize: "1rem",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={onClose}
          disabled={loading}
        >
          Close
        </button>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "18px",
              zIndex: 1000,
              color: "white",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Processing...
          </div>
        )}
      </div>
    </div>
  );
}
