import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface ServiceTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ServiceTabs({ tabs, activeTab, onTabChange }: ServiceTabsProps) {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeTab === tab.id ? "tab-active" : "tab-inactive"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
