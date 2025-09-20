import React, { useState, useEffect } from "react";

export default function CandidateModal({ isOpen, onClose, onSave, candidate, jobs }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobId, setJobId] = useState("");
  const [stage, setStage] = useState("Applied");

  // Pre-fill fields when editing
  useEffect(() => {
    if (candidate) {
      setName(candidate.name || "");
      setEmail(candidate.email || "");
      setJobId(candidate.jobId || "");
      setStage(candidate.stage || "Applied");
    } else {
      setName("");
      setEmail("");
      setJobId("");
      setStage("Applied");
    }
  }, [candidate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({
      name: name.trim(),
      email: email.trim(),
      jobId: jobId || null,
      stage,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{candidate ? "Edit Candidate" : "Add Candidate"}</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          {/* Job selection: only active jobs */}
          <select
            value={jobId}
            onChange={e => setJobId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Job</option>
            {jobs.filter(j => !j.archived).map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>

          {/* Stage selection */}
          <select
            value={stage}
            onChange={e => setStage(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {["Applied","Shortlisted","Interviewing","Offered","Hired","Rejected"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {candidate ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
