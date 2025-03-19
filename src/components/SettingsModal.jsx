// src/components/SettingsModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Settings modal component
export default function SettingsModal({ onClose }) {
  // List of available themes
  const lightThemes = [
    { value: "cupcake", label: "Cupcake" },
    { value: "bumblebee", label: "Bumblebee" },
    { value: "emerald", label: "Emerald" },
    { value: "corporate", label: "Corporate" },
    { value: "retro", label: "Retro" },
    { value: "pastel", label: "Pastel" },
    { value: "nord", label: "Nord" },
  ];
  const darkThemes = [
    { value: "halloween", label: "Halloween" },
    { value: "black", label: "Black" },
    { value: "dracula", label: "Dracula" },
    { value: "business", label: "Business" },
    { value: "night", label: "Night" },
    { value: "dim", label: "Dim" },
    { value: "sunset", label: "Sunset" },
  ];

  // State hooks for managing selected theme and feedback
  const [selectedTheme, setSelectedTheme] = useState("cupcake");
  const [feedback, setFeedback] = useState("");

  // Load saved theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") || "cupcake";
      setSelectedTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  // Handle theme change
  const handleChange = (e) => {
    const newTheme = e.target.value;
    setSelectedTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setFeedback("Theme updated!");
    setTimeout(() => setFeedback(""), 1500);
  };

  // Clear all tool cache
  const clearCache = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("tool_")) localStorage.removeItem(key);
    });
    setFeedback("Cache cleared!");
    setTimeout(() => setFeedback(""), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal modal-open"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="modal-box max-w-2xl mx-auto shadow-lg">
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-sm absolute right-5 top-5"
          >
            ✕
          </button>
          <h3 className="font-extrabold text-lg mb-4 text-center">
            Customize Website Theme
          </h3>
          {/* Theme selection dropdown */}
          <div className="form-control mb-5">
            <label className="label">
              <span className="label-text">Select a theme: </span>
            </label>
            <select
              value={selectedTheme}
              onChange={handleChange}
              className="select select-bordered"
            >
              <optgroup label="🌞 Light Themes">
                {lightThemes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌙 Dark Themes">
                {darkThemes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {/* Buttons for clearing cache and closing modal */}
          <div className="flex gap-4 mb-4 justify-between">
            <button onClick={clearCache} className="btn btn-secondary">
              Clear All Tool Cache
            </button>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
          {/* Feedback message */}
          {feedback && <div className="alert alert-info">{feedback}</div>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
