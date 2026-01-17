import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
}

export function HeroBanner({ title, subtitle, ctaText, onCtaClick }: HeroBannerProps) {
  return (
    <div className="hero-banner min-h-[200px] flex items-center">
      <div className="relative z-10 max-w-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
          {title}
          <br />
          {subtitle}
        </h2>
        <Button 
          onClick={onCtaClick}
          className="bg-white text-green-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-lg shadow-md"
        >
          {ctaText}
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
