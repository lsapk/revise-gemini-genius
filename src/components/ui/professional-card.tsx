
import * as React from "react";
import { cn } from "@/lib/utils";

const ProfessionalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm text-card-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 group",
      className
    )}
    {...props}
  />
));
ProfessionalCard.displayName = "ProfessionalCard";

const ProfessionalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3 p-8 pb-6", className)}
    {...props}
  />
));
ProfessionalCardHeader.displayName = "ProfessionalCardHeader";

const ProfessionalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all duration-300",
      className
    )}
    {...props}
  />
));
ProfessionalCardTitle.displayName = "ProfessionalCardTitle";

const ProfessionalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
ProfessionalCardDescription.displayName = "ProfessionalCardDescription";

const ProfessionalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0 space-y-6", className)} {...props} />
));
ProfessionalCardContent.displayName = "ProfessionalCardContent";

const ProfessionalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-8 pt-0", className)}
    {...props}
  />
));
ProfessionalCardFooter.displayName = "ProfessionalCardFooter";

export { 
  ProfessionalCard, 
  ProfessionalCardHeader, 
  ProfessionalCardFooter, 
  ProfessionalCardTitle, 
  ProfessionalCardDescription, 
  ProfessionalCardContent 
};
