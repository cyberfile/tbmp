import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export type TopicPriority = "low" | "medium" | "high";

interface TopicPriorityLabelProps {
  priority: TopicPriority;
  onChange?: (priority: TopicPriority) => void;
  size?: "sm" | "md";
}

const labelMap: Record<TopicPriority, { text: string; title: string; varName: string; description: string }> = {
  low: { text: "!", title: "Low Priority", varName: "--priority-low", description: "Low priority task (green !)" },
  medium: { text: "!!", title: "Medium Priority", varName: "--priority-medium", description: "Medium priority task (yellow !!)" },
  high: { text: "!!!", title: "High Priority", varName: "--priority-high", description: "High priority task (red !!!)" },
};

export function TopicPriorityLabel({ priority, onChange, size = "sm" }: TopicPriorityLabelProps) {
  const [open, setOpen] = useState(false);
  const current = labelMap[priority];

  const badge = (
    <Badge
      variant="secondary"
      title={current.description}
      aria-label={current.description}
      className={`${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"} font-bold ${onChange ? "cursor-pointer hover:opacity-80" : ""} border inline-flex items-center ml-2 rounded-full transition-opacity`}
      style={{
        backgroundColor: `hsl(var(${current.varName}) / 0.3)`,
        color: `hsl(var(${current.varName}))`,
        borderColor: `hsl(var(${current.varName}) / 0.3)`,
      }}
      onClick={onChange ? (e) => { e.stopPropagation(); } : undefined}
      onMouseDown={onChange ? (e) => { e.stopPropagation(); } : undefined}
      onPointerDown={onChange ? (e) => { e.stopPropagation(); } : undefined}
    >
      {current.text}
    </Badge>
  );

  if (!onChange) return badge;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {badge}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-2">
        <div className="text-xs font-medium mb-2">Set priority</div>
        <div className="flex items-center gap-2">
          {(Object.keys(labelMap) as TopicPriority[]).map((p) => (
            <Badge
              key={p}
              role="button"
              title={labelMap[p].description}
              aria-label={labelMap[p].description}
              className={`text-[11px] px-2.5 py-0.5 cursor-pointer border font-bold rounded-full transition-all hover:opacity-80 ${p === priority ? "ring-2 ring-ring" : ""}`}
              style={{
                backgroundColor: `hsl(var(${labelMap[p].varName}) / 0.3)`,
                color: `hsl(var(${labelMap[p].varName}))`,
                borderColor: `hsl(var(${labelMap[p].varName}) / 0.3)`,
              }}
              onMouseDown={(e) => { e.stopPropagation(); }}
              onPointerDown={(e) => { e.stopPropagation(); }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(p);
                setOpen(false);
              }}
            >
              {labelMap[p].text}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
