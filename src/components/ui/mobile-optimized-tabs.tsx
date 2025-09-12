import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const MobileOptimizedTabs = TabsPrimitive.Root

const MobileOptimizedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        isMobile ? "w-full flex-wrap gap-1" : "h-10",
        className
      )}
      {...props}
    />
  )
})
MobileOptimizedTabsList.displayName = TabsPrimitive.List.displayName

const MobileOptimizedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        isMobile ? "flex-1 min-w-0 text-xs py-2" : "",
        className
      )}
      {...props}
    />
  )
})
MobileOptimizedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const MobileOptimizedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
MobileOptimizedTabsContent.displayName = TabsPrimitive.Content.displayName

export { MobileOptimizedTabs, MobileOptimizedTabsList, MobileOptimizedTabsTrigger, MobileOptimizedTabsContent }