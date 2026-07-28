import { View } from './View.js';

export class CandidateView extends View {
  constructor() {
    super();
    this.candidateList = document.querySelector('#candidateList');
    this.candidateForm = document.querySelector('#candidateForm');
    this.candidateIdInput = document.querySelector('#candidateId');
    this.candidateNameInput = document.querySelector('#candidateName');
    this.candidateExperienceInput = document.querySelector('#candidateExperience');
    this.candidateSeniorityInput = document.querySelector('#candidateSeniority');
    this.candidateSkillsInput = document.querySelector('#candidateSkills');
    this.candidateSalaryInput = document.querySelector('#candidateSalary');
    this.candidateSubmitButton = document.querySelector('#candidateSubmitButton');
    this.candidateCancelButton = document.querySelector('#candidateCancelButton');
    this.onSubmit = null;
    this.onEdit = null;
    this.bindForm();
  }

  registerSubmitCallback(callback) {
    this.onSubmit = callback;
  }

  registerEditCallback(callback) {
    this.onEdit = callback;
  }

  bindForm() {
    this.candidateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.onSubmit) return;

      const candidate = {
        id: this.candidateIdInput.value ? Number(this.candidateIdInput.value) : null,
        name: this.candidateNameInput.value.trim(),
        yearsExperience: this.candidateExperienceInput.value,
        seniority: this.candidateSeniorityInput.value,
        skills: this.candidateSkillsInput.value,
        salaryExpectation: this.candidateSalaryInput.value
      };

      this.onSubmit(candidate);
    });

    this.candidateCancelButton.addEventListener('click', () => this.resetForm());
  }

  resetForm() {
    this.candidateForm.reset();
    this.candidateIdInput.value = '';
    this.candidateSubmitButton.textContent = 'Add candidate';
  }

  fillForm(candidate) {
    this.candidateIdInput.value = candidate.id;
    this.candidateNameInput.value = candidate.name ?? candidate.nome;
    this.candidateExperienceInput.value = candidate.yearsExperience ?? candidate.anosExperiencia;
    this.candidateSeniorityInput.value = candidate.seniority ?? candidate.senioridade;
    this.candidateSkillsInput.value = (candidate.skills || []).join(', ');
    this.candidateSalaryInput.value = candidate.salaryExpectation ?? candidate.pretensaoSalarial;
    this.candidateSubmitButton.textContent = 'Save changes';
  }

  renderCandidates(candidates) {
    this.candidateList.innerHTML = candidates.map((candidate) => {
      const name = candidate.name ?? candidate.nome ?? 'Unknown candidate';
      const seniority = candidate.seniority ?? candidate.senioridade ?? 'unknown';
      const experience = candidate.yearsExperience ?? candidate.anosExperiencia ?? '0';
      const salary = candidate.salaryExpectation ?? candidate.pretensaoSalarial ?? '0';
      const skills = (candidate.skills || []).join(', ');

      return `
        <article class="card">
          <h3>${name}</h3>
          <p><strong>Seniority:</strong> ${seniority}</p>
          <p><strong>Experience:</strong> ${experience} years</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <p><strong>Salary expectation:</strong> $ ${salary}</p>
          <button type="button" data-edit-candidate="${candidate.id}">Edit</button>
        </article>
      `;
    }).join('');

    this.candidateList.querySelectorAll('[data-edit-candidate]').forEach((button) => {
      button.addEventListener('click', () => {
        const candidateId = Number(button.dataset.editCandidate);
        const candidate = candidates.find((item) => item.id === candidateId);
        if (candidate && this.onEdit) this.onEdit(candidate);
      });
    });
  }
}
