import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { GripVertical, Calendar, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
}

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface TaskListProps {
  tasks: Task[];
  topics: Topic[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void;
}

interface SortableTaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onClick: (task: Task) => void;
}

function SortableTaskItem({ task, onToggle, onClick }: SortableTaskItemProps) {
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

  return (
    <Card 
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: `hsl(var(--${task.color}))` }}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-move transition-all duration-200 hover:shadow-md border-0 shadow-sm border-l-4",
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
            className="flex-shrink-0 data-[state=checked]:bg-study-green data-[state=checked]:border-study-green"
          />
          
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: `hsl(var(--${task.color}))` }}
          />
          
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-semibold text-foreground mb-1",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: `hsl(var(--${task.color}))`,
                  color: 'white'
                }}
              >
                {task.topic}
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.startTime} - {task.endTime}
              </span>
            </div>
          </div>
          
          <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
        </div>
      </div>
    </Card>
  );
}

export function TaskList({ tasks, topics, selectedTopic, onTopicChange, onTaskToggle, onTaskClick, onAddTask }: TaskListProps) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  
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
      {/* Subject Filter */}
      <div className="flex items-center gap-3 flex-wrap p-4 bg-muted/30 rounded-xl">
        <span className="text-sm font-semibold text-foreground">Filter by topic:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedTopic === "All" ? "default" : "secondary"}
            onClick={() => onTopicChange("All")}
            className={selectedTopic === "All" ? "bg-study-blue hover:bg-study-blue/90" : ""}
          >
            All Topics
          </Button>
          {topics.map((topic) => (
            <Button
              key={topic.id}
              size="sm"
              variant={selectedTopic === topic.name ? "default" : "secondary"}
              onClick={() => onTopicChange(topic.name)}
                className={
                  selectedTopic === topic.name
                    ? "text-white shadow-sm"
                    : "hover:bg-muted"
                }
                style={
                  selectedTopic === topic.name 
                    ? { backgroundColor: `hsl(var(--${topic.color}))` }
                    : undefined
                }
            >
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: `hsl(var(--${topic.color}))` }}
              />
              {topic.name}
            </Button>
          ))}
        </div>
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