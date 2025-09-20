import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAssessments from "../../hooks/useAssessments";

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  // Import the new deleteAssessment function from the hook
  const { assessments, loading, saveAssessment, deleteAssessment } = useAssessments(jobId);
  
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (selectedAssessment) {
      setSections(selectedAssessment.sections);
    } else {
      setSections([]);
    }
  }, [selectedAssessment]);

  // Handle cases where the selected assessment is deleted, or on initial load
  useEffect(() => {
    const isSelectedAssessmentStillPresent = assessments.some(a => a.id === selectedAssessment?.id);
    if (assessments.length > 0 && !isSelectedAssessmentStillPresent) {
      setSelectedAssessment(assessments[0]);
    } else if (assessments.length === 0) {
      setSelectedAssessment(null);
    }
  }, [assessments, selectedAssessment]);

  const addSection = () => {
    setSections(prev => [...prev, { title: `New Section ${prev.length + 1}`, questions: [] }]);
  };

  const addQuestion = (sectionIdx, type = "short-text") => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      type,
      text: "",
      options: type.includes("choice") ? ["Option 1", "Option 2"] : undefined,
    };
    setSections(prev => {
      const newSections = JSON.parse(JSON.stringify(prev));
      newSections[sectionIdx].questions.push(newQuestion);
      return newSections;
    });
  };
  
  const deleteSection = (sectionIndex) => {
    if (!window.confirm("Are you sure you want to delete this section and all its questions?")) return;
    setSections(prev => prev.filter((_, idx) => idx !== sectionIndex));
  };
  
  const deleteQuestion = (sectionIndex, questionIndex) => {
    setSections(prev => {
        const newSections = JSON.parse(JSON.stringify(prev));
        newSections[sectionIndex].questions.splice(questionIndex, 1);
        return newSections;
    });
  };

  const updateQuestionText = (sectionIdx, qIdx, text) => {
    setSections(prev => {
      const newSections = JSON.parse(JSON.stringify(prev));
      newSections[sectionIdx].questions[qIdx].text = text;
      return newSections;
    });
  };

  const handleSave = async () => {
    if (!selectedAssessment) {
      alert("No assessment selected to save.");
      return;
    }
    await saveAssessment(selectedAssessment.id, sections);
    alert(`${selectedAssessment.sections[0].title} saved!`);
  };

  if (loading) return <p>Loading assessment builder...</p>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">📝 Assessment Builder</h2>

      <div className="p-3 border rounded bg-gray-50">
        <label className="block font-medium mb-2">Select Assessment to Edit:</label>
        <div className="flex flex-col gap-2">
          {assessments.map(assessment => (
            <div key={assessment.id} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedAssessment(assessment)}
                className={`flex-grow text-left px-3 py-2 rounded font-semibold ${selectedAssessment?.id === assessment.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {assessment.sections[0]?.title || `Assessment ID: ${assessment.id}`}
              </button>
              {/* DELETE ASSESSMENT BUTTON */}
              <button 
                onClick={() => deleteAssessment(assessment.id)}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 font-bold"
                title="Delete Assessment"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedAssessment && (
        <div>
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="p-3 border rounded mb-3 relative">
              {/* DELETE SECTION BUTTON */}
              <button 
                onClick={() => deleteSection(sIdx)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
              >
                Delete Section
              </button>
              <input 
                type="text" 
                value={sec.title}
                onChange={(e) => {
                    const newTitle = e.target.value;
                    setSections(prev => {
                        const newSections = JSON.parse(JSON.stringify(prev));
                        newSections[sIdx].title = newTitle;
                        return newSections;
                    });
                }}
                className="text-lg font-semibold mb-2 w-full border-b pb-1 focus:outline-none focus:border-blue-500"
              />
              {sec.questions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="my-3 p-2 border-l-4 border-gray-200 flex items-start gap-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Enter question text..."
                      className="w-full p-2 border rounded mb-2"
                      value={q.text}
                      onChange={e => updateQuestionText(sIdx, qIdx, e.target.value)}
                    />
                    <div className="text-xs text-gray-500 font-mono">Type: {q.type}</div>
                  </div>
                  {/* DELETE QUESTION BUTTON */}
                  <button 
                    onClick={() => deleteQuestion(sIdx, qIdx)}
                    className="bg-gray-200 text-red-600 px-2 py-1 rounded hover:bg-red-200 text-sm mt-1"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-2 border-t pt-3">
                <button onClick={() => addQuestion(sIdx, "short-text")} className="px-2 py-1 bg-gray-200 rounded text-sm">Short Text</button>
                <button onClick={() => addQuestion(sIdx, "long-text")} className="px-2 py-1 bg-gray-300 rounded text-sm">Long Text</button>
                <button onClick={() => addQuestion(sIdx, "numeric")} className="px-2 py-1 bg-gray-400 rounded text-sm">Numeric</button>
                <button onClick={() => addQuestion(sIdx, "single-choice")} className="px-2 py-1 bg-gray-500 rounded text-white text-sm">Single Choice</button>
                <button onClick={() => addQuestion(sIdx, "multi-choice")} className="px-2 py-1 bg-gray-600 rounded text-white text-sm">Multi Choice</button>
                <button onClick={() => addQuestion(sIdx, "file")} className="px-2 py-1 bg-gray-700 rounded text-white text-sm">File</button>
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button onClick={addSection} className="px-4 py-2 bg-yellow-400 rounded font-semibold">Add Section</button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded font-semibold">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
