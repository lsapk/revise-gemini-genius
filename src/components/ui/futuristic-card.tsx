
import * as React from "react";
import { cn } from "@/lib/utils";

const FuturisticCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm border border-gray-800/50 shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:border-primary-500/30 group overflow-hidden",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">{props.children}</div>
  </div>
));
FuturisticCard.displayName = "FuturisticCard";

const FuturisticCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
FuturisticCardHeader.displayName = "FuturisticCardHeader";

const FuturisticCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
FuturisticCardTitle.displayName = "FuturisticCardTitle";

const FuturisticCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400 leading-relaxed", className)}
    {...props}
  />
));
FuturisticCardDescription.displayName = "FuturisticCardDescription";

const FuturisticCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
FuturisticCardContent.displayName = "FuturisticCardContent";

const FuturisticCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
FuturisticCardFooter.displayName = "FuturisticCardFooter";

export { 
  FuturisticCard, 
  FuturisticCardHeader, 
  FuturisticCardFooter, 
  FuturisticCardTitle, 
  FuturisticCardDescription, 
  FuturisticCardContent 
};
