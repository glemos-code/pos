CREATE TABLE IF NOT EXISTS public.candidates (
  id BIGINT PRIMARY KEY,
  metadata JSONB NOT NULL,
  embedding VECTOR
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id BIGINT PRIMARY KEY,
  metadata JSONB NOT NULL,
  embedding VECTOR
);

CREATE TABLE IF NOT EXISTS public.match_history (
  candidate_id BIGINT NOT NULL REFERENCES public.candidates(id) ON DELETE RESTRICT,
  job_id BIGINT NOT NULL REFERENCES public.jobs(id) ON DELETE RESTRICT,
  label SMALLINT NOT NULL CHECK (label IN (0, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (candidate_id, job_id, label)
);

CREATE INDEX IF NOT EXISTS idx_match_history_candidate_id ON public.match_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_match_history_job_id ON public.match_history(job_id);
CREATE INDEX IF NOT EXISTS idx_match_history_label ON public.match_history(label);
