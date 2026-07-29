import { workerEvents } from '../events/constants.js';

export class WorkerController {
  constructor({ worker, events }) {
    this.worker = worker;
    this.events = events;
    this.alreadyTrained = false;
    this.init();
  }

  static init(deps) {
    return new WorkerController(deps);
  }

  init() {
    this.setupCallbacks();
  }

  setupCallbacks() {
    this.events.onTrainModel((data) => {
      this.alreadyTrained = false;
      this.triggerTrain(data);
    });

    this.events.onTrainingComplete(() => {
      this.alreadyTrained = true;
    });

    this.events.onRecommend((candidate) => {
      if (!this.alreadyTrained) return;
      this.triggerRecommend(candidate);
    });

    this.worker.onmessage = (event) => {
      const { type } = event.data;

      if (type === workerEvents.progressUpdate) {
        this.events.dispatchProgressUpdate(event.data.progress);
      }

      if (type === workerEvents.trainingComplete) {
        this.events.dispatchTrainingComplete(event.data);
      }

      if (type === workerEvents.recommend) {
        this.events.dispatchRecommendationsReady(event.data);
      }
    };
  }

  triggerTrain({ candidates, jobs, history }) {
    this.worker.postMessage({
      action: workerEvents.trainModel,
      candidates,
      jobs,
      history,
    });
  }

  triggerRecommend(candidate) {
    this.worker.postMessage({
      action: workerEvents.recommend,
      candidate,
    });
  }
}
