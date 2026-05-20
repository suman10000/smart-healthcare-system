import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-4 px-6 fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto flex justify-end items-center space-x-2">
        <span
          className="text-green-400 text-2xl font-bold"
          style={{ 
            display: "inline-block", 
            animation: "spin 5s linear infinite" 
          }}
          aria-label="infinity sign"
          role="img"
        >
          ∞
        </span>
        <p className="text-sm italic font-bold text-gray-300">
          FRP S27 G10 members of ITER (Institute of Technical Education and Research)
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
