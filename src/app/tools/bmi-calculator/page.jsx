// src/app/tools/bmi-calculator/page.jsx
"use client";
import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import useLocalStorage from "../../../hooks/useLocalStorage";
import toolsData from "../../../data/tools.json";
import ToolPageLayout from "../../../components/ToolPageLayout";

export default function BMICalculatorPage() {
  const [unit, setUnit] = useLocalStorage("tool_bmi_unit", "metric");
  const [weight, setWeight] = useLocalStorage("tool_bmi_weight", "");
  const [height, setHeight] = useLocalStorage("tool_bmi_height", "");
  const [bmi, setBmi] = useState(null);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const tool = toolsData.find((t) => t.id === "bmi-calculator");

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

  const resetFields = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
  };

  const getBMICategory = (bmiVal) => {
    const bmiNum = parseFloat(bmiVal);
    if (bmiNum < 18.5) return "Underweight";
    if (bmiNum < 25) return "Normal weight";
    if (bmiNum < 30) return "Overweight";
    return "Obese";
  };

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
    <ToolPageLayout
      tool={tool}
      isUsageModalOpen={isUsageModalOpen}
      openUsageModal={() => setIsUsageModalOpen(true)}
      closeUsageModal={() => setIsUsageModalOpen(false)}
      usageInstructions={usageInstructions}
    >
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setUnit("metric")}
          className={`btn ${unit === "metric" ? "btn-primary" : "btn-outline"}`}
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
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="btn btn-primary mb-4"
        onClick={calculateBMI}
      >
        Calculate BMI <FiCheck className="ml-2" />
      </motion.button>
      {bmi && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Your BMI: {bmi}</h2>
          <p className="text-sm text-gray-500">
            Category: {getBMICategory(bmi)}
          </p>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button className="btn btn-outline w-full" onClick={resetFields}>
          Reset
        </button>
      </div>
    </ToolPageLayout>
  );
}
