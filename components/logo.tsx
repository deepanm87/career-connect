import Link from "next/link"
import { Waypoints } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  href = "/",
  showWorkmark = true,
  wordmarkClassName
} : {
  className?: string
  href?: string
  showWorkmark?: boolean
  wordmarkClassName?: string
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Waypoints className="size-5" />
      </span>
      {showWorkmark && (
        <span
          className={cn(
            "font-heading text-xl font-semibold tracking-tight",
            wordmarkClassName
          )}
        >
          Career<span className="italic text-primary">Connect</span>
        </span>
      )}
    </Link>
  )
}