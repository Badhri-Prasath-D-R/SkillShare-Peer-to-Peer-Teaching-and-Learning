import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  className: string;
  'data-testid'?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className, 'data-testid': testId }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl skill-card-animation" data-testid={testId}>
      <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 ${className} rounded-full opacity-20`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900" data-testid={`${testId}-value`}>{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${className} bg-opacity-20 ml-4`}>
            <Icon className="w-6 h-6 text-white" style={{ filter: 'brightness(0.8)' }} />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
          <span className="text-green-600 font-medium" data-testid={`${testId}-trend`}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
