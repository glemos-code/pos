export class JobService {
  constructor() {
    this.storageKey = 'rh-jobs';
    this.apiBaseUrl = 'http://localhost:3334';
  }

  async getJobs() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/jobs`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const jobs = await response.json();
      const normalized = this.normalizeJobs(jobs);
      localStorage.setItem(this.storageKey, JSON.stringify(normalized));
      return normalized;
    } catch (_error) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = this.normalizeJobs(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
          localStorage.setItem(this.storageKey, JSON.stringify(normalized));
        }
        return normalized;
      }

      const response = await fetch(new URL('../../data/jobs.json', import.meta.url));
      const jobs = await response.json();
      const normalized = this.normalizeJobs(jobs);
      localStorage.setItem(this.storageKey, JSON.stringify(normalized));
      return normalized;
    }
  }

  async addJob(job) {
    const normalizedJob = this.normalizeJob(job);
    const nextJob = {
      ...normalizedJob,
      id: Date.now(),
      requiredSkills: this.parseSkills(normalizedJob.requiredSkills),
      salaryRange: [Number(normalizedJob.salaryRange[0]), Number(normalizedJob.salaryRange[1])]
    };

    const response = await fetch(`${this.apiBaseUrl}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextJob)
    });

    if (!response.ok) {
      throw new Error(`Failed to save job in API. Status: ${response.status}`);
    }

    return await this.getJobs();
  }

  async updateJob(job) {
    const normalizedJob = this.normalizeJob(job);
    const payload = {
      ...normalizedJob,
      id: Number(normalizedJob.id),
      requiredSkills: this.parseSkills(normalizedJob.requiredSkills),
      salaryRange: [Number(normalizedJob.salaryRange[0]), Number(normalizedJob.salaryRange[1])]
    };

    const response = await fetch(`${this.apiBaseUrl}/jobs/${payload.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to update job in API. Status: ${response.status}`);
    }

    return await this.getJobs();
  }

  normalizeJobs(jobs) {
    if (!Array.isArray(jobs)) return [];
    return jobs.map((job) => this.normalizeJob(job));
  }

  normalizeJob(job) {
    const salaryRange = Array.isArray(job.salaryRange)
      ? job.salaryRange
      : Array.isArray(job.faixaSalarial)
        ? job.faixaSalarial
        : [];

    return {
      ...job,
      id: Number(job.id),
      title: job.title ?? job.titulo ?? '',
      minimumSeniority: this.normalizeSeniority(job.minimumSeniority ?? job.senioridadeMinima),
      requiredSkills: this.parseSkills(job.requiredSkills ?? job.skillsRequeridas),
      salaryRange: [Number(salaryRange[0] ?? 0), Number(salaryRange[1] ?? 0)]
    };
  }

  normalizeSeniority(seniority) {
    const normalized = String(seniority ?? '').toLowerCase();
    const translations = { junior: 'junior', júnior: 'junior', pleno: 'mid', mid: 'mid', senior: 'senior', sênior: 'senior' };
    const translated = translations[normalized];
    return translated || normalized || 'junior';
  }

  parseSkills(skills) {
    if (Array.isArray(skills)) return skills;
    return String(skills || '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
}
