// src/components/ToolPageLayout.jsx
"use client";
import React from "react";
import ToolInfo from "./ToolInfo";
import UsageModal from "./UsageModal";

export default function ToolPageLayout({
  tool,
  isUsageModalOpen,
  openUsageModal,
  closeUsageModal,
  usageInstructions,
  children,
}) {
  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ToolInfo tool={tool} onHowToUse={openUsageModal} />
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="card-body text-center">{children}</div>
          </div>
        </div>
      </div>
      {isUsageModalOpen && (
        <UsageModal
          onClose={closeUsageModal}
          instructions={usageInstructions}
        />
      )}
    </div>
  );
}
