import { CandidateService } from '../service/CandidateService.js';
import { JobService } from '../service/JobService.js';

export class ModelTrainingController {
  constructor({ events }) {
    this.events = events;
    this.candidateService = new CandidateService();
    this.jobService = new JobService();

    this.trainButton = document.querySelector('#trainModelButton');
    this.statusBox = document.querySelector('#trainingStatus');
    this.resultsBox = document.querySelector('#matchesResults');

    this.pendingCandidates = new Map();
    this.recommendationsByCandidateId = new Map();
    this.init();
  }

  static init(deps) {
    return new ModelTrainingController(deps);
  }

  init() {
    this.trainButton.addEventListener('click', () => this.runTraining());
    this.events.onProgressUpdate((progress) => this.handleProgressUpdate(progress));
    this.events.onTrainingComplete(() => this.handleTrainingComplete());
    this.events.onRecommendationsReady((data) => this.handleRecommendationsReady(data));
  }

  setLoading(isLoading) {
    this.trainButton.disabled = isLoading;
    this.trainButton.classList.toggle('loading', isLoading);
    this.trainButton.textContent = isLoading ? 'Training...' : 'Train model';
  }

  async runTraining() {
    this.setLoading(true);
    this.statusBox.textContent = 'Training started...';
    this.resultsBox.innerHTML = '';

    try {
      const [candidates, jobs] = await Promise.all([
        this.candidateService.getCandidates(),
        this.jobService.getJobs(),
      ]);

      if (!candidates.length || !jobs.length) {
        this.statusBox.textContent = 'Add candidates and jobs before training.';
        this.setLoading(false);
        return;
      }

      this.pendingCandidates = new Map(candidates.map((candidate) => [candidate.id, candidate]));
      this.recommendationsByCandidateId = new Map();
      this.events.dispatchTrainModel({ candidates, jobs });
    } catch (error) {
      console.error(error);
      this.statusBox.textContent = 'Training failed. Please try again.';
      this.setLoading(false);
    }
  }

  handleProgressUpdate(progress) {
    const value = Number(progress?.progress ?? 0);
    this.statusBox.textContent = `Training progress: ${value}%`;
  }

  handleTrainingComplete() {
    if (!this.pendingCandidates.size) {
      this.statusBox.textContent = 'Training completed.';
      this.setLoading(false);
      return;
    }

    this.statusBox.textContent = 'Training completed. Building recommendations...';

    this.pendingCandidates.forEach((candidate) => {
      this.events.dispatchRecommend(candidate);
    });
  }

  handleRecommendationsReady({ candidate, recommendations }) {
    if (!candidate?.id) return;

    this.recommendationsByCandidateId.set(candidate.id, {
      candidate,
      recommendations: recommendations || [],
    });

    if (this.recommendationsByCandidateId.size < this.pendingCandidates.size) {
      return;
    }

    this.renderResults();
    this.statusBox.textContent = 'Training completed. Matches built successfully.';
    this.setLoading(false);
  }

  renderResults() {
    const byJob = new Map();

    this.recommendationsByCandidateId.forEach(({ candidate, recommendations }) => {
      recommendations.forEach((job) => {
        const jobId = job.id;
        if (!byJob.has(jobId)) {
          byJob.set(jobId, {
            id: jobId,
            title: job.title,
            minimumSeniority: job.minimumSeniority,
            requiredSkills: job.requiredSkills || [],
            candidates: [],
          });
        }

        byJob.get(jobId).candidates.push({
          candidateName: candidate.name,
          score: Math.round((Number(job.score) || 0) * 100),
        });
      });
    });

    const cards = [...byJob.values()].map((job) => {
      const sortedCandidates = job.candidates.sort((a, b) => b.score - a.score);
      const skills = (job.requiredSkills || []).join(', ');

      return `
        <article class="card">
          <h3>${job.title}</h3>
          <p><strong>Minimum seniority:</strong> ${job.minimumSeniority}</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <ul>
            ${sortedCandidates.map((item) => `<li>${item.candidateName} - ${item.score}%</li>`).join('')}
          </ul>
        </article>
      `;
    });

    this.resultsBox.innerHTML = cards.length
      ? cards.join('')
      : '<div class="card"><p>No recommendations were produced.</p></div>';
  }
}
