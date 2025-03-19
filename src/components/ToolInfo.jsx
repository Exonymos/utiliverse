// src/components/ToolInfo.jsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Tool Info component
const ToolInfo = ({ tool, onHowToUse }) => {
  return (
    <div className="card bg-base-100 shadow-xl p-6 mb-6">
      <div className="card-body items-center text-center">
        <h1 className="card-title text-3xl mb-2 font-extrabold">
          {tool.title}
        </h1>
        <p className="mb-4">{tool.description}</p>
        <div className="flex justify-center gap-2">
          {tool.tags?.map((tag, idx) => (
            <span key={idx} className="badge badge-secondary">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {/* Usage and source buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="btn btn-secondary"
            onClick={onHowToUse}
          >
            How to Use
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="btn btn-accent"
          >
            <Link href={tool.source} target="_blank" rel="noopener noreferrer">
              View Source
            </Link>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ToolInfo;
