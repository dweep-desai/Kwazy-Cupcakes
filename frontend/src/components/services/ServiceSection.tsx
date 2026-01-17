import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceSectionProps {
  title: string;
  viewAllCount?: number;
  children: ReactNode;
  showNavigation?: boolean;
}

export function ServiceSection({ 
  title, 
  viewAllCount, 
  children, 
  showNavigation = true 
}: ServiceSectionProps) {
  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        
        <div className="flex items-center gap-2">
          {viewAllCount !== undefined && (
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              View All ({viewAllCount})
            </Button>
          )}
          
          {showNavigation && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {children}
    </section>
  );
}
