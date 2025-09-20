// src/components/candidates/CandidateProfile.jsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useCandidates from "../../hooks/useCandidates";
import useJobs from "../../hooks/useJobs";

function renderWithMentions(text) {
  // simple highlight for @mentions
  return text.split(/(\s+)/).map((part, i) => {
    if (part.startsWith("@")) {
      return <span key={i} className="text-indigo-600 font-medium">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function CandidateProfile() {
  const { id } = useParams();
  const { candidates, addNote } = useCandidates();
  const { jobs } = useJobs();
  const candidate = candidates.find(c => String(c.id) === String(id));
  const [noteText, setNoteText] = useState("");

  const candidateNames = useMemo(()=> candidates.map(c=>c.name), [candidates]);

  if (!candidate) return <div className="p-6">Candidate not found</div>;

  const job = jobs.find(j => String(j.id) === String(candidate.jobId));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{candidate.name}</h2>
        <div className="text-sm text-gray-600">{candidate.email} • Job: {job?.title || "N/A"}</div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Timeline</h3>
        <ul className="space-y-2">
          {(candidate.history || []).slice().reverse().map((h, idx)=>(
            <li key={idx} className="text-sm text-gray-700">
              <div className="font-medium">{h.stage}</div>
              <div className="text-xs text-gray-500">{new Date(h.at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Notes</h3>
        <div className="space-y-2">
          {(candidate.notes || []).map(n => (
            <div key={n.id} className="border rounded p-2">
              <div className="text-xs text-gray-500">{new Date(n.at).toLocaleString()}</div>
              <div>{renderWithMentions(n.text)}</div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={3} className="w-full p-2 border rounded" placeholder="Add note (use @ to mention)"></textarea>
          <div className="flex justify-end gap-2 mt-2">
            <button className="px-3 py-1 rounded bg-gray-300" onClick={()=>setNoteText("")}>Cancel</button>
            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={()=>{
              if (!noteText.trim()) return;
              addNote(candidate.id, noteText.trim());
              setNoteText("");
            }}>Add Note</button>
          </div>
        </div>
      </div>
    </div>
  );
}
