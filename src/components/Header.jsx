// src/components/Header.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSun, FiMoon, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";
import SettingsModal from "./SettingsModal";

// Header component
export default function Header() {
  // State hooks for managing theme, modal, and animations
  const [theme, setTheme] = useState("cupcake");
  const [modalOpen, setModalOpen] = useState(false);
  const [rotateToggle, setRotateToggle] = useState(false);
  const [spinSettings, setSpinSettings] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "cupcake";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Function to toggle between themes
  const toggleTheme = () => {
    setRotateToggle(true);
    setTimeout(() => setRotateToggle(false), 300);
    const newTheme = theme === "cupcake" ? "dracula" : "cupcake";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Function to open settings modal
  const openSettings = () => {
    setSpinSettings(true);
    setTimeout(() => setSpinSettings(false), 500);
    setModalOpen(true);
  };

  return (
    <>
      {/* Navbar with theme toggle and settings button */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            UtiliVerse
          </Link>
        </div>
        <div className="flex-none space-x-2">
          {/* Theme toggle and settings button */}
          <motion.button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            animate={{ rotate: rotateToggle ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "cupcake" ? <FiSun size={24} /> : <FiMoon size={24} />}
          </motion.button>
          <motion.button
            onClick={openSettings}
            className="btn btn-ghost btn-circle"
            animate={spinSettings ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiSettings size={24} />
          </motion.button>
        </div>
      </div>
      {/* Settings modal */}
      {modalOpen && <SettingsModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
