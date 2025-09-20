import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAssessments from "../../hooks/useAssessments";

export default function AssessmentForm() {
  const { jobId } = useParams();
  const { assessment, loading, submitResponse } = useAssessments(jobId);
  const [answers, setAnswers] = useState({});

  if (loading) return <p>Loading assessment...</p>;
  if (!assessment?.sections?.length) return <p>No assessment available.</p>;

  const handleChange = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitResponse(answers);
    alert("Assessment submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded">
      <h2 className="text-xl font-bold">{assessment.title}</h2>

      {assessment.sections.map((sec, sIdx) => (
        <div key={sIdx} className="p-3 border rounded">
          <h3 className="font-semibold mb-2">{sec.title}</h3>

          {sec.questions.map(q => (
            <div key={q.id} className="mb-2">
              <label className="block font-medium mb-1">{q.text}</label>

              {q.type === "short-text" && <input type="text" className="border p-2 w-full rounded" onChange={e => handleChange(q.id, e.target.value)} />}
              {q.type === "long-text" && <textarea className="border p-2 w-full rounded" onChange={e => handleChange(q.id, e.target.value)} />}
              {q.type === "numeric" && <input type="number" className="border p-2 w-full rounded" onChange={e => handleChange(q.id, e.target.value)} />}
              {q.type === "file" && <input type="file" className="border p-2 w-full rounded" onChange={e => handleChange(q.id, e.target.files[0])} />}
              {q.type === "single-choice" && (
                <select className="border p-2 w-full rounded" onChange={e => handleChange(q.id, e.target.value)}>
                  <option value="">Select</option>
                  {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
              {q.type === "multi-choice" && q.options?.map(opt => (
                <label key={opt} className="block">
                  <input type="checkbox" onChange={e => {
                    const prev = answers[q.id] || [];
                    const updated = e.target.checked ? [...prev, opt] : prev.filter(v => v !== opt);
                    handleChange(q.id, updated);
                  }} /> {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Assessment</button>
    </form>
  );
}
