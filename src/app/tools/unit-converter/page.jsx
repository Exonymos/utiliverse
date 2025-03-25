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
  Area: [
    { value: "acres", label: "Acres (ac)" },
    { value: "ares", label: "Ares (a)" },
    { value: "hectares", label: "Hectares (ha)" },
    { value: "sq_cm", label: "Square centimetres (cm²)" },
    { value: "sq_ft", label: "Square feet (ft²)" },
    { value: "sq_in", label: "Square inches (in²)" },
    { value: "sq_m", label: "Square metres (m²)" },
  ],

  Length: [
    { value: "mm", label: "Millimetres (mm)" },
    { value: "cm", label: "Centimetres (cm)" },
    { value: "m", label: "Metres (m)" },
    { value: "km", label: "Kilometres (km)" },
    { value: "in", label: "Inches (in)" },
    { value: "ft", label: "Feet (ft)" },
    { value: "yd", label: "Yards (yd)" },
    { value: "mi", label: "Miles (mi)" },
    { value: "NM", label: "Nautical miles (NM)" },
    { value: "mil", label: "Mils (mil)" },
  ],

  Temperature: [
    { value: "celsius", label: "Celsius (°C)" },
    { value: "fahrenheit", label: "Fahrenheit (°F)" },
    { value: "kelvin", label: "Kelvin (K)" },
  ],

  Volume: [
    { value: "uk_gallon", label: "UK gallons (gal)" },
    { value: "us_gallon", label: "US gallons (gal)" },
    { value: "litres", label: "Litres (L)" },
    { value: "millilitres", label: "Millilitres (mL)" },
    { value: "cc", label: "Cubic centimetres (cc)" },
    { value: "m3", label: "Cubic metres (m³)" },
    { value: "in3", label: "Cubic inches (in³)" },
    { value: "ft3", label: "Cubic feet (ft³)" },
  ],

  Mass: [
    { value: "tons", label: "Tons (t)" },
    { value: "uk_ton", label: "UK tons (t)" },
    { value: "us_ton", label: "US tons (t)" },
    { value: "lb", label: "Pounds (lb)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "kg", label: "Kilogrammes (kg)" },
    { value: "g", label: "Grams (g)" },
  ],

  Data: [
    { value: "bit", label: "Bits (b)" },
    { value: "B", label: "Bytes (B)" },
    { value: "KB", label: "Kilobytes (KB)" },
    { value: "KiB", label: "Kibibytes (KiB)" },
    { value: "MB", label: "Megabytes (MB)" },
    { value: "MiB", label: "Mebibytes (MiB)" },
    { value: "GB", label: "Gigabytes (GB)" },
    { value: "GiB", label: "Gibibytes (GiB)" },
    { value: "TB", label: "Terabytes (TB)" },
    { value: "TiB", label: "Tebibytes (TiB)" },
  ],

  Speed: [
    { value: "mps", label: "Metres per second (m/s)" },
    { value: "mph", label: "Miles per hour (mph)" },
    { value: "kmps", label: "Kilometres per second (km/s)" },
    { value: "kmph", label: "Kilometres per hour (km/h)" },
    { value: "inps", label: "Inches per second (in/s)" },
    { value: "inph", label: "Inches per hour (in/h)" },
    { value: "ftps", label: "Feet per second (ft/s)" },
    { value: "ftph", label: "Feet per hour (ft/h)" },
    { value: "mips", label: "Miles per second (mi/s)" },
    { value: "mi_h", label: "Miles per hour (mi/h)" },
    { value: "kn", label: "Knots (kn)" },
  ],

  Time: [
    { value: "ms", label: "Milliseconds (ms)" },
    { value: "s", label: "Seconds (s)" },
    { value: "min", label: "Minutes (min)" },
    { value: "h", label: "Hours (h)" },
    { value: "d", label: "Days (d)" },
    { value: "wk", label: "Weeks (wk)" },
  ],
};

