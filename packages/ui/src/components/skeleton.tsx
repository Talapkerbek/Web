import { cn } from "@workspace/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-blue-100 dark:bg-blue-800/50 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
