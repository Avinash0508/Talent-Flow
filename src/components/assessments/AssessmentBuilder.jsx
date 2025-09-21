import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAssessments from "../../hooks/useAssessments";

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  const { assessments, loading, saveAssessment, addAssessment, deleteAssessment } = useAssessments(jobId);
  
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (selectedAssessment) {
      setSections(selectedAssessment.sections);
    } else {
      setSections([]);
    }
  }, [selectedAssessment]);

  useEffect(() => {
    if (!selectedAssessment && assessments.length > 0) {
      setSelectedAssessment(assessments[0]);
    }
    if (selectedAssessment && !assessments.find(a => a.id === selectedAssessment.id)) {
      setSelectedAssessment(assessments.length > 0 ? assessments[0] : null);
    }
  }, [assessments, selectedAssessment]);

  const handleDeleteAssessment = async (assessmentId, assessmentTitle) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${assessmentTitle}"? This action cannot be undone.`);
    if (isConfirmed) {
      await deleteAssessment(assessmentId);
    }
  };

  const updateState = (updateFunction) => {
    setSections(prev => {
      const newSections = JSON.parse(JSON.stringify(prev));
      updateFunction(newSections);
      return newSections;
    });
  };

  const addQuestion = (sectionIdx, type = "short-text") => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      type,
      text: "",
      options: type.includes("choice") ? ["Option 1"] : undefined,
    };
    updateState(newSections => newSections[sectionIdx].questions.push(newQuestion));
  };
  
  const removeQuestion = (sectionIdx, qIdx) => {
    updateState(newSections => {
      newSections[sectionIdx].questions.splice(qIdx, 1);
    });
  };

  const updateQuestionText = (sectionIdx, qIdx, text) => {
    updateState(newSections => newSections[sectionIdx].questions[qIdx].text = text);
  };

  const addOption = (sectionIdx, qIdx) => {
    updateState(newSections => {
      const question = newSections[sectionIdx].questions[qIdx];
      if (!question.options) question.options = [];
      question.options.push(`Option ${question.options.length + 1}`);
    });
  };

  const updateOptionText = (sectionIdx, qIdx, optionIdx, text) => {
    updateState(newSections => {
      newSections[sectionIdx].questions[qIdx].options[optionIdx] = text;
    });
  };

  const removeOption = (sectionIdx, qIdx, optionIdx) => {
    updateState(newSections => {
      newSections[sectionIdx].questions[qIdx].options.splice(optionIdx, 1);
    });
  };

  const handleSave = async () => {
    if (!selectedAssessment) {
      alert("No assessment selected to save.");
      return;
    }
    await saveAssessment(selectedAssessment.id, sections);
    alert(`'${sections[0]?.title || 'Assessment'}' saved!`);
  };

  if (loading) return <p>Loading assessment builder...</p>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">📝 Assessment Builder</h2>

      <div className="p-3 border rounded bg-gray-50">
        <label className="block font-medium mb-1">Select Assessment to Edit:</label>
        <div className="flex gap-2 flex-wrap">
          {assessments.map(assessment => {
            const title = assessment.sections[0]?.title || `Assessment ID: ${assessment.id}`;
            return (
              <div key={assessment.id} className="relative group flex items-center">
                <button
                  onClick={() => setSelectedAssessment(assessment)}
                  className={`pl-3 pr-8 py-2 rounded font-semibold transition-colors ${selectedAssessment?.id === assessment.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {title}
                </button>
                <button
                  onClick={() => handleDeleteAssessment(assessment.id, title)}
                  className="absolute top-0 right-0 h-full w-7 flex items-center justify-center text-gray-500 hover:text-red-600 bg-gray-200/50 hover:bg-gray-300/80 rounded-r opacity-0 group-hover:opacity-100 transition-opacity text-xl font-bold"
                  title={`Delete ${title}`}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAssessment && (
        <div>
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
              <input 
                type="text" 
                value={sec.title}
                onChange={(e) => {
                    const newTitle = e.target.value;
                    updateState(newSections => newSections[sIdx].title = newTitle);
                }}
                className="text-xl font-semibold mb-3 w-full border-b-2 pb-1 focus:outline-none focus:border-indigo-500"
              />
              {sec.questions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="relative my-4 p-3 pt-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg">
                  <button
                    onClick={() => removeQuestion(sIdx, qIdx)}
                    className="absolute top-1 right-1 px-2 py-0 leading-tight text-xl text-red-500 hover:bg-red-100 rounded-full font-bold"
                    title="Remove Question"
                  >
                    &times;
                  </button>
                  
                  <input
                    type="text"
                    placeholder="Enter question text..."
                    className="w-full p-2 border rounded mb-2"
                    value={q.text}
                    onChange={e => updateQuestionText(sIdx, qIdx, e.target.value)}
                  />
                  
                  {q.type.includes("choice") && (
                    <div className="pl-4 mt-3 space-y-2 border-t pt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Options:</h4>
                      {q.options?.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => updateOptionText(sIdx, qIdx, oIdx, e.target.value)}
                            className="w-full p-2 border rounded-md text-sm shadow-sm"
                            placeholder={`Option ${oIdx + 1} text`}
                          />
                          <button
                            onClick={() => removeOption(sIdx, qIdx, oIdx)}
                            className="px-2 py-1 text-red-600 hover:bg-red-100 rounded-full text-lg font-bold"
                            title="Remove Option"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(sIdx, qIdx)}
                        className="text-sm mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 font-medium"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 font-mono mt-2">Type: {q.type}</div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-2 border-t pt-4">
                <button onClick={() => addQuestion(sIdx, "short-text")} className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Short Text</button>
                <button onClick={() => addQuestion(sIdx, "long-text")} className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Long Text</button>
                <button onClick={() => addQuestion(sIdx, "numeric")} className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Numeric</button>
                <button onClick={() => addQuestion(sIdx, "single-choice")} className="px-3 py-1 bg-blue-200 rounded-md text-sm font-medium hover:bg-blue-300">Single Choice</button>
                <button onClick={() => addQuestion(sIdx, "multi-choice")} className="px-3 py-1 bg-blue-200 rounded-md text-sm font-medium hover:bg-blue-300">Multi Choice</button>
                <button onClick={() => addQuestion(sIdx, "file")} className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">File Upload</button>
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-6">
            <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700">Save Changes</button>

          </div>
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <button 
          onClick={addAssessment} 
          className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold shadow-md"
        >
          + Add New Assessment
        </button>
      </div>
    </div>
  );
}
