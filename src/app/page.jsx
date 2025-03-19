// src/app/page.jsx
"use client";
import React, { useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { motion } from "framer-motion";
import ToolCard from "../components/ToolCard";
import tools from "../data/tools.json";

// Home page component
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fuzzy search
  const fuse = new Fuse(tools, {
    keys: ["title", "description", "tags"],
    threshold: 0.4,
  });

  // Filter tools based on search query
  const results = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : tools;

  // Handle tag click to search
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold">Welcome to UtiliVerse</h1>
            <p className="py-6">
              UtiliVerse is your one-stop website that brings together a variety
              of easy-to-use tools for everyday tasks.
            </p>
            <Link href="#tools" className="btn btn-primary group">
              Explore Tools
              <motion.svg
                className="h-5 w-5 ml-2 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools" className="container mx-auto my-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for a tool..."
          className="input input-bordered w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {results.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onTagClick={handleTagClick} />
        ))}
      </div>

      {/* More tools message */}
      <div className="container mx-auto my-8 flex justify-center">
        <p className="text-center text-lg text-gray-500">
          More tools will be added soon. Stay tuned!
        </p>
      </div>
    </>
  );
}
