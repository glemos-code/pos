import { events, workerEvents } from './constants.js';

export default class Events {
  static onTrainingComplete(callback) {
    document.addEventListener(events.trainingComplete, (event) => callback(event.detail));
  }

  static dispatchTrainingComplete(data) {
    document.dispatchEvent(new CustomEvent(events.trainingComplete, { detail: data }));
  }

  static onRecommend(callback) {
    document.addEventListener(events.recommend, (event) => callback(event.detail));
  }

  static dispatchRecommend(data) {
    document.dispatchEvent(new CustomEvent(events.recommend, { detail: data }));
  }

  static onRecommendationsReady(callback) {
    document.addEventListener(events.recommendationsReady, (event) => callback(event.detail));
  }

  static dispatchRecommendationsReady(data) {
    document.dispatchEvent(new CustomEvent(events.recommendationsReady, { detail: data }));
  }

  static onTrainModel(callback) {
    document.addEventListener(events.modelTrain, (event) => callback(event.detail));
  }

  static dispatchTrainModel(data) {
    document.dispatchEvent(new CustomEvent(events.modelTrain, { detail: data }));
  }

  static onProgressUpdate(callback) {
    document.addEventListener(events.modelProgressUpdate, (event) => callback(event.detail));
  }

  static dispatchProgressUpdate(data) {
    document.dispatchEvent(new CustomEvent(events.modelProgressUpdate, { detail: data }));
  }

  static onCandidateSelected(callback) {
    document.addEventListener(events.candidateSelected, (event) => callback(event.detail));
  }

  static dispatchCandidateSelected(data) {
    document.dispatchEvent(new CustomEvent(events.candidateSelected, { detail: data }));
  }

  static onJobSelected(callback) {
    document.addEventListener(events.jobSelected, (event) => callback(event.detail));
  }

  static dispatchJobSelected(data) {
    document.dispatchEvent(new CustomEvent(events.jobSelected, { detail: data }));
  }

  static onCandidatesUpdated(callback) {
    document.addEventListener(events.candidatesUpdated, (event) => callback(event.detail));
  }

  static dispatchCandidatesUpdated(data) {
    document.dispatchEvent(new CustomEvent(events.candidatesUpdated, { detail: data }));
  }

  static onJobsUpdated(callback) {
    document.addEventListener(events.jobsUpdated, (event) => callback(event.detail));
  }

  static dispatchJobsUpdated(data) {
    document.dispatchEvent(new CustomEvent(events.jobsUpdated, { detail: data }));
  }

  static onHistoryUpdated(callback) {
    document.addEventListener(events.historyUpdated, (event) => callback(event.detail));
  }

  static dispatchHistoryUpdated(data) {
    document.dispatchEvent(new CustomEvent(events.historyUpdated, { detail: data }));
  }
}

export { workerEvents };
