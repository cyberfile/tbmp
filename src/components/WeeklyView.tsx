import { useEffect, useMemo, useState } from "react";
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
  useDroppable,
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
    isDragging,
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
      className={`p-3 rounded-md border-l-4 bg-card hover:shadow-sm transition-shadow cursor-pointer ${isDragging ? 'shadow-lg ring-2 ring-study-blue/40' : ''}`}
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

function DayColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`rounded-md p-1 ${isOver ? 'ring-2 ring-study-blue/40' : ''}`}>
      {children}
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

  const tasksById = useMemo(() => {
    const map: Record<string, Task> = {};
    tasks.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tasks]);

  const [columns, setColumns] = useState<Record<number, string[]>>(() => {
    const cols: Record<number, string[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    tasks.forEach((t, i) => { cols[i % 7].push(t.id); });
    return cols;
  });

  useEffect(() => {
    const allIds = tasks.map(t => t.id);
    const existing = new Set(Object.values(columns).flat());
    const toAdd = allIds.filter(id => !existing.has(id));
    if (toAdd.length) {
      setColumns(prev => ({ ...prev, 0: [...prev[0], ...toAdd] }));
    }
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setColumns((cols) => {
      const findContainer = (id: string): number | undefined => {
        const keys = Object.keys(cols).map(Number);
        return keys.find((day) => cols[day].includes(id));
      };

      const sourceDay = findContainer(activeId);
      const targetDay = overId.startsWith('day-') ? Number(overId.split('-')[1]) : findContainer(overId);
      if (sourceDay === undefined || targetDay === undefined) return cols;

      if (sourceDay === targetDay) {
        const ids = cols[sourceDay];
        const oldIndex = ids.indexOf(activeId);
        const newIndex = overId.startsWith('day-') ? ids.length - 1 : ids.indexOf(overId);
        if (oldIndex !== newIndex) {
          const newIds = arrayMove(ids, oldIndex, newIndex);
          const updated = { ...cols, [sourceDay]: newIds };
          if (onTasksReorder) {
            const orderedTasks = Object.values(updated).flat().map((id) => tasksById[id]);
            onTasksReorder(orderedTasks);
          }
          return updated;
        }
        return cols;
      } else {
        const next = { ...cols };
        next[sourceDay] = next[sourceDay].filter((id) => id !== activeId);
        const targetIds = next[targetDay];
        const insertIndex = overId.startsWith('day-') ? targetIds.length : targetIds.indexOf(overId);
        next[targetDay] = [
          ...targetIds.slice(0, insertIndex),
          activeId,
          ...targetIds.slice(insertIndex),
        ];
        if (onTasksReorder) {
          const orderedTasks = Object.values(next).flat().map((id) => tasksById[id]);
          onTasksReorder(orderedTasks);
        }
        return next;
      }
    });
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

  const getTasksForDay = (dayIndex: number) => {
    const ids = columns[dayIndex] || [];
    return ids.map((id) => tasksById[id]).filter(Boolean);
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
                  <DayColumn id={`day-${index}`}>
                    <SortableContext items={columns[index] ?? []} strategy={rectSortingStrategy}>
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
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DayColumn>
                </div>
              );
            })}
          </div>
        </DndContext>
      </CardContent>
    </Card>
  );
}