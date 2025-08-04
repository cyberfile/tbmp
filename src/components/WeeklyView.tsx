import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface WeeklyViewProps {
  tasks: Task[];
  subjects: Subject[];
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklyView({ tasks, subjects }: WeeklyViewProps) {
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
    return tasks.filter((_, index) => index % 7 === dayIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {daysOfWeek.map((day, index) => {
            const dayTasks = getTasksForDay(index);
            
            return (
              <div key={day} className="space-y-3">
                <div className="font-medium text-sm text-center py-2 bg-secondary rounded-md">
                  {day}
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {dayTasks.map((task) => (
                    <div
                      key={`${day}-${task.id}`}
                      className={`p-3 rounded-md text-sm ${getColorClasses(task.color)} ${
                        task.completed ? "opacity-60 line-through" : ""
                      }`}
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs opacity-90">
                        {task.startTime} - {task.endTime}
                      </div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {task.subject}
                      </Badge>
                    </div>
                  ))}
                  {dayTasks.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-8">
                      No tasks scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}