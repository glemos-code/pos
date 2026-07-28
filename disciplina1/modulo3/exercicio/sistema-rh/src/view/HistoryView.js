import { View } from './View.js';

export class HistoryView extends View {
  constructor() {
    super();
    this.historyList = document.querySelector('#historyList');
    this.historyForm = document.querySelector('#historyForm');
    this.historyCandidateId = document.querySelector('#historyCandidateId');
    this.historyJobId = document.querySelector('#historyJobId');
    this.historyStatus = document.querySelector('#historyStatus');
    this.historyLabel = document.querySelector('#historyLabel');
    this.historyNotes = document.querySelector('#historyNotes');
    this.onSubmit = null;
    this.bindForm();
  }

  registerSubmitCallback(callback) {
    this.onSubmit = callback;
  }

  bindForm() {
    this.historyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.onSubmit) return;

      const entry = {
        candidateId: Number(this.historyCandidateId.value),
        jobId: Number(this.historyJobId.value),
        status: this.historyStatus.value,
        label: this.historyLabel.value,
        notes: this.historyNotes.value.trim()
      };

      this.onSubmit(entry);
      this.historyForm.reset();
    });
  }

  renderHistory(history, candidates, jobs) {
    this.historyList.innerHTML = history.map((entry) => {
      const candidate = candidates.find((item) => item.id === entry.candidateId);
      const job = jobs.find((item) => item.id === entry.jobId);
      const candidateName = candidate ? (candidate.name ?? candidate.nome) : 'Candidate not found';
      const jobTitle = job ? (job.title ?? job.titulo) : 'Job not found';

      return `
        <article class="card">
          <h3>${candidateName}</h3>
          <p><strong>Job:</strong> ${jobTitle}</p>
          <p><strong>Status:</strong> ${entry.status}</p>
          <p><strong>Label:</strong> ${entry.label}</p>
          <p><strong>Notes:</strong> ${entry.notes || 'No observations'}</p>
        </article>
      `;
    }).join('');
  }
}
