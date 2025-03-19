// src/app/tools/bmi-calculator/page.jsx
"use client";
import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import ToolInfo from "../../../components/ToolInfo";
import UsageModal from "../../../components/UsageModal";
import toolsData from "../../../data/tools.json";
import useLocalStorage from "../../../hooks/useLocalStorage";

export default function BMICalculatorPage() {
  // Use localStorage hook to persist input values
  const [unit, setUnit] = useLocalStorage("tool_bmi_unit", "metric");
  const [weight, setWeight] = useLocalStorage("tool_bmi_weight", "");
  const [height, setHeight] = useLocalStorage("tool_bmi_height", "");
  const [bmi, setBmi] = useState(null);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const tool = toolsData.find((t) => t.id === "bmi-calculator");

  // Function to calculate BMI based on the selected unit
  const calculateBMI = () => {
    if (!weight || !height) return;
    let bmiVal = 0;
    if (unit === "metric") {
      const heightMeters = height / 100;
      bmiVal = weight / (heightMeters * heightMeters);
    } else {
      bmiVal = (703 * weight) / (height * height);
    }
    setBmi(bmiVal.toFixed(2));
  };

  // Function to reset all input fields and results
  const resetFields = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
  };

  // Function to get BMI category based on BMI value
  const getBMICategory = (bmiVal) => {
    const bmiNum = parseFloat(bmiVal);
    if (bmiNum < 18.5) return "Underweight";
    if (bmiNum < 25) return "Normal weight";
    if (bmiNum < 30) return "Overweight";
    return "Obese";
  };

  // Usage instructions for the tool
  const usageInstructions = (
    <div>
      <p>To calculate your BMI:</p>
      <ul className="list-disc ml-5">
        <li>Select your preferred unit (Metric or Imperial).</li>
        <li>Enter your weight and height.</li>
        <li>
          Click "Calculate BMI" to view your Body Mass Index and your health
          category.
        </li>
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ToolInfo tool={tool} onHowToUse={() => setUsageModalOpen(true)} />
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="card-body text-center">
              {/* Unit toggle */}
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setUnit("metric")}
                  className={`btn ${
                    unit === "metric" ? "btn-primary" : "btn-outline"
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => setUnit("imperial")}
                  className={`btn ${
                    unit === "imperial" ? "btn-primary" : "btn-outline"
                  }`}
                >
                  Imperial
                </button>
              </div>
              {/* Weight input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                  </span>
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input input-bordered"
                  placeholder="Enter weight"
                />
              </div>
              {/* Height input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Height {unit === "metric" ? "(cm)" : "(inches)"}
                  </span>
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="input input-bordered"
                  placeholder="Enter height"
                />
              </div>
              {/* Calculate BMI button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="btn btn-primary mb-4"
                onClick={calculateBMI}
              >
                Calculate BMI <FiCheck className="ml-2" />
              </motion.button>
              {/* Display BMI result */}
              {bmi && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">Your BMI: {bmi}</h2>
                  <p className="text-sm text-gray-500">
                    Category: {getBMICategory(bmi)}
                  </p>
                </div>
              )}
              {/* Reset button */}
              <div className="flex justify-center mt-4">
                <button
                  className="btn btn-outline w-full"
                  onClick={resetFields}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Usage Modal */}
      {usageModalOpen && (
        <UsageModal
          onClose={() => setUsageModalOpen(false)}
          instructions={usageInstructions}
        />
      )}
    </div>
  );
}
