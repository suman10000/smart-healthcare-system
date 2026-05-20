import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#4ADE80', '#F472B6'];

export default function DiseasePercentageByHospitalDate() {
  const [diseases, setDiseases] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [disease, setDisease] = useState("");
  const [hospital, setHospital] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(3);

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientDiseases, setPatientDiseases] = useState([]);
  const [cooccurringDiseases, setCooccurringDiseases] = useState([]);

  const [error, setError] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingCooccur, setLoadingCooccur] = useState(false);
  const [loadingPatientDiseases, setLoadingPatientDiseases] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/hospitals")
      .then((res) => res.json())
      .then(setHospitals)
      .catch(() => setError("Failed to fetch hospitals"));

    fetch("http://localhost:4000/api/diseases")
      .then((res) => res.json())
      .then(setDiseases)
      .catch(() => setError("Failed to fetch diseases"));
  }, []);

  const fetchPatients = async () => {
    if (!disease || !hospital || !startDate || !endDate) {
      setError("Please fill all filters to search patients.");
      return;
    }
    setError("");
    setLoadingPatients(true);
    setPatients([]);
    setSelectedPatientId(null);
    setPatientDiseases([]);
    setCooccurringDiseases([]);

    try {
      const params = new URLSearchParams({ disease, hospital, startDate, endDate });
      const res = await fetch(`http://localhost:4000/api/patients?${params}`);
      const data = await res.json();

      if (res.ok) {
        setPatients(data);
        if (data.length === 0) setError("No patients found for these filters.");
      } else {
        setError(data.error || "Failed to fetch patients.");
      }
    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchPatientDiseases = async (preid) => {
    setSelectedPatientId(preid);
    setPatientDiseases([]);
    setError("");
    setLoadingPatientDiseases(true);

    try {
      const res = await fetch(`http://localhost:4000/api/patient-diseases?preid=${preid}`);
      const data = await res.json();
      if (res.ok) {
        setPatientDiseases(data);
        if (data.length === 0) setError("No diseases found for this patient.");
      } else {
        setError(data.error || "Failed to fetch patient's diseases.");
      }
    } catch {
      setError("Failed to fetch patient's diseases.");
    } finally {
      setLoadingPatientDiseases(false);
    }
  };

  const fetchCooccurringDiseases = async () => {
    if (!disease || !hospital || !startDate || !endDate) {
      setError("Please fill all filters before fetching co-occurring diseases.");
      return;
    }
    setError("");
    setCooccurringDiseases([]);
    setLoadingCooccur(true);

    try {
      const params = new URLSearchParams({ disease, hospital, startDate, endDate, limit });
      const res = await fetch(`http://localhost:4000/api/cooccurring-diseases?${params}`);
      const data = await res.json();
      if (res.ok) {
        setCooccurringDiseases(data);
        if (data.length === 0) setError("No co-occurring diseases found.");
      } else {
        setError(data.error || "Failed to fetch co-occurring diseases.");
      }
    } catch {
      setError("Failed to fetch co-occurring diseases.");
    } finally {
      setLoadingCooccur(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10 drop-shadow-sm tracking-wide">
        Patient Statistics and Disease Co-Occurrence Visualization
        </h1>

        {error && (
          <div className="bg-red-200 text-red-800 p-4 rounded shadow-md mb-6 text-center font-semibold border border-red-400">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); fetchPatients(); }} className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white p-6 rounded shadow-md border mb-10">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Hospital</label>
            <select value={hospital} onChange={(e) => setHospital(e.target.value)} required className="w-full p-2 border rounded">
              <option value="">-- Select --</option>
              {hospitals.map((h, i) => (
                <option key={i} value={h.name_hos}>{h.name_hos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Disease</label>
            <select value={disease} onChange={(e) => setDisease(e.target.value)} required className="w-full p-2 border rounded">
              <option value="">-- Select --</option>
              {diseases.map((d, i) => (
                <option key={i} value={d.basic_diagnosis}>{d.basic_diagnosis}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full p-2 border rounded" />
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition shadow">
              {loadingPatients ? "Searching..." : "Search Patients"}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <label className="text-gray-700 font-medium">Top Co-occurring Diseases</label>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="ml-3 border p-2 rounded">
              {[1, 2, 3, 5, 10].map((n) => (
                <option key={n} value={n}>Top {n}</option>
              ))}
            </select>
          </div>

          <button onClick={fetchCooccurringDiseases} disabled={loadingCooccur} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow">
            {loadingCooccur ? "Loading..." : `Show Top ${limit} Co-occurring Diseases`}
          </button>
        </div>

        {cooccurringDiseases.length > 0 && (
          <div className="bg-white p-6 rounded shadow-md border mb-10">
            <h2 className="text-xl font-bold text-green-700 mb-4">Top {limit} Co-occurring Diseases</h2>
            <ul className="list-disc list-inside mb-6 text-green-900 space-y-1">
              {cooccurringDiseases.map((d, i) => (
                <li key={i}><strong>{d.disease}</strong> — {d.count} patients ({d.percentage}%)</li>
              ))}
            </ul>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cooccurringDiseases} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="disease" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#34D399" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-96 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cooccurringDiseases} dataKey="percentage" nameKey="disease" cx="50%" cy="50%" outerRadius={120} label>
                    {cooccurringDiseases.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {patients.length > 0 && (
          <div className="bg-white p-6 rounded shadow-md border mb-10">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Patient IDs</h2>
            <ul className="max-h-64 overflow-y-auto space-y-2 border rounded p-3 bg-indigo-50">
              {patients.map((p, i) => (
                <li
                  key={i}
                  onClick={() => fetchPatientDiseases(p.preid)}
                  className={`p-2 rounded cursor-pointer hover:bg-indigo-100 ${selectedPatientId === p.preid ? "bg-indigo-200 font-bold" : ""}`}
                >
                  {p.preid}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 italic mt-2">Click on a patient ID to view their diseases.</p>
          </div>
        )}

        {selectedPatientId && (
          <div className="bg-yellow-50 p-6 rounded shadow-md border border-yellow-300 mb-10">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">
              Diseases for Patient ID: {selectedPatientId}
            </h3>
            {loadingPatientDiseases ? (
              <p className="text-yellow-700 font-semibold">Loading diseases...</p>
            ) : patientDiseases.length > 0 ? (
              <ul className="list-disc list-inside text-yellow-900 space-y-1">
                {patientDiseases.map((d, i) => (
                  <li key={i}>{d.disease}</li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-600 italic">No diseases found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
