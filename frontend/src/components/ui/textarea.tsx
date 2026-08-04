import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
