import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
 
import { cn } from "@/lib/utils"
 
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // size
        "h-6 w-11 data-[size=sm]:h-5 data-[size=sm]:w-9",
        // colors
        "data-checked:bg-green-500",
        "data-unchecked:bg-slate-300",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-transform",
          // size of the white circle
          "size-5 data-[size=sm]:size-4",
          // position
          "translate-x-0.5",
          // slide to the right when ON
          "data-checked:translate-x-[22px]",
          "data-[size=sm]:data-checked:translate-x-[16px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}
 
export { Switch }
 