import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnimatedHeader from "./components/AnimatedHeader";
import PatientDetails from "./components/sections/PatientDetails";
import UserLogin from "./components/sections/UserLogin";
import SmartAssistant from "./components/sections/SmartAssistant";
import Home from "./components/sections/Home";
import Footer from "./components/Footer";

// Import or create the components for the new routes (placeholders for now)
import GroupwiseDiagnosisOverview from "./Page/GroupwiseDiagnosisOverview";
import DiseasePercentageByHospitalDate from "./Page/DiseasePercentageByHospitalDate";

function App() {
  return (
    <BrowserRouter>
      <AnimatedHeader />
      <main className="pt-[70px]">
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />

          <Route
            path="/patient_details"
            element={
              <section className="min-h-screen bg-gray-900 text-white">
                <PatientDetails />
              </section>
            }
          />
          <Route
            path="/UserLogin"
            element={
              <section className="min-h-screen bg-purple-900 text-white">
                <UserLogin/>
              </section>
            }
          />
          <Route
            path="/smart_assistant"
            element={
              <section className="min-h-screen bg-pink-900 text-white">
                <SmartAssistant />
              </section>
            }
          />
          <Route
            path="/Home"
            element={
              <section className="min-h-screen bg-indigo-900 text-white">
                <Home />
              </section>
            }
          />

          {/* Added routes for new pages */}
          <Route
            path="/groupwise_diagnosis_overview"
            element={<GroupwiseDiagnosisOverview />}
          />
          <Route
            path="/disease_percentage_by_hospital_date"
            element={<DiseasePercentageByHospitalDate />}
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <section className="min-h-screen flex items-center justify-center bg-gray-800 text-white text-3xl">
                <p>Page Not Found</p>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
