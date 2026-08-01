import { pool } from '../db/pool.js';

export class NotImplementedRepositoryError extends Error {
  constructor(methodName) {
    super(`vectorRepository.${methodName} is not implemented.`);
    this.name = 'NotImplementedRepositoryError';
    this.code = 'NOT_IMPLEMENTED';
  }
}

// pgvector espera o vetor como texto no formato '[0.1,0.2,0.3]'.
// O driver `pg` não tem um tipo nativo para "vector", por isso
// convertemos o array JS numa string e fazemos o cast ::vector
// diretamente na query SQL.
function toVectorLiteral(embedding) {
  return `[${embedding.join(',')}]`;
}

function rowToEntity(row) {
  return {
    ...row.metadata,
    id: row.id,
    distance: row.distance !== undefined ? Number(row.distance) : undefined,
  };
}

export const vectorRepository = {
  async saveCandidateEmbedding(id, embedding, embeddingVersion) {
    const vectorLiteral = toVectorLiteral(embedding);

    const result = await pool.query(
      `UPDATE public.candidates
       SET embedding = $1::vector,
           embedding_version = $2
       WHERE id = $3
       RETURNING id`,
      [vectorLiteral, embeddingVersion ?? null, id]
    );

    if (result.rowCount === 0) {
      const error = new Error(`Candidate with id ${id} was not found.`);
      error.code = 'NOT_FOUND';
      throw error;
    }
  },

  async saveJobEmbedding(id, embedding, embeddingVersion) {
    const vectorLiteral = toVectorLiteral(embedding);

    const result = await pool.query(
      `UPDATE public.jobs
       SET embedding = $1::vector,
           embedding_version = $2
       WHERE id = $3
       RETURNING id`,
      [vectorLiteral, embeddingVersion ?? null, id]
    );

    if (result.rowCount === 0) {
      const error = new Error(`Job with id ${id} was not found.`);
      error.code = 'NOT_FOUND';
      throw error;
    }
  },

  // Busca por distância de cosseno (operador <=>): quanto MENOR a distância,
  // mais parecidos os vetores são. ORDER BY + LIMIT já entrega os N mais
  // próximos sem precisar calcular nada em JavaScript.
  async findSimilarCandidates(vector, limit) {
    const vectorLiteral = toVectorLiteral(vector);

    const { rows } = await pool.query(
      `SELECT id, metadata, embedding <=> $1::vector AS distance
       FROM public.candidates
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [vectorLiteral, limit]
    );

    return rows.map(rowToEntity);
  },

  async findSimilarJobs(vector, limit) {
    const vectorLiteral = toVectorLiteral(vector);

    const { rows } = await pool.query(
      `SELECT id, metadata, embedding <=> $1::vector AS distance
       FROM public.jobs
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [vectorLiteral, limit]
    );

    return rows.map(rowToEntity);
  },
};