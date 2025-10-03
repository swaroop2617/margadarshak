import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Roadmap.css";

const dsaSubtopics = [
  { name: "Arrays", link: "/roadmap/dsa/arrays" },
  { name: "Linked Lists", link: "/roadmap/dsa/linkedlists" },
  { name: "Stacks & Queues", link: "/roadmap/dsa/stacks-queues" },
  { name: "Trees", link: "/roadmap/dsa/trees" },
  { name: "Graphs", link: "/roadmap/dsa/graphs" },
  { name: "Hashing", link: "/roadmap/dsa/hashing" },
  { name: "Sorting", link: "/roadmap/dsa/sorting" },
  { name: "Searching", link: "/roadmap/dsa/searching" }
];

function Roadmap() {
  const navigate = useNavigate();
  const [expandDSA, setExpandDSA] = useState(false);

  return (
    <div className="roadmap-container">
      <h1 className="roadmap-title">Learning Roadmap</h1>
      <div className="main-topic-area">
        <button
          className={`main-topic-btn ${expandDSA ? "expanded" : ""}`}
          onClick={() => setExpandDSA((prev) => !prev)}
        >
          <span className="main-btn-text">DSA</span>
        </button>
        <div
          className={`subtopic-group ${expandDSA ? "show-animate" : ""}`}
        >
          {dsaSubtopics.map((sub, idx) => (
            <button
              key={sub.name}
              className={`subtopic-btn subtopic-${idx}`}
              onClick={() => navigate(sub.link)}
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Roadmap;
