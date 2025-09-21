import { useState, useEffect, useCallback } from "react";
import { db } from "../../src/services/db.js";

// Default skills and roles for jobs
const jobDefaults = Array.from({ length: 25 }).map((_, i) => ({
  preferredSkills: ["React", "Node.js", "CSS", "SQL", "Docker"][i % 5],
  experience: `${1 + (i % 5)}+ years`,
  roles: ["Frontend", "Backend", "Fullstack", "DevOps", "QA"][i % 5]
}));

export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      const allJobs = await db.jobs.orderBy("order").toArray();
      if (isMounted) {
        setJobs(allJobs);
        setLoading(false);
      }
    };
    fetchJobs();
    return () => { isMounted = false; };
  }, []);

  const addJob = useCallback(async (job) => {
    const maxOrder = (await db.jobs.orderBy("order").last())?.order ?? -1;
    const index = jobs.length % jobDefaults.length;
    const newJob = {
      id: Date.now(),
      title: job.title || `Job ${jobs.length + 1}`,
      slug: (job.slug || `job-${jobs.length + 1}`),
      status: "active",
      order: maxOrder + 1,
      // FIX: Use nullish coalescing (??) to correctly save empty strings from the form
      preferredSkills: job.preferredSkills ?? jobDefaults[index].preferredSkills,
      experience: job.experience ?? jobDefaults[index].experience,
      roles: job.roles ?? jobDefaults[index].roles
    };

    await db.jobs.add(newJob);
    setJobs(await db.jobs.orderBy("order").toArray());
  }, [jobs]);

  const editJob = useCallback(async (id, updates) => {
    await db.jobs.update(id, updates);
    setJobs(await db.jobs.orderBy("order").toArray());
  }, []);

  const archiveJob = useCallback(async (id) => {
    await db.jobs.update(id, { status: "archived" });
    setJobs(await db.jobs.orderBy("order").toArray());
  }, []);

  const restoreJob = useCallback(async (id) => {
    await db.jobs.update(id, { status: "active" });
    setJobs(await db.jobs.orderBy("order").toArray());
  }, []);

  const reorderJobs = useCallback(async (updatedJobs) => {
    setJobs(updatedJobs);
    await Promise.all(updatedJobs.map((job, index) => db.jobs.update(job.id, { order: index })));
  }, []);

  const deleteJob = useCallback(async (id) => {
    await db.jobs.delete(id);
    setJobs(await db.jobs.orderBy("order").toArray());
  }, []);

  return { jobs, loading, addJob, editJob, archiveJob, restoreJob, reorderJobs, deleteJob };
}
