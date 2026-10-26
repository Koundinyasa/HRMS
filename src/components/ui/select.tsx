import * as React from "react"
 
import { Select as SelectPrimitive } from "@base-ui/react/select"
 
import { cn } from "@/lib/utils"
 
import {
  ChevronDownIcon,
  CheckIcon,
  ChevronUpIcon,
} from "lucide-react"
 
// -----------------------------------------------------------------------------
// Select Root
// -----------------------------------------------------------------------------
 
const Select = SelectPrimitive.Root
 
// -----------------------------------------------------------------------------
// Select Group
// -----------------------------------------------------------------------------
 
function SelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}
 
// -----------------------------------------------------------------------------
// Select Value
// -----------------------------------------------------------------------------
 
function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "flex min-w-0 flex-1 text-left",
        className
      )}
      {...props}
    />
  )
}
 
// -----------------------------------------------------------------------------
// Select Trigger
// -----------------------------------------------------------------------------
 
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          // Layout and responsive width
          "flex w-full min-w-0 max-w-full items-center justify-between gap-2",
 
          // Appearance
          "rounded-xl border border-gray-300 bg-white px-3",
 
          // Typography
          "text-sm text-slate-900 whitespace-nowrap",
 
          // Interaction
          "outline-none transition-colors",
          "focus-visible:border-violet-500",
          "focus-visible:ring-2 focus-visible:ring-violet-500/20",
 
          // Disabled and invalid states
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive",
          "aria-invalid:ring-2 aria-invalid:ring-destructive/20",
 
          // Placeholder
          "data-placeholder:text-slate-400",
 
          // Default and small sizes
          "data-[size=default]:h-10",
          "sm:data-[size=default]:h-11",
          "data-[size=sm]:h-9",
 
          // Value alignment
          "*:data-[slot=select-value]:flex",
          "*:data-[slot=select-value]:min-w-0",
          "*:data-[slot=select-value]:items-center",
          "*:data-[slot=select-value]:gap-2",
          "*:data-[slot=select-value]:truncate",
 
          // Icons
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className
      )}
      {...props}
    >
      {children}
 
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            className="pointer-events-none size-4 shrink-0 text-slate-500"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}
 
// -----------------------------------------------------------------------------
// Select Content
// -----------------------------------------------------------------------------
 
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-[9999] max-w-[calc(100vw-1rem)]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            [
              // Positioning and responsive sizing
              "relative isolate z-[9999]",
              "max-h-(--available-height)",
              "w-(--anchor-width)",
              "min-w-36",
              "max-w-[calc(100vw-1rem)]",
 
              // Appearance
              "overflow-x-hidden overflow-y-auto",
              "rounded-xl border border-gray-200",
              "bg-white text-slate-900",
              "shadow-lg ring-1 ring-foreground/10",
 
              // Animation
              "origin-(--transform-origin) duration-100",
              "data-[align-trigger=true]:animate-none",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2",
              "data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2",
              "data-[side=inline-end]:slide-in-from-left-2",
              "data-[side=inline-start]:slide-in-from-right-2",
              "data-open:animate-in",
              "data-open:fade-in-0",
              "data-open:zoom-in-95",
              "data-closed:animate-out",
              "data-closed:fade-out-0",
              "data-closed:zoom-out-95",
            ].join(" "),
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
 
          <SelectPrimitive.List
            className="p-1"
          >
            {children}
          </SelectPrimitive.List>
 
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}
 
// -----------------------------------------------------------------------------
// Select Label
// -----------------------------------------------------------------------------
 
function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-slate-500",
        className
      )}
      {...props}
    />
  )
}
 
// -----------------------------------------------------------------------------
// Select Item
// -----------------------------------------------------------------------------
 
function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        [
          // Layout
          "relative flex w-full min-w-0",
          "cursor-default select-none items-center gap-2",
          "rounded-lg py-2 pl-8 pr-2",
 
          // Typography
          "text-sm text-slate-700",
          "outline-none",
 
          // Hover and keyboard-highlight states
          "data-highlighted:bg-sky-100",
          "data-highlighted:text-slate-900",
          "focus:bg-sky-100",
          "focus:text-slate-900",
 
          // Disabled state
          "data-disabled:pointer-events-none",
          "data-disabled:opacity-50",
 
          // Nested icons
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
 
      <SelectPrimitive.ItemText
        className="flex min-w-0 flex-1 gap-2 break-words"
      >
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}
 
// -----------------------------------------------------------------------------
// Select Separator
// -----------------------------------------------------------------------------
 
function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-gray-200",
        className
      )}
      {...props}
    />
  )
}
 
// -----------------------------------------------------------------------------
// Select Scroll Up Button
// -----------------------------------------------------------------------------
 
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        [
          "top-0 z-10 flex w-full",
          "cursor-default items-center justify-center",
          "bg-white py-1 text-slate-500",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}
 
// -----------------------------------------------------------------------------
// Select Scroll Down Button
// -----------------------------------------------------------------------------
 
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        [
          "bottom-0 z-10 flex w-full",
          "cursor-default items-center justify-center",
          "bg-white py-1 text-slate-500",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}
 
// -----------------------------------------------------------------------------
// StyledSelect
//
// Supports:
// <StyledSelect
//   value={value}
//   onValueChange={setValue}
//   options={options}
//   className=""
//   placeholder="Select"
//   disabled={false}
// />
// -----------------------------------------------------------------------------
 
function StyledSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  disabled,
}: {
  value?: string
  onValueChange?: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        if (value !== null && onValueChange) {
          onValueChange(value)
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={className}
        disabled={disabled}
      >
        <SelectValue
          placeholder={placeholder ?? "Select"}
        />
      </SelectTrigger>
 
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
 
// -----------------------------------------------------------------------------
// Exports — all original components preserved
// -----------------------------------------------------------------------------
 
export {
  Select,
  SelectContent,
  StyledSelect,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}