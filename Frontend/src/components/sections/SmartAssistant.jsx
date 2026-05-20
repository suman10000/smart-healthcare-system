import React, { useState, useEffect, useRef } from "react";
import { symptomData } from "./healthcareDataset";

export default function HealthcareChatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Describe how you feel or select a symptom below and I'll try to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSeverityAdvice = (baseAdvice, severity) => {
    if (severity === "moderate") {
      return (
        baseAdvice +
        " Since your symptom severity is moderate, consider consulting a healthcare professional soon."
      );
    } else if (severity === "severe") {
      return "⚠️ Your symptoms seem severe. Please seek immediate medical attention!";
    }
    return baseAdvice;
  };

  function detectSymptoms(text) {
    text = text.toLowerCase();
    return Object.keys(symptomData).filter((symptom) => text.includes(symptom));
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const symptoms = detectSymptoms(input);
    if (symptoms.length === 0) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "Sorry, I couldn't identify your symptoms clearly. Please mention symptoms like fever, cough, headache, fatigue, nausea, etc.",
          },
        ]);
        setLoading(false);
      }, 1000);
    } else {
      let delay = 1000;
      symptoms.forEach((symptom, idx) => {
        const data = symptomData[symptom];
        const advice = getSeverityAdvice(data.advice, severity);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              symptom,
              causes: data.causes,
              advice,
              medicines: data.medicineLinks,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          if (idx === symptoms.length - 1) setLoading(false);
        }, delay);
        delay += 1200;
      });
    }
    setInput("");
  };

  const handleSelectSymptom = (symptom) => {
    if (!symptom) return;
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: symptom }]);

    const data = symptomData[symptom];
    const advice = getSeverityAdvice(data.advice, severity);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          symptom,
          causes: data.causes,
          advice,
          medicines: data.medicineLinks,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared. Describe how you feel or select a symptom below and I'll try to help.",
      },
    ]);
    setInput("");
    setLoading(false);
  };

  const copyAdviceToClipboard = (advice) => {
    navigator.clipboard.writeText(advice).then(() => {
      alert("Advice copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-4xl bg-green-950 rounded-3xl shadow-xl flex flex-col h-[90vh]">
        {/* Header */}
        <header className="text-center py-4 border-b border-green-800 flex justify-between items-center px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 select-none">
            🩺 Healthcare Chatbot
          </h1>
          <button
            onClick={handleClearChat}
            className="text-green-300 hover:text-green-100 transition font-semibold border border-green-700 rounded-md px-3 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Clear chat"
            title="Clear Chat"
          >
            Clear
          </button>
        </header>

        {/* Controls */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-green-800 flex-wrap">
          <label
            className="text-green-300 font-semibold select-none whitespace-nowrap"
            htmlFor="severity"
          >
            Symptom Severity:
          </label>
          <select
            id="severity"
            className="rounded-lg px-4 py-2 bg-green-900 text-green-300 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>

          <label
            className="text-green-300 font-semibold select-none whitespace-nowrap"
            htmlFor="symptom-select"
          >
            Or select symptom:
          </label>
          <select
            id="symptom-select"
            className="flex-1 min-w-[160px] rounded-lg px-4 py-2 bg-green-900 text-green-300 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => {
              if (e.target.value !== "") handleSelectSymptom(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            aria-label="Select symptom"
          >
            <option disabled value="">
              -- Choose symptom --
            </option>
            {Object.keys(symptomData).map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
              </option>
            ))}
          </select>
        </section>

        {/* Chat messages */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-900"
          aria-live="polite"
        >
          {messages.map((msg, idx) =>
            msg.sender === "user" ? (
              <div
                key={idx}
                className="max-w-xs ml-auto bg-green-800 text-green-200 rounded-2xl px-5 py-3 whitespace-pre-wrap break-words shadow-md"
              >
                {msg.text}
              </div>
            ) : msg.symptom ? (
              <div
                key={idx}
                className="max-w-xl bg-green-900 text-green-100 rounded-3xl p-5 sm:p-6 shadow-lg relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold capitalize">{msg.symptom}</h2>
                  <time className="text-green-400 text-xs sm:text-sm">{msg.time}</time>
                </div>

                <section className="mb-4">
                  <h3 className="font-semibold underline mb-2 text-green-400 text-base sm:text-lg">
                    Possible Causes:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                    {msg.causes.map(({ name, probability }, i) => (
                      <li key={i}>
                        {name} —{" "}
                        <span className="font-semibold">{(probability * 100).toFixed(0)}%</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-4">
                  <h3 className="font-semibold underline mb-2 text-green-400 text-base sm:text-lg">
                    Recommended Medicines:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                    {msg.medicines.map(({ name, url }, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-300 underline hover:text-green-100 break-words"
                          title={`More info about ${name}`}
                        >
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-green-800 p-3 sm:p-4 rounded-lg text-green-200 italic border border-green-700 text-sm sm:text-base">
                  <strong>Advice:</strong> {msg.advice}
                </section>

                <button
                  onClick={() => copyAdviceToClipboard(msg.advice)}
                  className="absolute top-4 right-4 bg-green-700 hover:bg-green-600 text-green-200 px-3 py-1 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Copy advice to clipboard"
                  title="Copy advice"
                >
                  Copy
                </button>
              </div>
            ) : (
              <div
                key={idx}
                className="max-w-xl bg-green-900 text-green-100 rounded-3xl px-6 py-4 shadow-lg text-sm sm:text-base"
              >
                {msg.text}
              </div>
            )
          )}

          {loading && (
            <div className="max-w-xs ml-auto bg-green-700 text-green-200 rounded-2xl px-5 py-3 animate-pulse select-none text-sm sm:text-base">
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col sm:flex-row gap-3 p-4 border-t border-green-800"
          role="search"
          aria-label="Symptom input form"
        >
          <input
            type="text"
            className="flex-1 rounded-2xl px-5 py-3 bg-green-900 text-green-300 border border-green-700 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm sm:text-base"
            placeholder="Type your symptoms here (e.g., fever, cough)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Type your symptoms"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl px-6 py-3 font-semibold transition text-green-100 text-sm sm:text-base"
            aria-live="polite"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
