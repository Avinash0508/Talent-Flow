import React, { useMemo, useState } from "react";
import useCandidates, { STAGES } from "../../hooks/useCandidates";
import useJobs from "../../hooks/useJobs";
import CandidateModal from "./CandidateModal";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CandidatesPage() {
  const { candidates, addCandidate, editCandidate, deleteCandidate, updateStage, addNote } = useCandidates();
  const { jobs } = useJobs();
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates.filter(c => {
      
      if (jobIdFilter && String(c.jobId) !== String(jobIdFilter)) return false;

      if (stageFilter !== "all" && c.stage !== stageFilter) return false;

      if (jobStatusFilter !== "all") {
        const job = jobs.find(j => j.id === c.jobId);
        if (!job) return false;
        if (jobStatusFilter === "active" && job.status === "archived") return false;
        if (jobStatusFilter === "archived" && job.status !== "archived") return false;
      }

      if (!q) return true;
      return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q);
    });
  }, [candidates, query, stageFilter, jobStatusFilter, jobs, jobIdFilter]); 

  const handleNoteChange = (id, text) => setNoteInputs(prev => ({ ...prev, [id]: text }));
  const handleAddNote = (id) => {
    if (noteInputs[id]?.trim()) {
      addNote(id, noteInputs[id].trim());
      setNoteInputs(prev => ({ ...prev, [id]: "" }));
    }
  };
  const handleDeleteNote = (candidateId, noteId) => {
    addNote(candidateId, null, noteId);
  };
  
  const filteredJob = useMemo(() => {
    if (!jobIdFilter) return null;
    return jobs.find(j => String(j.id) === String(jobIdFilter));
  }, [jobIdFilter, jobs]);

  return (
    <div className="p-4">
     
      {filteredJob && (
        <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-4 rounded-md flex justify-between items-center shadow">
          <div>
            <p className="font-bold">Filtering by Job</p>
            <p>Showing candidates for "{filteredJob.title}".</p>
          </div>
          <button
            onClick={() => navigate('/candidates')}
            className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow hover:bg-indigo-600 transition text-sm"
          >
            Clear Filter
          </button>
        </div>
      )}

      
      <div className="flex gap-3 items-center mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search name or email"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={jobStatusFilter}
          onChange={e => setJobStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active Jobs</option>
          <option value="archived">Archived Jobs</option>
        </select>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add
        </button>
      </div>

      
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filtered.map(c => {
          const job = jobs.find(j => j.id === c.jobId);
          return (
            <div key={c.id} className="bg-white rounded-lg shadow p-3 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div onClick={() => navigate(`/candidates/${c.id}`)} className="cursor-pointer">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.email}</div>
                  <div className="text-xs text-gray-500">Job: {job?.title || "N/A"}</div>
                  <div className="text-xs mt-1"><strong>{c.stage}</strong></div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setEditing(c); setIsModalOpen(true); }} className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => deleteCandidate(c.id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
              </div>

              
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">Move Stage:</label>
                <select
                  value={c.stage}
                  onChange={e => updateStage(c.id, e.target.value)}
                  className="border px-2 py-1 rounded-lg text-sm"
                >
                  {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                </select>
              </div>

              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Notes:</label>
                <ul className="pl-4 list-disc text-gray-700">
                  {(c.notes || []).map(n => (
                    <li key={n.id} className="flex justify-between items-center text-sm">
                      <span>{n.text}</span>
                      <button
                        onClick={() => handleDeleteNote(c.id, n.id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Add note..."
                    value={noteInputs[c.id] || ""}
                    onChange={e => handleNoteChange(c.id, e.target.value)}
                    className="border px-2 py-1 rounded-lg flex-1 text-sm"
                  />
                  <button
                    onClick={() => handleAddNote(c.id)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700 transition text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        onSave={data => {
          const candidateData = { ...data, jobId: Number(data.jobId) };
          if (editing) editCandidate(editing.id, candidateData);
          else addCandidate(candidateData);
        }}
        candidate={editing}
        jobs={jobs}
      />
    </div>
  );

}
