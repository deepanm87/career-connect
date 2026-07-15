"use client"

import { useSubscription } from "@clerk/nextjs/experimental"
import { PRO_PLAN, COMPANY_PRO_PLAN } from "./ai-features"

const ENTITLED_STATUSES = new Set(["active", "past_due"])

function subscriptionHasPlan(
  data: ReturnType<typeof useSubscription>["data"],
  slug: string
): boolean {
  return (
    data?.subscriptionItems.some(
      item => item.plan.slug === slug && ENTITLED_STATUSES.has(item.status)
    ) ?? false
  )
}

export function usePersonalPro(): { 
  isPro: boolean
  isLoaded: boolean
} {
  const { data, isLoading } = useSubscription({ for: "user" })
  return { isPro: subscriptionHasPlan(data, PRO_PLAN), isLoaded: !isLoading }
}

export function useCompanyPro(): { isPro: boolean; isLoaded: boolean } {
  const { data, isLoading } = useSubscription({ for: "organization" })
  return {
    isPro: subscriptionHasPlan(data, COMPANY_PRO_PLAN),
    isLoaded: !isLoading
  }
}