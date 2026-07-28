export const events = {
  candidateSelected: 'candidate:selected',
  candidatesUpdated: 'candidates:updated',
  jobSelected: 'job:selected',
  jobsUpdated: 'jobs:updated',
  modelTrain: 'training:train',
  trainingComplete: 'training:complete',
  modelProgressUpdate: 'model:progress-update',
  recommendationsReady: 'recommendations:ready',
  recommend: 'recommend',
  historyUpdated: 'history:updated'
};

export const workerEvents = {
  trainingComplete: 'training:complete',
  trainModel: 'train:model',
  recommend: 'recommend',
  trainingLog: 'training:log',
  progressUpdate: 'progress:update',
};
