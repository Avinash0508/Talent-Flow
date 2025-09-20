import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
// Jobs
import JobsList from "./components/jobs/JobsList.jsx";
import JobDetails from "./components/jobs/JobDetails.jsx";

// Candidates
import CandidateKanban from "./components/candidates/CandidateKanban.jsx";
import CandidatesPage from "./components/candidates/CandidatesPage.jsx";
import CandidateProfile from "./components/candidates/CandidateProfile.jsx";

// Assessments
import AssessmentBuilder from "./components/assessments/AssessmentBuilder.jsx";
import AssessmentPreview from "./components/assessments/AssessmentPreview.jsx";
import AssessmentForm from "./components/assessments/AssessmentForm.jsx";
import AssessmentsPage from "./components/assessments/AssessmentsPage.jsx";

import Homepage from "./components/Homepage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-6">
        <Routes>
          
<Route path="/" element={<Homepage />} />
          {/* Jobs */}
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Candidates */}
          
<Route path="/candidates" element={<CandidatesPage />} />
<Route path="/candidates/kanban" element={<CandidateKanban />} />
<Route path="/candidates/:id" element={<CandidateProfile />} />


          {/* Assessments */}
          <Route path="/assessments" element={<AssessmentsPage />} />
<Route path="/assessments/:jobId" element={<AssessmentBuilder />} />
<Route path="/assessments/:jobId/preview" element={<AssessmentPreview />} />
<Route path="/assessments/:jobId/take" element={<AssessmentForm />} />

          {/* Default route */}
          <Route path="/" element={<JobsList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}