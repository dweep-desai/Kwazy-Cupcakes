import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceColorVariant = "yellow" | "green" | "blue" | "orange" | "pink" | "cyan";

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  colorVariant: ServiceColorVariant;
  onClick?: () => void;
}

const colorClasses: Record<ServiceColorVariant, string> = {
  yellow: "service-icon-yellow",
  green: "service-icon-green",
  blue: "service-icon-blue",
  orange: "service-icon-orange",
  pink: "service-icon-pink",
  cyan: "service-icon-cyan",
};

export function ServiceCard({ title, subtitle, icon: Icon, colorVariant, onClick }: ServiceCardProps) {
  return (
    <div 
      className="service-card group"
      onClick={onClick}
    >
      <div className={cn("service-icon", colorClasses[colorVariant])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
