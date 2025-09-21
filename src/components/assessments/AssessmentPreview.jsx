import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import useAssessments from "../../hooks/useAssessments";

// Helper component to render the correct input based on question type
const QuestionInput = ({ question, answer, onAnswerChange }) => {
  const handleMultiChoiceChange = (option, isChecked) => {
    const currentAnswers = answer || {};
    const newAnswers = { ...currentAnswers, [option]: isChecked };
    onAnswerChange(question.id, newAnswers);
  };

  const handleNumericChange = (e) => {
    const value = e.target.value;
    // Allow the field to be empty or only contain integers from 1 to 10.
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 10)) {
      onAnswerChange(question.id, value);
    }
  };

  switch (question.type) {
    case "short-text":
      return (
        <input
          type="text"
          className="w-full p-2 border rounded mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={answer || ""}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
        />
      );
    case "long-text":
      return (
        <textarea
          rows="4"
          className="w-full p-2 border rounded mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={answer || ""}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
        />
      );
    case "numeric":
      return (
        <input
          type="number"
          min="1"
          max="10"
          className="w-full p-2 border rounded mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={answer || ""}
          onChange={handleNumericChange}
          placeholder="Enter a number from 1 to 10"
        />
      );
    case "single-choice":
      return (
        <div className="space-y-2 mt-2">
          {question.options?.map((option) => (
            <label 
              key={`${question.id}-${option}`} // FIX: More specific key for React
              className={`flex items-center space-x-3 p-2 rounded border cursor-pointer transition-colors duration-150 ${
                answer === option
                  ? 'bg-indigo-100 border-indigo-400'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name={String(question.id)}
                value={option}
                checked={answer === option}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );
    case "multi-choice":
      return (
        <div className="space-y-2 mt-2">
          {question.options?.map((option) => (
            <label 
              key={`${question.id}-${option}`} // FIX: More specific key for React
              className="flex items-center space-x-3 p-2 rounded hover:bg-indigo-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!(answer && answer[option])}
                onChange={(e) => handleMultiChoiceChange(option, e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );
    case "file":
      return (
        <input
          type="file"
          className="w-full text-sm text-gray-500 mt-2
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          onChange={(e) => onAnswerChange(question.id, e.target.files[0])}
        />
      );
    default:
      return <p className="text-red-500 text-sm">Unsupported question type.</p>;
  }
};


export default function AssessmentPreview() {
  const { jobId } = useParams();
  const { assessments, loading } = useAssessments(jobId);
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assessment Responses:", answers);
    alert("Form submitted successfully! Check the console for the output.");
  };

  if (loading) return <p>Loading previews...</p>;
  if (!assessments || !assessments.length) return <p>No assessments created yet for this job.</p>;

  return (
    <motion.div
      className="p-6 bg-indigo-50 rounded-2xl shadow-lg border-2 border-indigo-200"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Candidate Assessment</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {assessments.map((assessment, idx) => (
            <div key={idx}>
              {assessment.sections.map((sec, sIdx) => (
                <div key={sIdx} className="bg-white p-6 rounded-xl shadow-md border">
                  <h3 className="text-2xl font-semibold text-gray-900 border-b pb-3 mb-4">{sec.title}</h3>
                  <div className="space-y-6">
                    {sec.questions.map((q, qIdx) => (
                      <div key={q.id || qIdx}>
                        <label className="font-medium text-gray-700">
                          {qIdx + 1}. {q.text || "<Question text>"}
                        </label>
                        <QuestionInput
                          question={q}
                          answer={answers[q.id]}
                          onAnswerChange={handleAnswerChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Assessment
          </button>
        </div>
      </form>
    </motion.div>
  );
}
