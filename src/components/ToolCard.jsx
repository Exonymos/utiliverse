// src/components/ToolCard.jsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Tool Card component
export default function ToolCard({ tool, onTagClick }) {
  return (
    <div className="card card-compact bg-base-100 shadow-xl border border-gray-200 rounded-lg">
      <div className="card-body">
        <h2 className="card-title">{tool.title}</h2>
        <p className="mb-2">{tool.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags?.slice(0, 5).map((tag, idx) => (
            <span
              key={idx}
              className="badge badge-outline badge-md cursor-pointer"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="card-actions justify-end">
          {/* View button */}
          <Link href={`/tools/${tool.id}`} className="btn btn-primary group">
            View
            <motion.svg
              whileHover={{ x: 5 }}
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
  );
}
