import { CandidateService } from '../service/CandidateService.js';
import { JobService } from '../service/JobService.js';

export class MatchResultController {
  constructor() {
    this.candidateService = new CandidateService();
    this.jobService = new JobService();
    this.trainButton = document.querySelector('#trainModelButton');
    this.statusBox = document.querySelector('#trainingStatus');
    this.resultsBox = document.querySelector('#matchesResults');
    this.init();
  }

  init() {
    this.trainButton.addEventListener('click', () => this.runTraining());
  }

  setLoading(isLoading) {
    this.trainButton.disabled = isLoading;
    this.trainButton.classList.toggle('loading', isLoading);
    this.trainButton.textContent = isLoading ? 'Training...' : 'Train model';
  }

  async runTraining() {
    this.setLoading(true);
    this.statusBox.textContent = 'Training started...';

    try {
      const candidates = await this.candidateService.getCandidates();
      const jobs = await this.jobService.getJobs();

      const results = jobs.map((job) => {
        const scoredCandidates = candidates.map((candidate) => {
          const score = this.calculateSimpleScore(candidate, job);
          return { candidate, score };
        }).sort((a, b) => b.score - a.score);

        return {
          job,
          scoredCandidates
        };
      });

      this.renderResults(results);
      this.statusBox.textContent = 'Training completed. Matches built successfully.';
    } catch (error) {
      console.error(error);
      this.statusBox.textContent = 'Training failed. Please try again.';
    } finally {
      this.setLoading(false);
    }
  }

  calculateSimpleScore(candidate, job) {
    const seniorityRank = { junior: 0, mid: 1, senior: 2 };
    const candidateRank = seniorityRank[String(candidate.seniority || '').toLowerCase()] ?? 0;
    const jobRank = seniorityRank[String(job.minimumSeniority || '').toLowerCase()] ?? 0;

    const seniorityScore = candidateRank >= jobRank ? 1 : 0.5;
    const overlap = (candidate.skills || []).filter((skill) => (job.requiredSkills || []).includes(skill)).length;
    const requiredSkills = (job.requiredSkills || []).length || 1;
    const skillScore = overlap / requiredSkills;

    const [minSalary, maxSalary] = job.salaryRange || [0, 0];
    const salaryScore = candidate.salaryExpectation >= minSalary && candidate.salaryExpectation <= maxSalary
      ? 1
      : 0.5;

    const experienceScore = candidate.yearsExperience >= 3 ? 1 : 0.6;
    const total = Math.round((seniorityScore * 0.35 + skillScore * 0.35 + salaryScore * 0.2 + experienceScore * 0.1) * 100);

    return total;
  }

  renderResults(results) {
    if (!results.length) {
      this.resultsBox.innerHTML = '<div class="card"><p>No data available to build matches.</p></div>';
      return;
    }

    this.resultsBox.innerHTML = results.map(({ job, scoredCandidates }) => {
      const jobTitle = job.title ?? job.titulo ?? 'Unknown job';
      const seniority = job.minimumSeniority ?? job.senioridadeMinima ?? 'unknown';
      const skills = (job.requiredSkills || job.skillsRequeridas || []).join(', ');

      return `
        <article class="card">
          <h3>${jobTitle}</h3>
          <p><strong>Minimum seniority:</strong> ${seniority}</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <ul>
            ${scoredCandidates.map(({ candidate, score }) => `<li>${candidate.name ?? candidate.nome} — ${score}%</li>`).join('')}
          </ul>
        </article>
      `;
    }).join('');
  }
}
