// src/app/layout.jsx
import "../app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <title>UtiliVerse</title>
        <meta
          name="description"
          content="UtiliVerse is your one-stop website that brings together a variety of easy-to-use tools for everyday tasks."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-base-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
