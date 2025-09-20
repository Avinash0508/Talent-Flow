import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function JobDetails() {
  const { id } = useParams();

  return (
    <motion.div
      className="p-6 bg-yellow-100 rounded-2xl shadow-lg border-4 border-yellow-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 className="text-2xl font-bold text-yellow-700">📋 Job Details</h2>
      <p className="mt-4 text-gray-700">Showing details for job ID: <b>{id}</b></p>
      <p className="mt-2">Description, requirements, tags will appear here...</p>
    </motion.div>
  );
}
