import "server-only"
import { auth, clerkClient } from "@clerk/nextjs/server"
import {
  AI_FEATURES,
  PRO_PLAN,
  COMPANY_PRO_PLAN,
  type AiFeature
} from "./ai-features"
import { userSubscriptionIsPro, orgSubscriptionIsCompanyPro } from "./billing"

export { AI_FEATURES, PRO_PLAN, COMPANY_PRO_PLAN, type AiFeature }
export { userSubscriptionIsPro, orgSubscriptionIsCompanyPro }

export async function isPro(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) {
    return false
  }
  return userSubscriptionIsPro(await clerkClient(), userId)
}

export async function hasAiFeature(_feature: AiFeature): Promise<boolean> {
  return isPro()
}

export async function isCompanyPro(): Promise<boolean> {
  const { userId, orgId } = await auth()
  if (!userId || !orgId) {
    return false
  }
  return orgSubscriptionIsCompanyPro(await clerkClient(), orgId)
}