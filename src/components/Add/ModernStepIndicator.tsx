
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export function ModernStepIndicator({ currentStep, totalSteps, stepNames }: ModernStepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-10">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {stepNames.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isCompleted && "bg-primary border-primary text-primary-foreground scale-110",
                isCurrent && "bg-background border-primary text-primary animate-pulse shadow-lg shadow-primary/20",
                !isCompleted && !isCurrent && "bg-background border-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium transition-colors duration-300",
                isCurrent && "text-primary",
                isCompleted && "text-primary",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}>
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
