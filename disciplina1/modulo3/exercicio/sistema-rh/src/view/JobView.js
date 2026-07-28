import { View } from './View.js';

export class JobView extends View {
  constructor() {
    super();
    this.jobList = document.querySelector('#jobList');
    this.jobForm = document.querySelector('#jobForm');
    this.jobIdInput = document.querySelector('#jobId');
    this.jobTitleInput = document.querySelector('#jobTitle');
    this.jobSeniorityInput = document.querySelector('#jobSeniority');
    this.jobSkillsInput = document.querySelector('#jobSkills');
    this.jobMinSalaryInput = document.querySelector('#jobMinSalary');
    this.jobMaxSalaryInput = document.querySelector('#jobMaxSalary');
    this.jobSubmitButton = document.querySelector('#jobSubmitButton');
    this.jobCancelButton = document.querySelector('#jobCancelButton');
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
    this.jobForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.onSubmit) return;

      const job = {
        id: this.jobIdInput.value ? Number(this.jobIdInput.value) : null,
        title: this.jobTitleInput.value.trim(),
        minimumSeniority: this.jobSeniorityInput.value,
        requiredSkills: this.jobSkillsInput.value,
        salaryRange: [this.jobMinSalaryInput.value, this.jobMaxSalaryInput.value]
      };

      this.onSubmit(job);
    });

    this.jobCancelButton.addEventListener('click', () => this.resetForm());
  }

  resetForm() {
    this.jobForm.reset();
    this.jobIdInput.value = '';
    this.jobSubmitButton.textContent = 'Add job';
  }

  fillForm(job) {
    this.jobIdInput.value = job.id;
    this.jobTitleInput.value = job.title ?? job.titulo;
    this.jobSeniorityInput.value = job.minimumSeniority ?? job.senioridadeMinima;
    this.jobSkillsInput.value = (job.requiredSkills || job.skillsRequeridas || []).join(', ');
    const salaryRange = job.salaryRange ?? job.faixaSalarial ?? [0, 0];
    this.jobMinSalaryInput.value = salaryRange[0];
    this.jobMaxSalaryInput.value = salaryRange[1];
    this.jobSubmitButton.textContent = 'Save changes';
  }

  renderJobs(jobs) {
    this.jobList.innerHTML = jobs.map((job) => {
      const title = job.title ?? job.titulo ?? 'Unknown job';
      const seniority = job.minimumSeniority ?? job.senioridadeMinima ?? 'unknown';
      const skills = (job.requiredSkills || job.skillsRequeridas || []).join(', ');
      const salary = job.salaryRange ?? job.faixaSalarial ?? [0, 0];

      return `
        <article class="card">
          <h3>${title}</h3>
          <p><strong>Minimum seniority:</strong> ${seniority}</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <p><strong>Salary range:</strong> $ ${salary[0]} - $ ${salary[1]}</p>
          <button type="button" data-edit-job="${job.id}">Edit</button>
        </article>
      `;
    }).join('');

    this.jobList.querySelectorAll('[data-edit-job]').forEach((button) => {
      button.addEventListener('click', () => {
        const jobId = Number(button.dataset.editJob);
        const job = jobs.find((item) => item.id === jobId);
        if (job && this.onEdit) this.onEdit(job);
      });
    });
  }
}
