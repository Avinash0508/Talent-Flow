import { useState, useEffect } from "react";
import { db } from "../services/db";

export const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function useCandidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const all = await db.candidates.toArray();
      setCandidates(all);
    }
    fetchCandidates();
  }, []);

  const addNote = async (candidateId, text, noteId = null) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;

        let updatedCandidate;

        if (noteId !== null) {
          // Delete note
          updatedCandidate = { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) };
        } else {
          // Add note
          const newNote = { id: Date.now(), text };
          updatedCandidate = { ...c, notes: [...(c.notes || []), newNote] };
        }

        db.candidates.put(updatedCandidate);

        return updatedCandidate;
      })
    );
  };

  const addCandidate = async (data) => {
    const newCandidate = { id: Date.now(), notes: [], ...data };
    setCandidates(prev => [...prev, newCandidate]);
    await db.candidates.add(newCandidate);
  };

  const editCandidate = async (id, data) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...data };
          db.candidates.put(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCandidate = async (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    await db.candidates.delete(id);
  };

  const updateStage = async (id, stage) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, stage };
          db.candidates.put(updated);
          return updated;
        }
        return c;
      })
    );
  };

  return {
    candidates,
    addCandidate,
    editCandidate,
    deleteCandidate,
    updateStage,
    addNote
  };
}

