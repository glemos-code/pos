export class CandidateService {
  constructor() {
    this.storageKey = 'rh-candidates';
    this.apiBaseUrl = 'http://localhost:3334';
  }

  async getCandidates() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/candidates`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const candidates = await response.json();
      const normalized = this.normalizeCandidates(candidates);
      localStorage.setItem(this.storageKey, JSON.stringify(normalized));
      return normalized;
    } catch (_error) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = this.normalizeCandidates(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
          localStorage.setItem(this.storageKey, JSON.stringify(normalized));
        }
        return normalized;
      }

      const response = await fetch(new URL('../../data/candidates.json', import.meta.url));
      const candidates = await response.json();
      const normalized = this.normalizeCandidates(candidates);
      localStorage.setItem(this.storageKey, JSON.stringify(normalized));
      return normalized;
    }
  }

  async addCandidate(candidate) {
    const normalizedCandidate = this.normalizeCandidate(candidate);
    const nextCandidate = {
      ...normalizedCandidate,
      id: Date.now(),
      yearsExperience: Number(normalizedCandidate.yearsExperience),
      salaryExpectation: Number(normalizedCandidate.salaryExpectation),
      skills: this.parseSkills(normalizedCandidate.skills)
    };

    const response = await fetch(`${this.apiBaseUrl}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextCandidate)
    });

    if (!response.ok) {
      throw new Error(`Failed to save candidate in API. Status: ${response.status}`);
    }

    return await this.getCandidates();
  }

  async updateCandidate(candidate) {
    const normalizedCandidate = this.normalizeCandidate(candidate);
    const payload = {
      ...normalizedCandidate,
      id: Number(normalizedCandidate.id),
      yearsExperience: Number(normalizedCandidate.yearsExperience),
      salaryExpectation: Number(normalizedCandidate.salaryExpectation),
      skills: this.parseSkills(normalizedCandidate.skills)
    };

    const response = await fetch(`${this.apiBaseUrl}/candidates/${payload.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to update candidate in API. Status: ${response.status}`);
    }

    return await this.getCandidates();
  }

  normalizeCandidates(candidates) {
    if (!Array.isArray(candidates)) return [];
    return candidates.map((candidate) => this.normalizeCandidate(candidate));
  }

  normalizeCandidate(candidate) {
    return {
      ...candidate,
      id: Number(candidate.id),
      name: candidate.name ?? candidate.nome ?? '',
      yearsExperience: Number(candidate.yearsExperience ?? candidate.anosExperiencia ?? 0),
      seniority: this.normalizeSeniority(candidate.seniority ?? candidate.senioridade),
      skills: this.parseSkills(candidate.skills),
      salaryExpectation: Number(candidate.salaryExpectation ?? candidate.pretensaoSalarial ?? 0)
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
