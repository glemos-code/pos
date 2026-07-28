import { View } from './View.js';

export class MatchView extends View {
  constructor() {
    super();
    this.resultContainer = document.createElement('section');
    this.resultContainer.className = 'panel';
    this.resultContainer.innerHTML = '<div class="panel-header"><h2>Compatibility</h2><p>Select a candidate and a job to view the result.</p></div>';
    document.querySelector('.app-shell').appendChild(this.resultContainer);
  }

  renderMatch(candidate, job, match) {
    const candidateName = candidate.name ?? candidate.nome ?? 'Unknown candidate';
    const jobTitle = job.title ?? job.titulo ?? 'Unknown job';

    this.resultContainer.innerHTML = `
      <div class="panel-header">
        <h2>Compatibility</h2>
        <p>${candidateName} x ${jobTitle}</p>
      </div>
      <div class="card">
        <h3>Final score: ${match.score}%</h3>
        <p><strong>Compatible skills:</strong> ${match.overlap}</p>
        <ul>
          ${match.reasons.map((reason) => `<li>${reason}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}
