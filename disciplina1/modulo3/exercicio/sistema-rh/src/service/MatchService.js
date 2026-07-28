export class MatchService {
  calculateCompatibility(candidate, job) {
    const seniorityRank = { junior: 0, mid: 1, senior: 2 };
    const candidateRank = seniorityRank[String(candidate.seniority ?? '').toLowerCase()] ?? 0;
    const jobRank = seniorityRank[String(job.minimumSeniority ?? '').toLowerCase()] ?? 0;

    const seniorityScore = candidateRank >= jobRank ? 1 : candidateRank + 1 === jobRank ? 0.7 : 0;

    const overlap = (candidate.skills || []).filter((skill) => (job.requiredSkills || []).includes(skill)).length;
    const requiredSkills = (job.requiredSkills || []).length || 1;
    const skillScore = overlap / requiredSkills;

    const [minSalary, maxSalary] = job.salaryRange || [0, 0];
    const salaryExpectation = Number(candidate.salaryExpectation ?? 0);
    const salaryScore = salaryExpectation >= minSalary && salaryExpectation <= maxSalary
      ? 1
      : salaryExpectation < minSalary
        ? Math.max(0.2, salaryExpectation / minSalary)
        : Math.max(0.2, 1 - ((salaryExpectation - maxSalary) / maxSalary) * 0.5);

    const yearsExperience = Number(candidate.yearsExperience ?? 0);
    const experienceScore = yearsExperience >= 3 ? 1 : 0.6;
    const finalScore = Math.round((seniorityScore * 0.35 + skillScore * 0.35 + salaryScore * 0.2 + experienceScore * 0.1) * 100);

    const reasons = [
      `Seniority ${seniorityScore === 1 ? 'is appropriate' : 'is partially appropriate'} for the job.`,
      `${overlap}/${requiredSkills} required skills were found in the profile.`,
      `Salary expectation ${salaryScore >= 0.8 ? 'is compatible' : 'is close'} to the job range.`,
      `Experience ${yearsExperience >= 3 ? 'is sufficient' : 'is limited'} for this context.`
    ];

    return {
      score: finalScore,
      overlap,
      reasons
    };
  }
}
