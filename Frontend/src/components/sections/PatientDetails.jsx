import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const links = [
  { label: "Groupwise Diagnosis Overview", to: "/groupwise_diagnosis_overview" },
  { label: "Disease-wise % by Hospital and Date Range", to: "/disease_percentage_by_hospital_date" },
];

const PatientDetails = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 bg-gradient-to-b from-green-900 via-black to-black text-green-300 px-4">
      <h1 className="text-4xl font-extrabold mb-10 text-green-400 drop-shadow-lg">
        Patient Details Dashboard
      </h1>

      <div className="relative w-full max-w-xl">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center bg-gradient-to-r from-green-700 via-black to-black rounded-lg px-6 py-4 text-xl font-semibold shadow-lg hover:shadow-2xl transition-shadow duration-300"
          aria-haspopup="true"
          aria-expanded={open}
        >
          Select Report/View
          <ChevronDown
            size={28}
            className={`ml-2 transition-transform duration-300 text-green-400 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            ref={dropdownRef}
            className="absolute z-20 mt-2 w-full bg-black rounded-lg shadow-2xl divide-y divide-green-800"
            role="menu"
            aria-label="Report selection menu"
          >
            {links.map(({ label, to }) => (
              <li key={to} role="none">
                <a
                  href={to}
                  role="menuitem"
                  className="block px-6 py-4 text-lg font-medium text-green-300 hover:bg-green-800 hover:text-green-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
