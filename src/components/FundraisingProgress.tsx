import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FundraisingProgressProps {
  currentAmount: number;
  goalAmount: number;
  currency?: string;
}

export const FundraisingProgress = ({
  currentAmount,
  goalAmount,
  currency = "HK$",
}: FundraisingProgressProps) => {
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const formattedCurrent = new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(currentAmount);
  
  const formattedGoal = new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(goalAmount);

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Fundraising Progress</h2>
          
          <div className="bg-card rounded-lg border p-6 md:p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl md:text-3xl font-bold text-foreground">
                  {formattedCurrent}
                </span>
                <span className="text-lg text-muted-foreground">
                  of {formattedGoal}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-3 md:h-4"
              />
            </div>
            
            <div className="text-center">
              <p className="text-lg md:text-xl font-semibold text-foreground mb-2">
                {percentage.toFixed(1)}% Funded
              </p>
              <p className="text-base text-muted-foreground">
                Help us reach our goal to build a state-of-the-art care facility
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

