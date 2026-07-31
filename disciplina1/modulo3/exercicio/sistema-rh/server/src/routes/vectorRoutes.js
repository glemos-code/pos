import { Router } from 'express';
import { vectorRepository, NotImplementedRepositoryError } from '../repositories/vectorRepository.js';

const router = Router();

const EMBEDDING_DIMENSION = 20;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function parsePositiveId(idRaw) {
  const id = Number(idRaw);
  if (!isPositiveInteger(id)) {
    return { ok: false, message: 'id must be a positive integer.' };
  }

  return { ok: true, value: id };
}

function validateEmbeddingArray(embedding) {
  if (!Array.isArray(embedding)) {
    return 'embedding must be an array.';
  }

  if (embedding.length !== EMBEDDING_DIMENSION) {
    return `embedding must contain exactly ${EMBEDDING_DIMENSION} numbers.`;
  }

  const hasInvalidNumber = embedding.some((value) => !Number.isFinite(value));
  if (hasInvalidNumber) {
    return 'embedding must contain only finite numbers.';
  }

  return null;
}

function parseEmbeddingBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, message: 'body must be a JSON object.' };
  }

  const embeddingError = validateEmbeddingArray(body.embedding);
  if (embeddingError) {
    return { ok: false, message: embeddingError };
  }

  const hasVersion = Object.prototype.hasOwnProperty.call(body, 'embeddingVersion');
  if (hasVersion) {
    if (typeof body.embeddingVersion !== 'string' || body.embeddingVersion.trim() === '') {
      return { ok: false, message: 'embeddingVersion must be a non-empty string when provided.' };
    }
  }

  return {
    ok: true,
    value: {
      embedding: body.embedding,
      embeddingVersion: hasVersion ? body.embeddingVersion : undefined
    }
  };
}

function parseVectorQuery(vectorRaw) {
  if (typeof vectorRaw !== 'string' || vectorRaw.trim() === '') {
    return { ok: false, message: 'vector query param is required as JSON serialized array.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(vectorRaw);
  } catch (_error) {
    return { ok: false, message: 'vector must be a valid JSON serialized array.' };
  }

  const embeddingError = validateEmbeddingArray(parsed);
  if (embeddingError) {
    return { ok: false, message: embeddingError };
  }

  return { ok: true, value: parsed };
}

function parseLimitQuery(limitRaw) {
  if (limitRaw === undefined) {
    return { ok: true, value: DEFAULT_LIMIT };
  }

  const limit = Number(limitRaw);
  if (!isPositiveInteger(limit)) {
    return { ok: false, message: 'limit must be a positive integer.' };
  }

  if (limit > MAX_LIMIT) {
    return { ok: false, message: `limit must be less than or equal to ${MAX_LIMIT}.` };
  }

  return { ok: true, value: limit };
}

function handleVectorError(error, res, next) {
  if (error instanceof NotImplementedRepositoryError || error?.code === 'NOT_IMPLEMENTED') {
    res.status(501).json({
      error: 'not_implemented',
      message: error.message
    });
    return;
  }

  next(error);
}

async function handleSaveEmbedding(req, res, next, options) {
  const idValidation = parsePositiveId(req.params.id);
  if (!idValidation.ok) {
    res.status(400).json({ error: 'validation_error', message: idValidation.message });
    return;
  }

  const bodyValidation = parseEmbeddingBody(req.body);
  if (!bodyValidation.ok) {
    res.status(400).json({ error: 'validation_error', message: bodyValidation.message });
    return;
  }

  const { embedding, embeddingVersion } = bodyValidation.value;

  try {
    await options.save(idValidation.value, embedding, embeddingVersion);

    res.status(200).json({
      id: idValidation.value,
      entityType: options.entityType,
      embeddingDimension: embedding.length,
      embeddingVersion: embeddingVersion ?? null
    });
  } catch (error) {
    handleVectorError(error, res, next);
  }
}

async function handleFindSimilar(req, res, next, options) {
  const vectorValidation = parseVectorQuery(req.query.vector);
  if (!vectorValidation.ok) {
    res.status(400).json({ error: 'validation_error', message: vectorValidation.message });
    return;
  }

  const limitValidation = parseLimitQuery(req.query.limit);
  if (!limitValidation.ok) {
    res.status(400).json({ error: 'validation_error', message: limitValidation.message });
    return;
  }

  try {
    const items = await options.find(vectorValidation.value, limitValidation.value);

    res.status(200).json({
      items: Array.isArray(items) ? items : []
    });
  } catch (error) {
    handleVectorError(error, res, next);
  }
}

router.post('/candidates/:id/embedding', (req, res, next) =>
  handleSaveEmbedding(req, res, next, {
    entityType: 'candidate',
    save: (id, embedding, embeddingVersion) =>
      vectorRepository.saveCandidateEmbedding(id, embedding, embeddingVersion)
  })
);

router.post('/jobs/:id/embedding', (req, res, next) =>
  handleSaveEmbedding(req, res, next, {
    entityType: 'job',
    save: (id, embedding, embeddingVersion) =>
      vectorRepository.saveJobEmbedding(id, embedding, embeddingVersion)
  })
);

router.get('/candidates/similar', (req, res, next) =>
  handleFindSimilar(req, res, next, {
    find: (vector, limit) => vectorRepository.findSimilarCandidates(vector, limit)
  })
);

router.get('/jobs/similar', (req, res, next) =>
  handleFindSimilar(req, res, next, {
    find: (vector, limit) => vectorRepository.findSimilarJobs(vector, limit)
  })
);

export { router as vectorRoutes };
