import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/Home" },
  { label: "Patient Details", to: "/patient_details" },
  { label: "UserLogin", to: "/UserLogin" },
  { label: "Smart Assistant", to: "/smart_assistant" },
  
];

const panelVariants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.4,
      when: "afterChildren",
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

const AnimatedHeader = () => {
  const [isMobileNav, setIsMobileNav] = useState(false);

  return (
    <header className="w-full px-6 py-4 lg:px-8 fixed top-0 z-50 h-[70px] bg-gray-900/90 backdrop-blur-sm text-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto relative">
        <div className="flex items-center capitalize">
          <span className="text-2xl font-bold cursor-default select-none">
            {"<"}Healthcare {" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              System
              {" />"}
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-pink-400 ${
                  isActive ? "text-pink-400" : "text-white"
                }`
              }
              onClick={() => setIsMobileNav(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div
          className="block md:hidden cursor-pointer"
          onClick={() => setIsMobileNav(!isMobileNav)}
          aria-label="Toggle menu"
        >
          {isMobileNav ? <X size={24} /> : <Menu size={24} />}
        </div>

        <AnimatePresence>
          {isMobileNav && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 bg-black"
                onClick={() => setIsMobileNav(false)}
              />

              <motion.div
                key="panel"
                variants={panelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed top-[70px] left-0 z-50 h-[calc(100vh-70px)] w-screen bg-gray-900/95 drop-shadow-lg flex flex-col px-6 py-4"
              >
                {navItems.map((item) => (
                  <motion.div key={item.to} variants={itemVariants}>
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMobileNav(false)}
                      className={({ isActive }) =>
                        `block w-full rounded-md border-b border-gray-700 py-3 px-4 text-lg font-semibold transition-colors ${
                          isActive ? "bg-pink-600 text-white" : "text-gray-300 hover:bg-gray-800"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default AnimatedHeader;
