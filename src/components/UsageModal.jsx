// src/components/UsageModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Usage modal component
export default function UsageModal({ onClose, instructions }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal modal-open"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="modal-box max-w-3xl mx-auto shadow-lg">
          <button
            onClick={onClose}
            className="btn btn-sm absolute right-5 top-5"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4 text-center">
            Usage Instructions
          </h3>
          <div className="py-4 prose">{instructions}</div>
          <div className="modal-action justify-center">
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
