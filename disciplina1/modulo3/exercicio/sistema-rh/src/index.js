import { CandidateController } from './controller/CandidateController.js';
import { JobController } from './controller/JobController.js';
import { ModelTrainingController } from './controller/ModelTrainingController.js';
import { WorkerController } from './controller/WorkerController.js';
import Events from './events/events.js';

const mlWorker = new Worker(new URL('./workers/modelTrainingWorker.js', import.meta.url), { type: 'module' });

WorkerController.init({
	worker: mlWorker,
	events: Events,
});

new CandidateController();
new JobController();
ModelTrainingController.init({
	events: Events,
});
