import { CandidateService } from '../service/CandidateService.js';
import { JobService } from '../service/JobService.js';
import { MatchService } from '../service/MatchService.js';
import { MatchView } from '../view/MatchView.js';
import Events from '../events/events.js';

export class MatchController {
  constructor() {
    this.candidateService = new CandidateService();
    this.jobService = new JobService();
    this.matchService = new MatchService();
    this.matchView = new MatchView();
    this.currentCandidate = null;
    this.currentJob = null;
    this.init();
  }

  async init() {
    Events.onCandidateSelected(async (candidateId) => {
      const candidates = await this.candidateService.getCandidates();
      this.currentCandidate = candidates.find((candidate) => candidate.id === candidateId);
      this.render();
    });

    Events.onJobSelected(async (jobId) => {
      const jobs = await this.jobService.getJobs();
      this.currentJob = jobs.find((job) => job.id === jobId);
      this.render();
    });
  }

  render() {
    if (!this.currentCandidate || !this.currentJob) return;
    const match = this.matchService.calculateCompatibility(this.currentCandidate, this.currentJob);
    this.matchView.renderMatch(this.currentCandidate, this.currentJob, match);
  }
}
