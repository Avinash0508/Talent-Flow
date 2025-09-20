import React from "react";
import { Link } from "react-router-dom";
import useJobs from "../../hooks/useJobs.js";

export default function AssessmentsPage() {
  const { jobs } = useJobs();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">📋 Assessments</h2>

      {jobs.length === 0 && <p>No jobs available. Please add a job first.</p>}

      <ul className="space-y-3">
        {jobs.map(job => (
          <li key={job.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/assessments/${job.id}`}
                className="bg-green-700 hover:bg-green-500 text-white px-3 py-2 rounded-xl font-bold"
              >
                Build / Edit
              </Link>
              <Link to={`/assessments/${job.id}/preview`} className="bg-purple-700 hover:bg-purple-500 text-white px-3 py-2 rounded-xl font-bold">
  Preview
</Link>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
