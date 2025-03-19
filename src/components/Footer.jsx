// src/components/Footer.jsx
import React from "react";

// Footer component
export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <div className="max-w-6xl mx-auto px-4 text-center transition-all duration-300">
        <aside>
          <p>
            Made with ❤ by{" "}
            <a
              href="https://github.com/Exonymos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Exonymos
            </a>
          </p>
          <p>Licensed under GNU GPLv3</p>
        </aside>
      </div>
    </footer>
  );
}
