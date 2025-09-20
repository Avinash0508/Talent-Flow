import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/", emoji: "" },
    { name: "Jobs", path: "/jobs", emoji: "" },
    { name: "Candidates", path: "/candidates", emoji: "" },
    { name: "Assessments", path: "/assessments", emoji: "" },
  ];

  return (
    <nav className="bg-primary-500 border-b-2 border-primary-700 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            
            <h1 className="text-2xl font-bold text-white">TalentFlow</h1>
          </Link>

          {/* Links */}
          <div className="flex space-x-6">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded font-semibold text-white hover:bg-primary-400 transition ${
                    isActive ? "bg-primary-600" : ""
                  }`
                }
              >
                <span>{link.emoji}</span>
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}