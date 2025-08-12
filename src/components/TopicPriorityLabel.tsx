import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export type TopicPriority = "low" | "medium" | "high" | "none";

interface TopicPriorityLabelProps {
  priority?: TopicPriority;
  onChange?: (priority: TopicPriority) => void;
  size?: "sm" | "md";
}

const labelMap: Record<TopicPriority, { text: string; title: string; varName: string; hasOutline?: boolean }> = {
  none: { text: "-", title: "No priority", varName: "--muted", hasOutline: true },
  low: { text: "!", title: "Low priority", varName: "--priority-low" },
  medium: { text: "!!", title: "Medium priority", varName: "--priority-medium" },
  high: { text: "!!!", title: "High priority", varName: "--priority-high" },
};

export function TopicPriorityLabel({ priority = "none", onChange, size = "sm" }: TopicPriorityLabelProps) {
  const [open, setOpen] = useState(false);
  const current = labelMap[priority];

  if (!onChange) {
    return (
      <Badge
        variant="secondary"
        title={current.title}
        className={`${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"} font-bold border inline-flex items-center ml-2 rounded-full ${current.hasOutline ? "border-2" : ""}`}
        style={{
          backgroundColor: current.hasOutline ? `transparent` : `hsl(var(${current.varName}) / 0.3)`,
          color: `hsl(var(${current.varName}))`,
          borderColor: `hsl(var(${current.varName}) / ${current.hasOutline ? '0.8' : '0.3'})`,
        }}
      >
        {current.text}
      </Badge>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={current.title}
          className={`${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"} font-bold cursor-pointer border inline-flex items-center ml-2 rounded-full transition-colors hover:opacity-80 ${current.hasOutline ? "border-2" : ""}`}
          style={{
            backgroundColor: current.hasOutline ? `transparent` : `hsl(var(${current.varName}) / 0.3)`,
            color: `hsl(var(${current.varName}))`,
            borderColor: `hsl(var(${current.varName}) / ${current.hasOutline ? '0.8' : '0.3'})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {current.text}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="z-[9999] w-40 p-2 bg-popover border shadow-lg">
        <div className="text-xs font-medium mb-2">Set priority</div>
        <div className="flex items-center gap-2">
          {(Object.keys(labelMap) as TopicPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              title={labelMap[p].title}
              className={`text-[11px] px-2.5 py-0.5 cursor-pointer border font-bold rounded-full transition-all hover:opacity-80 ${p === priority ? "ring-2 ring-ring" : ""} ${labelMap[p].hasOutline ? "border-2" : ""}`}
              style={{
                backgroundColor: labelMap[p].hasOutline ? `transparent` : `hsl(var(${labelMap[p].varName}) / 0.3)`,
                color: `hsl(var(${labelMap[p].varName}))`,
                borderColor: `hsl(var(${labelMap[p].varName}) / ${labelMap[p].hasOutline ? '0.8' : '0.3'})`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(p);
                setOpen(false);
              }}
            >
              {labelMap[p].text}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
