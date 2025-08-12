import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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

  const handlePriorityChange = (newPriority: TopicPriority) => {
    console.log(`Priority changed from ${priority} to ${newPriority}`);
    onChange?.(newPriority);
    setOpen(false);
  };

  const badge = (
    <Badge
      variant="secondary"
      title={current.description}
      aria-label={current.description}
      className={`${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"} font-bold border inline-flex items-center ml-2 rounded-full`}
      style={{
        backgroundColor: `hsl(var(${current.varName}) / 0.3)`,
        color: `hsl(var(${current.varName}))`,
        borderColor: `hsl(var(${current.varName}) / 0.3)`,
      }}
    >
      {current.text}
    </Badge>
  );

  if (!onChange) return badge;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Priority label clicked, opening popover");
          }}
        >
          <Badge
            variant="secondary"
            title={current.description}
            aria-label={current.description}
            className={`${size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-xs px-3 py-1"} font-bold cursor-pointer border inline-flex items-center ml-2 rounded-full hover:opacity-80 transition-opacity`}
            style={{
              backgroundColor: `hsl(var(${current.varName}) / 0.3)`,
              color: `hsl(var(${current.varName}))`,
              borderColor: `hsl(var(${current.varName}) / 0.3)`,
            }}
          >
            {current.text}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-2">
        <div className="text-xs font-medium mb-2">Set priority</div>
        <div className="flex items-center gap-2">
          {(Object.keys(labelMap) as TopicPriority[]).map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                handlePriorityChange(p);
              }}
            >
              <Badge
                role="button"
                title={labelMap[p].description}
                aria-label={labelMap[p].description}
                className={`text-[11px] px-2.5 py-0.5 cursor-pointer border font-bold rounded-full transition-all hover:opacity-80 ${p === priority ? "ring-2 ring-ring" : ""}`}
                style={{
                  backgroundColor: `hsl(var(${labelMap[p].varName}) / 0.3)`,
                  color: `hsl(var(${labelMap[p].varName}))`,
                  borderColor: `hsl(var(${labelMap[p].varName}) / 0.3)`,
                }}
              >
                {labelMap[p].text}
              </Badge>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
