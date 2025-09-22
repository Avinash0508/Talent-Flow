import { rest } from "msw";
import { db } from "../services/db.js";

const simulateDelay = () => new Promise(res => setTimeout(res, 200 + Math.random()*1000));
const simulateError = (chance=0.1) => Math.random() < chance;

export const handlers = [
  
  rest.get("/jobs", async (req, res, ctx) => {
    await simulateDelay();
    const jobs = await db.jobs.toArray();
    return res(ctx.json(jobs));
  }),

  rest.post("/jobs", async (req, res, ctx) => {
    await simulateDelay();
    if(simulateError()) return res(ctx.status(500), ctx.json({message:"Random failure"}));
    const job = await db.jobs.add(await req.json());
    return res(ctx.json(job));
  }),

  rest.patch("/jobs/:id", async (req, res, ctx) => {
    await simulateDelay();
    const id = Number(req.params.id);
    const data = await req.json();
    if(simulateError()) return res(ctx.status(500));
    await db.jobs.update(id, data);
    return res(ctx.json({ id, ...data }));
  }),

  rest.patch("/jobs/:id/reorder", async (req, res, ctx) => {
    await simulateDelay();
    if(simulateError(0.1)) return res(ctx.status(500));
    return res(ctx.json({ success: true }));
  }),

  
  rest.get("/candidates", async (req,res,ctx) => {
    await simulateDelay();
    const candidates = await db.candidates.toArray();
    return res(ctx.json(candidates));
  }),

  rest.post("/candidates", async (req,res,ctx) => {
    await simulateDelay();
    if(simulateError()) return res(ctx.status(500));
    const c = await db.candidates.add(await req.json());
    return res(ctx.json(c));
  }),

  rest.patch("/candidates/:id", async (req,res,ctx) => {
    await simulateDelay();
    const id = Number(req.params.id);
    if(simulateError()) return res(ctx.status(500));
    const data = await req.json();
    await db.candidates.update(id, data);
    return res(ctx.json({ id, ...data }));
  }),

  rest.get("/candidates/:id/timeline", async (req,res,ctx) => {
    await simulateDelay();
    const id = Number(req.params.id);
    const candidate = await db.candidates.get(id);
    return res(ctx.json(candidate?.timeline || []));
  }),

  rest.get("/assessments/:jobId", async (req,res,ctx) => {
    await simulateDelay();
    const jobId = Number(req.params.jobId);
    const assessment = await db.assessments.get(jobId);
    return res(ctx.json(assessment || { jobId, sections: [] }));
  }),

  rest.put("/assessments/:jobId", async (req,res,ctx) => {
    await simulateDelay();
    const jobId = Number(req.params.jobId);
    const data = await req.json();
    await db.assessments.put({ jobId, ...data });
    return res(ctx.json({ jobId, ...data }));
  }),

  rest.post("/assessments/:jobId/submit", async (req,res,ctx) => {
    await simulateDelay();
    const jobId = Number(req.params.jobId);
    const data = await req.json();
    const submissions = await db.table("assessment_submissions")?.toArray().catch(()=>[]);
    await db.table("assessment_submissions")?.add({ jobId, data });
    return res(ctx.json({ success: true }));
  })
];

