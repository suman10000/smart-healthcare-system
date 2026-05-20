import React, { useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function UserLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    state: "",
    district: "",
    locality: "",
    contact: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.bloodGroup ||
      !form.state ||
      !form.district ||
      !form.locality ||
      !form.contact ||
      !form.password
    ) {
      setMessage("Please fill all fields to register.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/register-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMessage("Registration successful! You can now login.");
      setIsLogin(true);
      setForm({
        name: "",
        bloodGroup: "",
        state: "",
        district: "",
        locality: "",
        contact: "",
        password: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.contact || !form.password) {
      setMessage("Please enter contact and password to login.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: form.contact,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setMessage(`Welcome, ${data.donor.name}! You are logged in.`);
      // TODO: handle session/token here if needed
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">
          {isLogin ? "Donor Login" : "Register as Donor"}
        </h2>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage("");
              setForm({
                name: "",
                bloodGroup: "",
                state: "",
                district: "",
                locality: "",
                contact: "",
                password: "",
              });
            }}
            className={`px-6 py-2 rounded ${
              isLogin ? "bg-green-600 text-black font-semibold" : "bg-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage("");
              setForm({
                name: "",
                bloodGroup: "",
                state: "",
                district: "",
                locality: "",
                contact: "",
                password: "",
              });
            }}
            className={`px-6 py-2 rounded ${
              !isLogin ? "bg-green-600 text-black font-semibold" : "bg-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.contact}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-black py-2 rounded font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.name}
              onChange={handleInputChange}
              required
            />
            <select
              name="bloodGroup"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.bloodGroup}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="state"
              placeholder="State"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.state}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.district}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="locality"
              placeholder="Locality"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.locality}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.contact}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-black py-2 rounded font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
