import { JobService } from '../service/JobService.js';
import { JobView } from '../view/JobView.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.jobView = new JobView();
    this.editingJobId = null;
    this.init();
  }

  async init() {
    this.jobView.registerSubmitCallback(this.handleSubmit.bind(this));
    this.jobView.registerEditCallback(this.handleEdit.bind(this));
    await this.refreshJobs();
  }

  async refreshJobs() {
    const jobs = await this.jobService.getJobs();
    this.jobView.renderJobs(jobs);
  }

  async handleSubmit(job) {
    if (this.editingJobId) {
      await this.jobService.updateJob({ ...job, id: this.editingJobId });
    } else {
      await this.jobService.addJob(job);
    }

    this.editingJobId = null;
    this.jobView.resetForm();
    await this.refreshJobs();
  }

  handleEdit(job) {
    this.editingJobId = job.id;
    this.jobView.fillForm(job);
  }
}
