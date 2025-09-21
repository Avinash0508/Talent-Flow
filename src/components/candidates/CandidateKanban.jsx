import React, { useMemo, useState } from "react";
import useCandidates, { STAGES } from "../../hooks/useCandidates"
import useJobs from "../../hooks/useJobs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function CandidateKanban() {
  const { candidates, updateStage } = useCandidates();
  const { jobs } = useJobs();

  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  // To fetch the Filtered candidates
  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates.filter(c => {
      
      if (stageFilter !== "all" && c.stage !== stageFilter) return false;

      
      if (jobStatusFilter !== "all") {
        const job = jobs.find(j => String(j.id) === String(c.jobId));
        if (!job) return false;
        if (jobStatusFilter === "active" && job.archived) return false;
        if (jobStatusFilter === "archived" && !job.archived) return false;
      }

      
      if (!q) return true;
      return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q);
    });
  }, [candidates, query, stageFilter, jobStatusFilter, jobs]);

  const columns = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = filteredCandidates.filter(c => c.stage === stage);
      return acc;
    }, {});
  }, [filteredCandidates]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const candId = Number(draggableId);
    const destStage = destination.droppableId;
    updateStage(candId, destStage);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search name or email"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Stages</option>
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
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {STAGES.map(stage => (
            <div key={stage} className="min-w-[260px] bg-gray-50 p-2 rounded">
              <h3 className="font-semibold mb-2">{stage} ({columns[stage].length})</h3>
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[50px]"
                  >
                    {columns[stage].map((c, idx) => (
                      <Draggable key={c.id} draggableId={String(c.id)} index={idx}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="bg-white p-3 rounded shadow cursor-pointer"
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-gray-600">{c.email}</div>
                            <div className="text-xs text-gray-500">
                              Job: {jobs.find(j => String(j.id) === String(c.jobId))?.title || "N/A"}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

