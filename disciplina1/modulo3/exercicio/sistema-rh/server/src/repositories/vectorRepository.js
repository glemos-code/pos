export class NotImplementedRepositoryError extends Error {
  constructor(methodName) {
    super(`vectorRepository.${methodName} is not implemented.`);
    this.name = 'NotImplementedRepositoryError';
    this.code = 'NOT_IMPLEMENTED';
  }
}

export const vectorRepository = {
  async saveCandidateEmbedding(_id, _embedding, _embeddingVersion) {
    throw new NotImplementedRepositoryError('saveCandidateEmbedding');
  },

  async saveJobEmbedding(_id, _embedding, _embeddingVersion) {
    throw new NotImplementedRepositoryError('saveJobEmbedding');
  },

  async findSimilarCandidates(_vector, _limit) {
    throw new NotImplementedRepositoryError('findSimilarCandidates');
  },

  async findSimilarJobs(_vector, _limit) {
    throw new NotImplementedRepositoryError('findSimilarJobs');
  }
};
