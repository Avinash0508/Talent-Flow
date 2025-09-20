import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const cards = [
    { title: "Jobs", description: "View and manage all job listings.", path: "/jobs", emoji: "📄" },
    { title: "Candidates", description: "Track applicants and their progress.", path: "/candidates", emoji: "👥" },
    { title: "Assessments", description: "Create and review candidate assessments.", path: "/assessments", emoji: "📝" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-100 p-12 rounded-xl shadow-md text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-3">
        
          Welcome to TalentFlow
        </h1>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
          TalentFlow helps you manage your hiring process efficiently. Track candidates, manage job postings, and create assessments all in one centralized platform.
        </p>
        <p className="text-gray-600 max-w-xl mx-auto">
          Get started by exploring the main sections below, or create a new job, assessment, or candidate profile to kickstart your hiring workflow.
        </p>
      </section>

      {/* Quick Links Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-transform flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{card.emoji}</span>
              <h2 className="text-xl font-semibold text-blue-800">{card.title}</h2>
            </div>
            <p className="text-gray-600 flex-grow">{card.description}</p>
            <span className="text-blue-500 font-bold mt-2 inline-block">Go →</span>
          </div>
        ))}
      </section>
    </div>
  );
}