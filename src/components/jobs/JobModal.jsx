import React, { useState, useEffect, useRef } from "react";

export default function JobModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [roles, setRoles] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSkills(initialData.preferredSkills || "");
      setExperience(initialData.experience || "");
      setRoles(initialData.roles || "");
    } else {
      setTitle("");
      setSkills("");
      setExperience("");
      setRoles("");
    }
  }, [initialData]);

  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...initialData,
      id: initialData?.id || Date.now(),
      title,
      preferredSkills: skills,
      experience,
      roles,
      archived: initialData?.archived || false,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative cursor-move"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setDragImage(new Image(), 0, 0); 
        }}
        onDrag={(e) => {
          if (e.clientX === 0 && e.clientY === 0) return; 
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.left = `${e.clientX - e.currentTarget.offsetWidth / 2}px`;
          e.currentTarget.style.top = `${e.clientY - 20}px`;
        }}
      >
       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Job" : "Add New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roles & Responsibilities
            </label>
            <textarea
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              rows="3"
              className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              {initialData ? "Save Changes" : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

