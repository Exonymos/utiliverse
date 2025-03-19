// src/components/ToolPageLayout.jsx
"use client";
import React from "react";
import ToolInfo from "./ToolInfo";
import UsageModal from "./UsageModal";

/**
 * ToolPageLayout component
 *
 * Props:
 * - tool: information about the tool
 * - isUsageModalOpen: boolean to determine if the usage modal is open
 * - openUsageModal: function to open the usage modal
 * - closeUsageModal: function to close the usage modal
 * - usageInstructions: instructions on how to use the tool
 * - children: unique tool specific content
 */
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
          {/* Tool Information and how to use button */}
          <ToolInfo tool={tool} onHowToUse={openUsageModal} />
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="card-body text-center">{children}</div>
          </div>
        </div>
      </div>
      {/* Conditional rendering of the UsageModal */}
      {isUsageModalOpen && (
        <UsageModal
          onClose={closeUsageModal}
          instructions={usageInstructions}
        />
      )}
    </div>
  );
}
