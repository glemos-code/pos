import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

function toNumberOrNaN(value) {
  return Number(value);
}

function parseCandidateRow(row) {
  const metadata = row.metadata || {};
  return {
    id: Number(metadata.id ?? row.id),
    name: String(metadata.name ?? ''),
    yearsExperience: Number(metadata.yearsExperience ?? 0),
    seniority: String(metadata.seniority ?? ''),
    skills: Array.isArray(metadata.skills) ? metadata.skills : [],
    salaryExpectation: Number(metadata.salaryExpectation ?? 0)
  };
}

function parseJobRow(row) {
  const metadata = row.metadata || {};
  const salaryRange = Array.isArray(metadata.salaryRange) ? metadata.salaryRange : [0, 0];

  return {
    id: Number(metadata.id ?? row.id),
    title: String(metadata.title ?? ''),
    minimumSeniority: String(metadata.minimumSeniority ?? ''),
    requiredSkills: Array.isArray(metadata.requiredSkills) ? metadata.requiredSkills : [],
    salaryRange: [Number(salaryRange[0] ?? 0), Number(salaryRange[1] ?? 0)]
  };
}

router.get('/candidates', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT id, metadata
        FROM public.candidates
        ORDER BY id
      `
    );

    res.status(200).json(rows.map(parseCandidateRow));
  } catch (error) {
    next(error);
  }
});

router.get('/candidates/:id', async (req, res, next) => {
  try {
    const id = toNumberOrNaN(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'invalid_id' });
    }

    const { rows } = await pool.query(
      `
        SELECT id, metadata
        FROM public.candidates
        WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'candidate_not_found' });
    }

    return res.status(200).json(parseCandidateRow(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.get('/jobs', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT id, metadata
        FROM public.jobs
        ORDER BY id
      `
    );

    res.status(200).json(rows.map(parseJobRow));
  } catch (error) {
    next(error);
  }
});

router.get('/jobs/:id', async (req, res, next) => {
  try {
    const id = toNumberOrNaN(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'invalid_id' });
    }

    const { rows } = await pool.query(
      `
        SELECT id, metadata
        FROM public.jobs
        WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'job_not_found' });
    }

    return res.status(200).json(parseJobRow(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.get('/history', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT candidate_id, job_id, label
        FROM public.match_history
        ORDER BY ctid
      `
    );

    res.status(200).json(
      rows.map((row) => ({
        candidateId: Number(row.candidate_id),
        jobId: Number(row.job_id),
        label: Number(row.label)
      }))
    );
  } catch (error) {
    next(error);
  }
});

export { router as readRoutes };
