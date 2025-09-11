import React, { useState } from "react";

function SignupForm({ setLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setLoading && setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
      } else {
        setMessage("Signup successful!");
      }
    } catch (err) {
      setMessage("Network error or server unavailable.");
    } finally {
      setIsLoading(false);
      setLoading && setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <input
        className="modal-input"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
      />
      <input
        className="modal-input"
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        value={formData.email}
      />
      <input
        className="modal-input"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        value={formData.username}
      />
      <input
        className="modal-input"
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        value={formData.password}
      />
      <input
        className="modal-input"
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        onChange={handleChange}
        value={formData.confirmPassword}
      />
      <button type="submit" className="modal-button" disabled={isLoading}>
        {isLoading ? "Processing..." : "Sign Up"}
      </button>

      {message && (
        <p
          className="signup-message"
          style={{
            color: message.toLowerCase().includes("success") ? "#22e13b" : "#fd413a",
            marginTop: '8px',
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default SignupForm;
