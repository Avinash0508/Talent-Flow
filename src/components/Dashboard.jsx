import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const sections = [
    {
      name: "Jobs",
      path: "/jobs",
      emoji: "💼",
      color: "bg-pink-200 hover:bg-pink-300 border-pink-400",
    },
    {
      name: "Candidates",
      path: "/candidates",
      emoji: "👩‍💻",
      color: "bg-blue-200 hover:bg-blue-300 border-blue-400",
    },
    {
      name: "Assessments",
      path: "/assessments",
      emoji: "📝",
      color: "bg-yellow-200 hover:bg-yellow-300 border-yellow-400",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-800 drop-shadow">
        🎉 TalentFlow
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
        {sections.map((s) => (
          <Link
            key={s.name}
            to={s.path}
            className={`flex flex-col items-center justify-center rounded-3xl border-4 ${s.color} shadow-lg p-10 transform hover:scale-105 transition duration-300`}
          >
            <span className="text-6xl mb-4">{s.emoji}</span>
            <span className="text-2xl font-bold text-gray-800">{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
