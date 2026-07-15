import type { ClerkClient } from "@clerk/backend"
import { PRO_PLAN, COMPANY_PRO_PLAN } from "./ai-features"

export const ENTITLED_STATUSES = new Set(["active", "past_due"])

export async function userSubscriptionIsPro(
  client: ClerkClient,
  userId: string
): Promise<boolean> {
  try {
    const sub = await client.billing.getUserBillingSubscription(userId)
    return sub.subscriptionItems.some(
      item => item.plan?.slug === PRO_PLAN && ENTITLED_STATUSES.has(item.status)
    )
  } catch {
    return false
  }
}

export async function orgSubscriptionIsCompanyPro(
  client: ClerkClient,
  orgId: string
): Promise<boolean> {
  try {
    const sub = await client.billing.getOrganizationBillingSubscription(orgId)
    return sub.subscriptionItems.some(
      item => item.plan?.slug === COMPANY_PRO_PLAN && ENTITLED_STATUSES.has(item.status)
    )
  } catch {
    return false
  }
}