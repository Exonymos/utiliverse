// src/app/tools/qr-code-generator/page.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { FiCopy, FiShare2, FiCheck, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useLocalStorage from "../../../hooks/useLocalStorage";
import toolsData from "../../../data/tools.json";
import ToolPageLayout from "../../../components/ToolPageLayout";

export default function QRCodeGeneratorPage() {
  const [inputText, setInputText] = useLocalStorage("tool_qrcode_input", "");
  const [qrValue, setQRValue] = useState("");
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(128);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const qrRef = useRef(null);
  const tool = toolsData.find((t) => t.id === "qr-code-generator");

  useEffect(() => {
    if (autoGenerate) {
      const handler = setTimeout(() => {
        setQRValue(inputText);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [inputText, autoGenerate]);

  const generateQRCode = () => {
    setQRValue(inputText);
  };

  const resetFields = () => {
    setInputText("");
    setQRValue("");
    setQrColor("#000000");
    setQrBgColor("#ffffff");
    setQrSize(128);
  };

  const copyInputText = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      showToast("Input text copied!");
    } catch (error) {
      showToast("Copy text failed.");
    }
  };

  const downloadQRCodeSVG = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const blob = new Blob([svgStr], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qr-code.svg";
        link.click();
        URL.revokeObjectURL(url);
        showToast("SVG downloaded!");
      }
    }
  };

  const exportQRCodeAsPNG = async () => {
    if (!qrRef.current) return null;
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const svg = qrRef.current.querySelector("svg");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      await new Promise((resolve) => (img.onload = resolve));
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;
      context.drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    } catch (error) {
      return null;
    }
  };

  const downloadQRCode = async () => {
    const dataUrl = await exportQRCodeAsPNG();
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("PNG downloaded!");
    }
  };

  const copyQRCode = async () => {
    if (!navigator.clipboard || !navigator.clipboard.write) {
      showToast("Image copy not supported on this device.");
      return;
    }
    const dataUrl = await exportQRCodeAsPNG();
    if (dataUrl) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast("Image copied!");
      } catch (err) {
        showToast("Copy failed.");
      }
    }
  };

  const shareQRCode = async () => {
    const dataUrl = await exportQRCodeAsPNG();
    if (dataUrl) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "qr-code.png", { type: "image/png" });
        if (!(navigator.canShare && navigator.canShare({ files: [file] }))) {
          showToast("Sharing not supported on this device.");
          return;
        }
        await navigator.share({
          files: [file],
          title: "QR Code",
          text: "Here is your QR code.",
        });
        showToast("Shared!");
      } catch (error) {
        showToast("Share failed.");
      }
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 1500);
  };

  const usageInstructions = (
    <div>
      <p>To generate a QR code:</p>
      <ul className="list-disc ml-5">
        <li>Enter text or URL in the input field.</li>
        <li>Customize the QR code colors and size using the controls below.</li>
        <li>
          Use the Generate button to create the QR code or enable
          auto-generation.
        </li>
        <li>
          Use the Download dropdown to save the QR code as PNG or SVG. You can
          also copy the QR code image or share it directly.
        </li>
      </ul>
      <p>
        This tool uses <code>react-qr-code</code> and other helper methods for
        image export.
      </p>
    </div>
  );

  return (
    <ToolPageLayout
      tool={tool}
      isUsageModalOpen={isUsageModalOpen}
      openUsageModal={() => setIsUsageModalOpen(true)}
      closeUsageModal={() => setIsUsageModalOpen(false)}
      usageInstructions={usageInstructions}
    >
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Enter text or URL:</span>
        </label>
        <input
          type="text"
          placeholder="Enter text or URL..."
          className="input input-bordered w-full max-w-xs"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
        <label className="cursor-pointer label">
          <span className="label-text">Auto Generate</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
          />
        </label>
        <button onClick={copyInputText} className="btn btn-outline">
          Copy Input
        </button>
        <button onClick={resetFields} className="btn btn-outline">
          Reset
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Foreground Color:</span>
          </label>
          <input
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Background Color:</span>
          </label>
          <input
            type="color"
            value={qrBgColor}
            onChange={(e) => setQrBgColor(e.target.value)}
            className="input input-bordered"
          />
        </div>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">QR Code Size: {qrSize}px</span>
        </label>
        <input
          type="range"
          min="64"
          max="256"
          value={qrSize}
          onChange={(e) => setQrSize(Number(e.target.value))}
          className="range range-primary"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="btn btn-primary mb-4"
        onClick={generateQRCode}
      >
        Generate <FiCheck className="ml-2" />
      </motion.button>
      {qrValue && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div
            ref={qrRef}
            id="qr-code-svg"
            className="bg-white p-4 rounded shadow-lg"
          >
            <QRCode
              value={qrValue}
              size={qrSize}
              fgColor={qrColor}
              bgColor={qrBgColor}
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="dropdown">
              <motion.button whileHover={{ x: 5 }} className="w-full">
                <label tabIndex={0} className="btn btn-primary w-full">
                  Download <FiChevronDown />
                </label>
              </motion.button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full"
              >
                <li>
                  <button onClick={downloadQRCode}>Download PNG</button>
                </li>
                <li>
                  <button onClick={downloadQRCodeSVG}>Download SVG</button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <motion.button
                whileHover={{ x: 5 }}
                className="btn btn-secondary w-full md:flex-1 h-10"
                onClick={copyQRCode}
              >
                Copy Image <FiCopy />
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                className="btn btn-accent w-full md:flex-1 h-10"
                onClick={shareQRCode}
              >
                Share <FiShare2 />
              </motion.button>
            </div>
          </div>
        </div>
      )}
      {toastMsg && (
        <div className="toast toast-center">
          <div className="alert alert-info">{toastMsg}</div>
        </div>
      )}
    </ToolPageLayout>
  );
}
