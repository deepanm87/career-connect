import { createClerkClient } from "@clerk/backend"
import { COMPANY_PRO_PLAN } from "./model"

const PRO_ITEM_STATUSES = new Set<String>(["active", "past_due"])

export async function orgHasCompanyProBilling(
  orgId: string | null
): Promise<boolean> {
  if (orgId === null || orgId.length === 0) {
    return false
  }
  const secretKey = process.env.CLERK_SECRET_KEY
  if (secretKey === undefined || secretKey.length === 0) {
    console.error("CLERK_SECRET_KEY is not set on this Convex deployment; treating org as free tier")
    return false
  }
  try {
    const clerk = createClerkClient({ secretKey })
    const subscription = await clerk.billing.getOrganizationBillingSubscription(orgId)
    return subscription.subscriptionItems.some(
      item => 
        item.plan?.slug === COMPANY_PRO_PLAN &&
        PRO_ITEM_STATUSES.has(item.status)
    )
  } catch (error) {
    console.warn(`Clerk billing lookup failed for ${orgId}`, error)
    return false
  }
}
