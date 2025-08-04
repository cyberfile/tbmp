import { useState } from "react";
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
import { GripVertical } from "lucide-react";

interface Task {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface TaskListProps {
  tasks: Task[];
  subjects: Subject[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  onTaskToggle: (taskId: string) => void;
}

interface SortableTaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

function SortableTaskItem({ task, onToggle }: SortableTaskItemProps) {
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case "study-purple":
        return "border-l-study-purple bg-study-purple-light/30";
      case "study-orange":
        return "border-l-study-orange bg-study-orange-light/30";
      case "study-green":
        return "border-l-study-green bg-study-green-light/30";
      case "study-blue":
        return "border-l-study-blue bg-study-blue-light/30";
      default:
        return "border-l-gray-400 bg-gray-50";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${getColorClasses(task.color)} ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="data-[state=checked]:bg-progress-green data-[state=checked]:border-progress-green"
      />
      
      <div className="flex-1">
        <div className={`font-medium ${task.completed ? "line-through" : ""}`}>
          {task.title}
        </div>
        <div className="text-sm text-muted-foreground">
          {task.startTime} - {task.endTime}
        </div>
      </div>
    </div>
  );
}

export function TaskList({ tasks, subjects, selectedTopic, onTopicChange, onTaskToggle }: TaskListProps) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const topics = ["All", ...subjects.map(s => s.name)];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Topic</span>
            <div className="flex gap-1">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTopic === topic 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => onTopicChange(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedTasks} strategy={verticalListSortingStrategy}>
            {sortedTasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onToggle={onTaskToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}