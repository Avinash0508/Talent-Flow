import React, { useState, useEffect } from "react";
import useJobs from "../../hooks/useJobs.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import JobModal from "./JobModal.jsx";
import { useNavigate } from "react-router-dom";

export default function JobsList() {
  const { jobs, loading, addJob, editJob, archiveJob, restoreJob, reorderJobs, deleteJob } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedCandidates = JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(storedCandidates);
  }, []);

  if (loading) return <p className="text-gray-500">Loading jobs...</p>;

  const activeJobs = jobs.filter(job => job.status === "active").sort((a, b) => a.order - b.order);
  const archivedJobs = jobs.filter(job => job.status === "archived").sort((a, b) => a.order - b.order);

  const handleSave = (jobData) => {
    if (editingJob) {
      editJob(jobData.id, jobData);
    } else {
      addJob(jobData);
    }
    setModalOpen(false);
    setEditingJob(null);
  };


  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newActiveJobs = Array.from(activeJobs);
    const [movedJob] = newActiveJobs.splice(result.source.index, 1);
    newActiveJobs.splice(result.destination.index, 0, movedJob);

    
    const updatedJobs = [
      ...newActiveJobs.map((job, index) => ({ ...job, order: index })),
      ...archivedJobs
    ];

    reorderJobs(updatedJobs); 
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
      >
        + Add Job
      </button>

      
      <h3 className="text-xl font-semibold text-green-700">Active Jobs</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="active-jobs">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {activeJobs.map((job, index) => {
                const jobCandidates = candidates.filter(c => String(c.jobId) === String(job.id));
                return (
                  <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        style={provided.draggableProps.style}
                      >
                        <span {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600 mr-3 select-none">
                          ≡
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-gray-600 text-sm">Skills: {job.preferredSkills}</p>
                          <p className="text-gray-600 text-sm">Experience: {job.experience}</p>
                          <p className="text-gray-600 text-sm">Roles: {job.roles}</p>
                          
                          <div className="mt-2 space-x-2">
                            <button
                              onClick={() => { setEditingJob(job); setModalOpen(true); }}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => archiveJob(job.id)}
                              className="bg-orange-500 text-white px-3 py-1.5 rounded-lg shadow hover:bg-yellow-600 transition"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => navigate(`/candidates?jobId=${job.id}`)}
                              className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow hover:bg-indigo-600 transition"
                            >
                              View Candidates
                            </button>
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

    
      {archivedJobs.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-red-700">Archived Jobs</h3>
          <ul className="space-y-3">
            {archivedJobs.map(job => (
              <li key={job.id} className="bg-gray-100 text-gray-500 p-4 rounded-lg border border-gray-300">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm">Skills: {job.preferredSkills}</p>
                <p className="text-sm">Experience: {job.experience}</p>
                <p className="text-sm">Roles: {job.roles}</p>
                <div className="mt-2">
                  <button
                    onClick={() => restoreJob(job.id)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    Restore
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

     
      <JobModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingJob(null); }}
        onSave={handleSave}
        initialData={editingJob}
      />
    </div>
  );
}

