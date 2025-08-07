import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
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

interface WeeklyViewProps {
  tasks: Task[];
  topics: Topic[];
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void;
  onTasksReorder?: (tasks: Task[]) => void;
}

interface SortableTaskProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

function SortableTask({ task, onTaskClick }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-3 rounded-md border-l-4 bg-card hover:shadow-sm transition-shadow cursor-pointer"
      style={{ 
        borderLeftColor: `hsl(var(--${task.color}))`,
        ...style
      }}
      onClick={() => onTaskClick(task)}
    >
      <div className="text-sm font-medium">{task.title}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {task.topic} • {task.startTime}
      </div>
      <Badge 
        variant="secondary" 
        className="mt-1 text-xs"
        style={{ 
          backgroundColor: `hsl(var(--${task.color}))`,
          color: 'white'
        }}
      >
        {task.topic}
      </Badge>
    </div>
  );
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklyView({ tasks, topics, onTaskClick, onAddTask, onTasksReorder }: WeeklyViewProps) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newTasks = arrayMove(items, oldIndex, newIndex);
        
        if (onTasksReorder) {
          onTasksReorder(newTasks);
        }
        
        return newTasks;
      });
    }
  };
  const getColorClasses = (color: string) => {
    switch (color) {
      case "study-purple":
        return "bg-study-purple text-white";
      case "study-orange":
        return "bg-study-orange text-white";
      case "study-green":
        return "bg-study-green text-white";
      case "study-blue":
        return "bg-study-blue text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // For demo purposes, distribute tasks across the week
  const getTasksForDay = (dayIndex: number) => {
    return sortedTasks.filter((_, index) => index % 7 === dayIndex);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Overview</CardTitle>
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
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {daysOfWeek.map((day, index) => {
              const dayTasks = getTasksForDay(index);
              
              return (
                <div key={day} className="space-y-3">
                  <div className="font-medium text-sm text-center py-2 bg-secondary rounded-md">
                    {day}
                  </div>
                  <SortableContext items={dayTasks} strategy={rectSortingStrategy}>
                    <div className="space-y-2 min-h-[200px]">
                      {dayTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onTaskClick={onTaskClick}
                        />
                      ))}
                      {dayTasks.length === 0 && (
                        <div className="text-muted-foreground text-sm text-center py-8">
                          No tasks scheduled
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </DndContext>
      </CardContent>
    </Card>
  );
}