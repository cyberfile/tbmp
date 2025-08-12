import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, Clock, Plus, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopicPriorityLabel, type TopicPriority } from "./TopicPriorityLabel";

const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

const to12h = (time: string) => {
  if (!time) return time;
  const t = time.trim();
  if (/am|pm/i.test(t)) return t.replace(/\s?(am|pm)/i, ' $1').toLowerCase();
  const [h, m = '00'] = t.split(':');
  let hh = parseInt(h || '0', 10);
  const ampm = hh >= 12 ? 'pm' : 'am';
  hh = hh % 12; if (hh === 0) hh = 12;
  return `${hh}:${m.padStart(2, '0')} ${ampm}`;
};

interface Task {
  id: string;
  title: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
  priority?: TopicPriority;
}

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
  priority?: TopicPriority;
}

interface TaskListProps {
  tasks: Task[];
  topics: Topic[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  selectedPriority: TopicPriority | "All";
  onPriorityChange: (priority: TopicPriority | "All") => void;
  onTaskToggle: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void;
  onTopicPriorityChange?: (topicId: string, priority: TopicPriority) => void;
  onTaskPriorityChange?: (taskId: string, priority: TopicPriority) => void;
}

interface SortableTaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onClick: (task: Task) => void;
  onPriorityChange?: (taskId: string, priority: TopicPriority) => void;
}

function SortableTaskItem({ task, onToggle, onClick, onPriorityChange }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityTitle = `${(task.priority ?? 'medium').charAt(0).toUpperCase()}${(task.priority ?? 'medium').slice(1)} priority`;

  return (
      <Card 
        ref={setNodeRef}
        style={{ ...style, borderLeftColor: resolveColor(task.color) }}
      className={cn(
        "group cursor-move transition-all duration-200 hover:shadow-md border border-border shadow-sm border-l-4",
        isDragging && "ring-2 ring-study-blue/40",
        task.completed && "opacity-60 scale-[0.98]"
      )}
      onClick={() => onClick(task)}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggle(task.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 data-[state=checked]:bg-study-green data-[state=checked]:border-study-green"
          />
          
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: resolveColor(task.color) }}
          />
          
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-semibold text-foreground mb-1",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
              <div className="flex items-center gap-4 text-sm">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-1"
                  style={{ 
                    backgroundColor: resolveColor(task.color),
                    color: 'white'
                  }}
                >
                  {task.topic}
                </Badge>
                <div title={priorityTitle}>
                  <TopicPriorityLabel 
                    priority={task.priority ?? 'medium'} 
                    onChange={(p) => onPriorityChange?.(task.id, p)} 
                    size="sm"
                  />
                </div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {to12h(task.startTime)} - {to12h(task.endTime)}
                </span>
              </div>
          </div>
          
          <button 
            aria-label="Drag task"
            className="p-1 -mr-1 text-muted-foreground hover:text-foreground cursor-grab flex-shrink-0"
            {...attributes}
            {...listeners}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export function TaskList({ tasks, topics, selectedTopic, onTopicChange, selectedPriority, onPriorityChange, onTaskToggle, onTaskClick, onAddTask, onTopicPriorityChange, onTaskPriorityChange }: TaskListProps) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  
  const priorityOptions = [
    { value: "All", label: "All Priorities", text: "All", varName: "--foreground" },
    { value: "none", label: "No Priority", text: "-", varName: "--muted", hasOutline: true },
    { value: "low", label: "Low Priority", text: "!", varName: "--priority-low" },
    { value: "medium", label: "Medium Priority", text: "!!", varName: "--priority-medium" },
    { value: "high", label: "High Priority", text: "!!!", varName: "--priority-high" },
  ];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap p-4 bg-muted/30 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filters:</span>
        </div>
        
        {/* Topic Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <div className="flex items-center gap-2">
                {selectedTopic !== "All" && (
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: resolveColor(topics.find(t => t.name === selectedTopic)?.color) }}
                  />
                )}
                <span>{selectedTopic === "All" ? "All Topics" : selectedTopic}</span>
              </div>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[9999] bg-background border shadow-lg">
            <DropdownMenuItem onClick={() => onTopicChange("All")}>
              <span>All Topics</span>
            </DropdownMenuItem>
            {topics.map((topic) => (
              <DropdownMenuItem key={topic.id} onClick={() => onTopicChange(topic.name)}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: resolveColor(topic.color) }}
                  />
                  <span>{topic.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <div className="flex items-center gap-2">
                {selectedPriority !== "All" && (
                  <span 
                    className="text-[11px] font-bold"
                    style={{ 
                      color: `hsl(var(${priorityOptions.find(p => p.value === selectedPriority)?.varName}))` 
                    }}
                  >
                    {priorityOptions.find(p => p.value === selectedPriority)?.text}
                  </span>
                )}
                <span>{priorityOptions.find(p => p.value === selectedPriority)?.label}</span>
              </div>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[9999] bg-background border shadow-lg">
            {priorityOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => onPriorityChange(option.value as TopicPriority | "All")}>
                <div className="flex items-center gap-2">
                  {option.value !== "All" && (
                    <span 
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full border ${option.hasOutline ? "border-2 bg-transparent" : ""}`}
                      style={{
                        backgroundColor: option.hasOutline ? 'transparent' : `hsl(var(${option.varName}) / 0.3)`,
                        color: `hsl(var(${option.varName}))`,
                        borderColor: `hsl(var(${option.varName}) / ${option.hasOutline ? '0.8' : '0.3'})`,
                      }}
                    >
                      {option.text}
                    </span>
                  )}
                  <span>{option.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Today's Schedule</h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-study-blue-light text-study-blue">
              {tasks.length} tasks
            </Badge>
            {onAddTask && (
              <Button 
                size="sm" 
                onClick={onAddTask} 
                className="gap-2 bg-study-blue hover:bg-study-blue/90"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            )}
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedTasks} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  onClick={onTaskClick}
                  onPriorityChange={onTaskPriorityChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {tasks.length === 0 && (
          <Card className="shadow-sm border-0">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">No tasks found</h4>
              <p className="text-muted-foreground">
                {selectedTopic === "All" 
                  ? "You don't have any tasks scheduled for today."
                  : `No tasks found for ${selectedTopic}.`
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}