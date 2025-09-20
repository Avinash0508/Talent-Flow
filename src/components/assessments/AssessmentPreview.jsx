import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import useAssessments from "../../hooks/useAssessments";

export default function AssessmentPreview() {
  const { jobId } = useParams();
  // The hook now returns an array named 'assessments'
  const { assessments, loading } = useAssessments(jobId);

  if (loading) return <p>Loading previews...</p>;
  if (!assessments || !assessments.length) return <p>No assessments created yet for this job.</p>;

  return (
    <motion.div
      className="p-6 bg-indigo-200 rounded-2xl shadow-lg border-4 border-black"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Assessments Preview for Job {jobId}</h2>
      
      {/* We map over the 'assessments' array here */}
      <div className="space-y-6">
        {assessments.map((assessment, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            {/* Each assessment can have multiple sections, so we loop through them too */}
            {assessment.sections.map((sec, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{sec.title}</h3>
                <ul className="list-decimal list-inside space-y-2 text-gray-700">
                  {sec.questions.map((q, qIdx) => (
                    <li key={qIdx}>{q.text || "<Question text>"}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}