import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function parseId(raw) {
  const id = Number(raw);
  if (!isPositiveInteger(id)) {
    return { ok: false, message: 'id must be a positive integer.' };
  }

  return { ok: true, value: id };
}

function parseSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCandidatePayload(payload, forcedId) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, message: 'body must be a JSON object.' };
  }

  const id = forcedId ?? Number(payload.id);
  if (!isPositiveInteger(id)) {
    return { ok: false, message: 'candidate id must be a positive integer.' };
  }

  const metadata = {
    id,
    name: String(payload.name ?? '').trim(),
    yearsExperience: Number(payload.yearsExperience ?? 0),
    seniority: String(payload.seniority ?? '').trim(),
    skills: parseSkills(payload.skills),
    salaryExpectation: Number(payload.salaryExpectation ?? 0)
  };

  if (!metadata.name) return { ok: false, message: 'name is required.' };
  if (!Number.isFinite(metadata.yearsExperience)) return { ok: false, message: 'yearsExperience must be a finite number.' };
  if (!metadata.seniority) return { ok: false, message: 'seniority is required.' };
  if (!metadata.skills.length) return { ok: false, message: 'skills must contain at least one value.' };
  if (!Number.isFinite(metadata.salaryExpectation)) return { ok: false, message: 'salaryExpectation must be a finite number.' };

  return { ok: true, value: metadata };
}

function normalizeJobPayload(payload, forcedId) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, message: 'body must be a JSON object.' };
  }

  const id = forcedId ?? Number(payload.id);
  if (!isPositiveInteger(id)) {
    return { ok: false, message: 'job id must be a positive integer.' };
  }

  const range = Array.isArray(payload.salaryRange) ? payload.salaryRange : [];

  const metadata = {
    id,
    title: String(payload.title ?? '').trim(),
    minimumSeniority: String(payload.minimumSeniority ?? '').trim(),
    requiredSkills: parseSkills(payload.requiredSkills),
    salaryRange: [Number(range[0] ?? 0), Number(range[1] ?? 0)]
  };

  if (!metadata.title) return { ok: false, message: 'title is required.' };
  if (!metadata.minimumSeniority) return { ok: false, message: 'minimumSeniority is required.' };
  if (!metadata.requiredSkills.length) return { ok: false, message: 'requiredSkills must contain at least one value.' };
  if (!Number.isFinite(metadata.salaryRange[0]) || !Number.isFinite(metadata.salaryRange[1])) {
    return { ok: false, message: 'salaryRange must contain finite numbers.' };
  }

  return { ok: true, value: metadata };
}

router.post('/candidates', async (req, res, next) => {
  const validation = normalizeCandidatePayload(req.body);
  if (!validation.ok) {
    res.status(400).json({ error: 'validation_error', message: validation.message });
    return;
  }

  try {
    await pool.query(
      `
        INSERT INTO public.candidates (id, metadata)
        VALUES ($1, $2::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET metadata = EXCLUDED.metadata
      `,
      [validation.value.id, JSON.stringify(validation.value)]
    );

    res.status(200).json(validation.value);
  } catch (error) {
    next(error);
  }
});

router.put('/candidates/:id', async (req, res, next) => {
  const parsedId = parseId(req.params.id);
  if (!parsedId.ok) {
    res.status(400).json({ error: 'validation_error', message: parsedId.message });
    return;
  }

  const validation = normalizeCandidatePayload(req.body, parsedId.value);
  if (!validation.ok) {
    res.status(400).json({ error: 'validation_error', message: validation.message });
    return;
  }

  try {
    const result = await pool.query(
      `
        UPDATE public.candidates
        SET metadata = $2::jsonb
        WHERE id = $1
      `,
      [parsedId.value, JSON.stringify(validation.value)]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'candidate_not_found' });
      return;
    }

    res.status(200).json(validation.value);
  } catch (error) {
    next(error);
  }
});

router.post('/jobs', async (req, res, next) => {
  const validation = normalizeJobPayload(req.body);
  if (!validation.ok) {
    res.status(400).json({ error: 'validation_error', message: validation.message });
    return;
  }

  try {
    await pool.query(
      `
        INSERT INTO public.jobs (id, metadata)
        VALUES ($1, $2::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET metadata = EXCLUDED.metadata
      `,
      [validation.value.id, JSON.stringify(validation.value)]
    );

    res.status(200).json(validation.value);
  } catch (error) {
    next(error);
  }
});

router.put('/jobs/:id', async (req, res, next) => {
  const parsedId = parseId(req.params.id);
  if (!parsedId.ok) {
    res.status(400).json({ error: 'validation_error', message: parsedId.message });
    return;
  }

  const validation = normalizeJobPayload(req.body, parsedId.value);
  if (!validation.ok) {
    res.status(400).json({ error: 'validation_error', message: validation.message });
    return;
  }

  try {
    const result = await pool.query(
      `
        UPDATE public.jobs
        SET metadata = $2::jsonb
        WHERE id = $1
      `,
      [parsedId.value, JSON.stringify(validation.value)]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'job_not_found' });
      return;
    }

    res.status(200).json(validation.value);
  } catch (error) {
    next(error);
  }
});

export { router as writeRoutes };
