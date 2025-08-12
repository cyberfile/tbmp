import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { TopicPriorityLabel, type TopicPriority } from "./TopicPriorityLabel";
interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
  priority?: TopicPriority;
}

interface Task {
  id: string;
  title: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
  reminderMinutesBefore?: number;
  dayIndex?: number;
  priority?: TopicPriority;
}

const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  topics: Topic[];
  defaultDayIndex?: number;
}

export function AddTaskModal({ isOpen, onClose, onAddTask, topics, defaultDayIndex }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState<string>("");
const [dayIndex, setDayIndex] = useState<number>(defaultDayIndex ?? 0);
const [priority, setPriority] = useState<TopicPriority>('none');

  useEffect(() => {
    const t = topics.find((tt) => tt.name === selectedTopic);
    if (t) {
      setColor(t.color);
      setPriority(t.priority ?? 'none');
    }
  }, [selectedTopic, topics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedTopic || !startTime || !endTime) return;
    
    const topic = topics.find(t => t.name === selectedTopic);
    if (!topic) return;

onAddTask({
  title,
  subject: "Mathematics",
  topic: selectedTopic,
  startTime,
  endTime,
  color: color || topic.color,
  reminderMinutesBefore: 60,
  dayIndex,
  priority,
});

    // Reset form
    setTitle("");
    setSelectedTopic("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Task
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resolveColor(topic.color) }} />
                      {topic.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

<div className="space-y-2">
  <Label htmlFor="color">Task Color</Label>
  <div className="flex items-center gap-3">
    <div
      className="w-4 h-4 rounded-full border"
      style={{ backgroundColor: resolveColor(color) }}
    />
    <label
      htmlFor="color"
      className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center cursor-pointer shadow-sm bg-[conic-gradient(at_50%_50%,_hsl(0_100%_50%),_hsl(60_100%_50%),_hsl(120_100%_45%),_hsl(180_100%_50%),_hsl(240_100%_60%),_hsl(300_100%_50%),_hsl(360_100%_50%))] hover:opacity-90"
      title="Pick custom color"
    >
      <Plus className="w-4 h-4 text-white" />
    </label>
    <input
      id="color"
      type="color"
      value={color && color.startsWith('#') ? color : "#3b82f6"}
      onChange={(e) => setColor(e.target.value)}
      className="sr-only"
      aria-label="Pick custom color"
    />
    <span className="text-xs text-muted-foreground">Defaults to topic color; pick a custom color if you want.</span>
  </div>
</div>

<div className="space-y-2">
  <Label htmlFor="day">Day</Label>
  <Select value={String(dayIndex)} onValueChange={(v) => setDayIndex(Number(v))}>
    <SelectTrigger id="day">
      <SelectValue placeholder="Select day" />
    </SelectTrigger>
    <SelectContent>
      {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d, i) => (
        <SelectItem key={i} value={String(i)}>{d}</SelectItem>
      ))}
    </SelectContent>
</Select>
</div>

<div className="space-y-2">
  <Label htmlFor="priority">Priority</Label>
  <TopicPriorityLabel priority={priority} onChange={setPriority} />
</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Reminder: 1 hour before</p>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-study-blue hover:bg-study-blue/90">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}