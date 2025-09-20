import { db } from "./db.js";

export const seedJobs = async () => {
  const count = await db.jobs.count();
  if (count > 0) return; // Already seeded

  const initialJobs = [
    { id: Date.now() + 1, title: "Frontend Developer", preferredSkills: "React, JS, CSS", experience: "2+ years", roles: "Build UI components", status: "active", order: 0 },
    { id: Date.now() + 2, title: "Backend Developer", preferredSkills: "Node.js, Express, SQL", experience: "3+ years", roles: "Build APIs", status: "active", order: 1 },
    { id: Date.now() + 3, title: "Fullstack Developer", preferredSkills: "React, Node.js", experience: "3+ years", roles: "End-to-end development", status: "active", order: 2 }
  ];

  await db.jobs.bulkAdd(initialJobs);
  console.log("Jobs seeded!");
};

export const seedCandidates = async () => {
  const count = await db.candidates.count();
  if (count > 0) return;

  const initialCandidates = [
    { id: Date.now() + 1, name: "Alice", email: "alice@test.com", jobId: 1, stage: "Applied", notes: [] },
    { id: Date.now() + 2, name: "Bob", email: "bob@test.com", jobId: 2, stage: "Interview", notes: [] },
  ];

  await db.candidates.bulkAdd(initialCandidates);
  console.log("Candidates seeded!");
};
