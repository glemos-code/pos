import { CandidateService } from '../service/CandidateService.js';
import { CandidateView } from '../view/CandidateView.js';

export class CandidateController {
  constructor() {
    this.candidateService = new CandidateService();
    this.candidateView = new CandidateView();
    this.editingCandidateId = null;
    this.init();
  }

  async init() {
    this.candidateView.registerSubmitCallback(this.handleSubmit.bind(this));
    this.candidateView.registerEditCallback(this.handleEdit.bind(this));
    await this.refreshCandidates();
  }

  async refreshCandidates() {
    const candidates = await this.candidateService.getCandidates();
    this.candidateView.renderCandidates(candidates);
  }

  async handleSubmit(candidate) {
    if (this.editingCandidateId) {
      await this.candidateService.updateCandidate({ ...candidate, id: this.editingCandidateId });
    } else {
      await this.candidateService.addCandidate(candidate);
    }

    this.editingCandidateId = null;
    this.candidateView.resetForm();
    await this.refreshCandidates();
  }

  handleEdit(candidate) {
    this.editingCandidateId = candidate.id;
    this.candidateView.fillForm(candidate);
  }
}
