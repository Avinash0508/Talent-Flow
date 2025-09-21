import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/db.js';

export default function useAssessments(jobId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const allAssessments = await db.assessments
        .where('jobId')
        .equals(Number(jobId))
        .toArray();
      setAssessments(allAssessments);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const saveAssessment = async (assessmentId, newSections) => {
    try {
      await db.assessments.update(assessmentId, { sections: newSections });
      await fetchAssessments();
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }
  };

  const addAssessment = async () => {
    if (!jobId) return;
    try {
      const newAssessment = {
        jobId: Number(jobId),
        sections: [{
          title: `Assessment ${assessments.length + 1}`,
          questions: []
        }]
      };
      await db.assessments.add(newAssessment);
      await fetchAssessments(); // Refetch to update the list in the UI
    } catch (error) {
      console.error("Failed to add assessment:", error);
    }
  };

  return { assessments, loading, saveAssessment, addAssessment };
}
