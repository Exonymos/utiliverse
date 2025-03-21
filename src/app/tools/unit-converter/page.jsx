// src/app/tools/unit-converter/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { CgArrowsExchange } from "react-icons/cg";
import ToolPageLayout from "../../../components/ToolPageLayout";
import useLocalStorage from "../../../hooks/useLocalStorage";
import toolsData from "../../../data/tools.json";

// Define available unit options for each conversion category
const unitOptions = {
  Length: [
    { value: "meters", label: "Meters" },
    { value: "feet", label: "Feet" },
    { value: "inches", label: "Inches" },
    { value: "miles", label: "Miles" },
    { value: "kilometers", label: "Kilometers" },
  ],
  Weight: [
    { value: "grams", label: "Grams" },
    { value: "kilograms", label: "Kilograms" },
    { value: "pounds", label: "Pounds" },
    { value: "ounces", label: "Ounces" },
  ],
  Temperature: [
    { value: "celsius", label: "Celsius" },
    { value: "fahrenheit", label: "Fahrenheit" },
    { value: "kelvin", label: "Kelvin" },
  ],
  Volume: [
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
    { value: "milliliters", label: "Milliliters" },
  ],
};

// Define conversion factors for non-temperature categories
const conversionFactors = {
  Length: {
    meters: 1,
    feet: 0.3048,
    inches: 0.0254,
    miles: 1609.34,
    kilometers: 1000,
  },
  Weight: {
    grams: 0.001,
    kilograms: 1,
    pounds: 0.453592,
    ounces: 0.0283495,
  },
  Volume: {
    liters: 1,
    gallons: 3.78541,
    milliliters: 0.001,
  },
};

// Function to convert a value from one unit to another based on the category
function convertValue(category, value, fromUnit, toUnit) {
  if (category === "Temperature") {
    if (fromUnit === toUnit) return value;
    let celsius;
    // Convert input to Celsius first
    if (fromUnit === "celsius") {
      celsius = value;
    } else if (fromUnit === "fahrenheit") {
      celsius = (value - 32) * (5 / 9);
    } else if (fromUnit === "kelvin") {
      celsius = value - 273.15;
    }
    // Convert from Celsius to target unit
    if (toUnit === "celsius") return celsius;
    if (toUnit === "fahrenheit") return celsius * (9 / 5) + 32;
    if (toUnit === "kelvin") return celsius + 273.15;
  } else {
    const factorFrom = conversionFactors[category][fromUnit];
    const factorTo = conversionFactors[category][toUnit];
    return (value * factorFrom) / factorTo;
  }
}

// Main component for the Unit Converter page
export default function UnitConverterPage() {
  // Persist conversion settings using localStorage
  const [conversionType, setConversionType] = useLocalStorage(
    "unitConverter_conversionType",
    "Length"
  );
  const [fromUnit, setFromUnit] = useLocalStorage(
    "unitConverter_fromUnit",
    "meters"
  );
  const [toUnit, setToUnit] = useLocalStorage("unitConverter_toUnit", "feet");
  const [inputValue, setInputValue] = useLocalStorage(
    "unitConverter_inputValue",
    ""
  );
  const [decimalPoints, setDecimalPoints] = useLocalStorage(
    "unitConverter_decimalPoints",
    2
  );
  const [result, setResult] = useState(null);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const tool = toolsData.find((t) => t.id === "unit-converter");

  // Update default "from" and "to" units when conversion type changes
  useEffect(() => {
    const options = unitOptions[conversionType];
    if (options && options.length > 1) {
      setFromUnit(options[0].value);
      setToUnit(options[1].value);
    }
    setInputValue("");
    setResult(null);
  }, [conversionType]);

  // Swap the "from" and "to" units
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setResult(null);
  };

  // Handle conversion when the user clicks "Convert"
  const handleConvert = () => {
    if (!inputValue || isNaN(Number(inputValue))) return;
    const converted = convertValue(
      conversionType,
      Number(inputValue),
      fromUnit,
      toUnit
    );
    setResult(Number(converted).toFixed(decimalPoints));
  };

  // Usage instructions
  const usageInstructions = (
    <div>
      <p>To convert units:</p>
      <ul className="list-disc ml-5">
        <li>
          Select the conversion category (Length, Weight, Temperature, Volume).
        </li>
        <li>Choose the units to convert from and to.</li>
        <li>
          Enter the value to convert and set your preferred decimal precision.
        </li>
        <li>Click "Convert" to see the result.</li>
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
      {/* Conversion category selection */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Conversion Category:</span>
        </label>
        <select
          className="select select-bordered"
          value={conversionType}
          onChange={(e) => setConversionType(e.target.value)}
        >
          {Object.keys(unitOptions).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {/* Unit selection for "from" and "to" */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="form-control w-full md:w-1/2">
          <label className="label flex items-center gap-1">
            <span className="label-text">From:</span>
          </label>
          <select
            className="select select-bordered"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {unitOptions[conversionType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {/* Swap button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn btn-outline"
          onClick={handleSwap}
          title="Swap Units"
        >
          <CgArrowsExchange size={20} />
        </motion.button>
        <div className="form-control w-full md:w-1/2">
          <label className="label flex items-center gap-1">
            <span className="label-text">To:</span>
          </label>
          <select
            className="select select-bordered"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {unitOptions[conversionType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Input for the value to be converted */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Value to Convert:</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
      </div>
      {/* Input for decimal precision */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Decimal Precision:</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-24"
          value={decimalPoints}
          onChange={(e) => setDecimalPoints(Number(e.target.value))}
          min="0"
          placeholder="2"
        />
      </div>
      {/* Convert button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="btn btn-primary mb-4 flex items-center justify-center gap-2"
        onClick={handleConvert}
      >
        Convert <FiCheck />
      </motion.button>
      {/* Display conversion result */}
      {result !== null && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Result: {result}{" "}
            {unitOptions[conversionType].find((u) => u.value === toUnit)?.label}
          </h2>
        </div>
      )}
    </ToolPageLayout>
  );
}