// Conversion factors relative to each category’s base unit
const conversionFactors = {
  Area: {
    acres: 4046.86,
    ares: 100,
    hectares: 10000,
    sq_cm: 0.0001,
    sq_ft: 0.092903,
    sq_in: 0.00064516,
    sq_m: 1,
  },

  Length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
    NM: 1852,
    mil: 0.0000254,
  },

  Volume: {
    uk_gallon: 4.54609,
    us_gallon: 3.78541,
    litres: 1,
    millilitres: 0.001,
    cc: 0.001,
    m3: 1000,
    in3: 0.0163871,
    ft3: 28.3168,
  },

  Mass: {
    tons: 1000,
    uk_ton: 1016.05,
    us_ton: 907.185,
    lb: 0.453592,
    oz: 0.0283495,
    kg: 1,
    g: 0.001,
  },

  Data: {
    bit: 1 / 8,
    B: 1,
    KB: 1000,
    KiB: 1024,
    MB: 1e6,
    MiB: 1048576,
    GB: 1e9,
    GiB: 1073741824,
    TB: 1e12,
    TiB: 1099511627776,
  },

  Speed: {
    mps: 1,
    mph: 0.44704,
    kmps: 1000,
    kmph: 0.277778,
    inps: 0.0254,
    inph: 0.0254 / 3600,
    ftps: 0.3048,
    ftph: 0.3048 / 3600,
    mips: 1609.34,
    mi_h: 0.44704,
    kn: 0.514444,
  },

  Time: {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
    wk: 604800,
  },
};

// Reusable conversion function for all categories
function convertUnits(category, value, fromUnit, toUnit) {
  if (category === "Temperature") {
    if (fromUnit === toUnit) return value;
    let celsius;
    // Convert any temperature to Celsius
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
    const factors = conversionFactors[category];
    if (!factors) return value;
    const factorFrom = factors[fromUnit];
    const factorTo = factors[toUnit];
    if (!factorFrom || !factorTo) return value;
    return (value * factorFrom) / factorTo;
  }
}

// Main component for the Unit Converter page
export default function UnitConverterPage() {
  const [conversionType, setConversionType] = useLocalStorage(
    "unitConverter_conversionType",
    "Length"
  );
  const [fromUnit, setFromUnit] = useLocalStorage(
    "unitConverter_fromUnit",
    unitOptions["Length"][0].value
  );
  const [toUnit, setToUnit] = useLocalStorage(
    "unitConverter_toUnit",
    unitOptions["Length"][1].value
  );
  const [inputValue, setInputValue] = useLocalStorage(
    "unitConverter_inputValue",
    ""
  );
  const [decimalPoints, setDecimalPoints] = useLocalStorage(
    "unitConverter_decimalPoints",
    2
  );
  const [result, setResult] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const tool = toolsData.find((t) => t.id === "unit-converter");

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 1500);
  };

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
    if (!inputValue) {
      setResult(null);
      showToast("Please enter a value to convert.");
      return;
    }
    if (isNaN(Number(inputValue))) {
      setResult(null);
      showToast("Please enter a valid number.");
      return;
    }
    if (decimalPoints < 0 || decimalPoints > 100) {
      setResult(null);
      showToast("Decimal precision must be between 0 and 100.");
      return;
    }
    const converted = convertUnits(
      conversionType,
      Number(inputValue),
      fromUnit,
      toUnit
    );
    const formatted = Number(converted).toFixed(decimalPoints);
    setResult(formatted);
  };

  // Usage instructions
  const usageInstructions = (
    <div>
      <p>To convert units:</p>
      <ul className="list-disc ml-5">
        <li>
          Select the conversion category (Area, Length, Temperature, Volume,
          Mass, Data, Speed, or Time).
        </li>
        <li>Choose the units to convert from and to.</li>
        <li>Enter the value and set your preferred decimal precision.</li>
        <li>
          Click "Convert" to see the result. Use the swap button to quickly
          switch units.
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
      {/* Unit selection for "from" */}
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
      </div>
      {/* Swap Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="btn btn-outline mb-4"
        onClick={handleSwap}
        title="Swap Units"
      >
        <CgArrowsExchange size={20} />
      </motion.button>
      {/* Unit selection for "to" */}
      <div className="form-control mb-4 w-full md:w-1/2">
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
      {/* Input field for conversion value */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Value to Convert:</span>
        </label>
        <input
          type="number"
          className="input input-bordered"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
      </div>
      {/* Decimal precision input */}
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
      {/* Convert Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="btn btn-primary mb-4 flex items-center justify-center gap-2"
        onClick={handleConvert}
      >
        Convert <FiCheck />
      </motion.button>
      {/* Display result */}
      {result !== null && (
        <div className="mb-4 break-words">
          <h2 className="text-xl font-semibold">
            Result: {result}{" "}
            {unitOptions[conversionType].find((u) => u.value === toUnit)?.label}
          </h2>
        </div>
      )}
      {/* Toast message */}
      {toastMsg && (
        <div className="toast toast-center">
          <div className="alert alert-info">{toastMsg}</div>
        </div>
      )}
    </ToolPageLayout>
  );
}
