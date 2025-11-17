import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelinePhase {
  name: string;
  status: "completed" | "in-progress" | "upcoming";
  description: string;
}

interface ProjectTimelineProps {
  phases: TimelinePhase[];
}

export const ProjectTimeline = ({ phases }: ProjectTimelineProps) => {
  const getStatusIcon = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-success" />;
      case "in-progress":
        return <Clock className="h-6 w-6 text-primary animate-spin" />;
      case "upcoming":
        return <Circle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return "border-success bg-success/10";
      case "in-progress":
        return "border-primary bg-primary/10";
      case "upcoming":
        return "border-muted bg-muted/10";
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Project Timeline</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            
            <div className="space-y-8">
              {phases.map((phase, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 shrink-0",
                    getStatusColor(phase.status)
                  )}>
                    {getStatusIcon(phase.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                        {phase.name}
                      </h3>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        phase.status === "completed" && "bg-success/20 text-success",
                        phase.status === "in-progress" && "bg-primary/20 text-primary",
                        phase.status === "upcoming" && "bg-muted text-muted-foreground"
                      )}>
                        {phase.status === "completed" && "Completed"}
                        {phase.status === "in-progress" && "In Progress"}
                        {phase.status === "upcoming" && "Upcoming"}
                      </span>
                    </div>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

