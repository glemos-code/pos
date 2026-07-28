export class HistoryService {
  constructor() {
    this.storageKey = 'rh-history';
  }

  async getHistory() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      const normalized = this.normalizeHistory(parsed);
      if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
        localStorage.setItem(this.storageKey, JSON.stringify(normalized));
      }
      return normalized;
    }

    const response = await fetch(new URL('../../data/history.json', import.meta.url));
    const history = await response.json();
    const normalized = this.normalizeHistory(history);
    localStorage.setItem(this.storageKey, JSON.stringify(normalized));
    return normalized;
  }

  async addHistory(entry) {
    const history = await this.getHistory();
    const normalizedEntry = this.normalizeHistoryEntry(entry);
    const nextEntry = {
      ...normalizedEntry,
      id: Date.now(),
      label: Number(normalizedEntry.label)
    };

    const updated = [...history, nextEntry];
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }

  normalizeHistory(history) {
    if (!Array.isArray(history)) return [];
    return history.map((entry) => this.normalizeHistoryEntry(entry));
  }

  normalizeHistoryEntry(entry) {
    const statusTranslations = {
      contratado: 'hired',
      entrevista_aprovada: 'interview_approved',
      rejeitado: 'rejected',
      avaliacao_recrutador: 'recruiter_evaluation',
      hired: 'hired',
      interview_approved: 'interview_approved',
      rejected: 'rejected',
      recruiter_evaluation: 'recruiter_evaluation'
    };

    return {
      ...entry,
      candidateId: Number(entry.candidateId ?? entry.candidate_id ?? 0),
      jobId: Number(entry.jobId ?? entry.job_id ?? 0),
      status: statusTranslations[String(entry.status ?? '').toLowerCase()] || String(entry.status ?? 'rejected'),
      label: Number(entry.label ?? 0),
      notes: entry.notes ?? ''
    };
  }
}
