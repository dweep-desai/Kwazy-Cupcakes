import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceColorVariant } from "./ServiceCard";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  colorVariant: ServiceColorVariant;
  onClick?: () => void;
}

const iconBgClasses: Record<ServiceColorVariant, string> = {
  yellow: "bg-service-yellow text-service-yellow-icon",
  green: "bg-service-green text-service-green-icon",
  blue: "bg-service-blue text-service-blue-icon",
  orange: "bg-service-orange text-service-orange-icon",
  pink: "bg-service-pink text-service-pink-icon",
  cyan: "bg-service-cyan text-service-cyan-icon",
};

export function CategoryCard({ title, icon: Icon, colorVariant, onClick }: CategoryCardProps) {
  return (
    <div 
      className="category-card group"
      onClick={onClick}
    >
      <div className={cn("category-icon", iconBgClasses[colorVariant])}>
        <Icon className="h-7 w-7" />
      </div>
      <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors leading-tight">
        {title}
      </span>
    </div>
  );
}
