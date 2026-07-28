import { HistoryService } from '../service/HistoryService.js';
import { CandidateService } from '../service/CandidateService.js';
import { JobService } from '../service/JobService.js';
import { HistoryView } from '../view/HistoryView.js';

export class HistoryController {
  constructor() {
    this.historyService = new HistoryService();
    this.candidateService = new CandidateService();
    this.jobService = new JobService();
    this.historyView = new HistoryView();
    this.init();
  }

  async init() {
    this.historyView.registerSubmitCallback(this.handleSubmit.bind(this));
    await this.refresh();
  }

  async refresh() {
    const [history, candidates, jobs] = await Promise.all([
      this.historyService.getHistory(),
      this.candidateService.getCandidates(),
      this.jobService.getJobs()
    ]);

    this.historyView.renderHistory(history, candidates, jobs);
  }

  async handleSubmit(entry) {
    await this.historyService.addHistory(entry);
    await this.refresh();
  }
}
