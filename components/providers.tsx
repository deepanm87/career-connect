"use client"

import { ReactNode, useState } from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { useAuth } from "@clerk/nextjs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  )

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <TooltipProvider delay={200}>
        {children}
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </ConvexProviderWithClerk>
  )
}