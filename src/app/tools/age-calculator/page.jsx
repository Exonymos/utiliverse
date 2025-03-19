// src/app/tools/age-calculator/page.jsx
"use client";
import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import useLocalStorage from "../../../hooks/useLocalStorage";
import UsageModal from "../../../components/UsageModal";
import toolsData from "../../../data/tools.json";
import ToolInfo from "../../../components/ToolInfo";

export default function AgeCalculatorPage() {
  // State hooks for managing input and results
  const [birthDate, setBirthDate] = useLocalStorage(
    "tool_age_calculator_input",
    ""
  );
  const [ageResult, setAgeResult] = useState(null);
  const [nextBirthday, setNextBirthday] = useState(null);
  const [totalDays, setTotalDays] = useState(null);
  const [futureDate, setFutureDate] = useState("");
  const [futureAge, setFutureAge] = useState(null);
  const [zodiacSign, setZodiacSign] = useState("");
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const tool = toolsData.find((t) => t.id === "age-calculator");

  // Function to calculate age based on birth date
  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAgeResult({ years, months, days });

    // Calculate total days lived
    const diffMs = now - birth;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    setTotalDays(diffDays);

    // Calculate days until next birthday
    let nextBday = new Date(
      now.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBday < now) {
      nextBday = new Date(
        now.getFullYear() + 1,
        birth.getMonth(),
        birth.getDate()
      );
    }
    const diffBirthdayMs = nextBday - now;
    const diffBirthdayDays = Math.ceil(diffBirthdayMs / (1000 * 60 * 60 * 24));
    setNextBirthday(diffBirthdayDays);

    // Determine zodiac sign
    setZodiacSign(getZodiacSign(birth));
  };

  // Function to calculate age on a future date
  const calculateFutureAge = () => {
    if (!birthDate || !futureDate) return;
    const birth = new Date(birthDate);
    const future = new Date(futureDate);
    if (future <= birth) return;
    let years = future.getFullYear() - birth.getFullYear();
    let months = future.getMonth() - birth.getMonth();
    let days = future.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(future.getFullYear(), future.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setFutureAge({ years, months, days });
  };

  // Function to get zodiac sign based on birth date
  const getZodiacSign = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "Capricorn";
    return "";
  };

  // Function to reset all input fields and results
  const resetFields = () => {
    setBirthDate("");
    setAgeResult(null);
    setNextBirthday(null);
    setTotalDays(null);
    setZodiacSign("");
    setFutureDate("");
    setFutureAge(null);
  };

  // Funtion to provide a fun future prediction
  const futurePrediction = () => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    const diffMs = future - birth;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `In ≈10 years, you will have lived ${diffDays.toLocaleString()} days.`;
  };

  // Usage instructions for the tool
  const usageInstructions = (
    <div>
      <p>To calculate your age:</p>
      <ul className="list-disc ml-5">
        <li>Enter your birth date in the input field.</li>
        <li>
          Click "Calculate Age" to display your age in years, months, and days.
        </li>
        <li>
          The tool will also show the total days lived, days until your next
          birthday, your zodiac sign, and a fun future prediction.
        </li>
        <li>
          You can optionally enter a future date to see how old you will be on
          that day.
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
              {/* Birth date input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Enter your birth date:</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full max-w-xs"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              {/* Calculate Age button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="btn btn-primary mb-4"
                onClick={calculateAge}
              >
                Calculate Age <FiCheck className="ml-2" />
              </motion.button>
              {/* Show additional info only after calculation */}
              {ageResult && (
                <>
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <h2 className="text-xl font-semibold">Your Age:</h2>
                    <p>
                      {ageResult.years} years, {ageResult.months} months,{" "}
                      {ageResult.days} days
                    </p>
                    {nextBirthday !== null && (
                      <p className="text-sm text-gray-500">
                        Next birthday in {nextBirthday} day
                        {nextBirthday === 1 ? "" : "s"}.
                      </p>
                    )}
                    {totalDays !== null && (
                      <p className="text-sm text-gray-500">
                        You have lived {totalDays.toLocaleString()} days.
                      </p>
                    )}
                    {zodiacSign && (
                      <p className="text-sm text-gray-500">
                        Your zodiac sign is {zodiacSign}.
                      </p>
                    )}
                  </div>

                  {/* Accordions and Reset Button */}
                  <div className="mt-4 space-y-2">
                    {/* Detailed Age Breakdown & Fun Facts */}
                    <div
                      tabIndex={0}
                      className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                    >
                      <input type="checkbox" />
                      <div className="collapse-title text-xl font-medium">
                        Age Breakdown & Fun Facts
                      </div>
                      <div className="collapse-content">
                        {totalDays !== null && (
                          <>
                            <p className="text-sm text-gray-500">
                              Total weeks lived:{" "}
                              {Math.floor(totalDays / 7).toLocaleString()}{" "}
                              weeks.
                            </p>
                            <p className="text-sm text-gray-500">
                              Total minutes lived:{" "}
                              {(totalDays * 24 * 60).toLocaleString()} minutes.
                            </p>
                          </>
                        )}
                        {ageResult && (
                          <p className="text-sm text-gray-500">
                            Age in dog years:{" "}
                            {(ageResult.years * 7).toLocaleString()} years.
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {futurePrediction()}
                        </p>
                      </div>
                    </div>

                    {/* Future Projections */}
                    <div
                      tabIndex={1}
                      className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                    >
                      <input type="checkbox" />
                      <div className="collapse-title text-xl font-medium">
                        Future Projections
                      </div>
                      <div className="collapse-content">
                        <div className="form-control mb-2">
                          <label className="label">
                            <span className="label-text">
                              Enter a future date (optional):
                            </span>
                          </label>
                          <input
                            type="date"
                            className="input input-bordered w-full max-w-xs"
                            value={futureDate}
                            onChange={(e) => setFutureDate(e.target.value)}
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="btn btn-primary mb-2"
                          onClick={calculateFutureAge}
                        >
                          Calculate Future Age <FiCheck className="ml-2" />
                        </motion.button>
                        {futureAge && (
                          <p className="text-sm text-gray-500">
                            On {futureDate}, you will be {futureAge.years}{" "}
                            years, {futureAge.months} months, and{" "}
                            {futureAge.days} days old.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="btn btn-outline w-full"
                        onClick={resetFields}
                      >
                        Reset
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
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
