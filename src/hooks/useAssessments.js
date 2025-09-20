import { useState, useEffect } from "react";
import { db } from "../services/db";

export default function useAssessments(jobId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await db.assessments.where("jobId").equals(Number(jobId)).toArray();
      setAssessments(data || []);
    } catch (err)      {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAssessment = async (assessmentId, newSections) => {
    try {
      await db.assessments.update(assessmentId, { sections: newSections });
      setAssessments(prev => prev.map(a => 
        a.id === assessmentId ? { ...a, sections: newSections } : a
      ));
    } catch (err) {
      console.error("Failed to save assessment:", err);
    }
  };

  const deleteAssessment = async (assessmentId) => {
    // Add a confirmation dialog for safety
    if (!window.confirm("Are you sure you want to permanently delete this entire assessment?")) {
      return;
    }
    try {
      await db.assessments.delete(assessmentId);
      // Update the local state to remove the assessment from the UI
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
    } catch (err) {
      console.error("Failed to delete assessment:", err);
    }
  };

  const submitResponse = async (answers, candidateId = null) => {
    try {
      await db.responses.add({ jobId: Number(jobId), candidateId, answers, date: new
 
Date().toISOString() });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAssessments(); }, [jobId]);

  return { assessments, loading, fetchAssessments, saveAssessment, deleteAssessment, submitResponse };
}
