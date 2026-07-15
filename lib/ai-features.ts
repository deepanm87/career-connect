export const AI_FEATURES = {
  profile_optimizer: "ai_profile_optimizer",
  job_matcher: "ai_job_matcher",
  outreach_writer: "ai_outreach_writer",
  career_plan: "ai_career_plan"
} as const

export type AiFeature = keyof typeof AI_FEATURES

export const PRO_PLAN = "pro"

export const COMPANY_PRO_PLAN = "company_pro"
export const FREE_OPEN__JOB_LIMIT = 3