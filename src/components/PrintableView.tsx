import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, X } from "lucide-react";

const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

interface Task {
  id: string;
  title: string;
  topic: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
  reminderMinutesBefore?: number;
}

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface PrintableViewProps {
  tasks: Task[];
  topics: Topic[];
  viewType: "weekly" | "monthly";
  onClose: () => void;
}

export function PrintableView({ tasks, topics, viewType, onClose }: PrintableViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    const printContent = document.getElementById('printable-content');
    if (printContent) {
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`
        <html>
          <head>
            <title>Study Plan - ${viewType}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .task { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
              .subject { font-weight: bold; margin: 5px 0; }
              .time { color: #666; font-size: 14px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  const getTasksGroupedByDay = () => {
    // For demo purposes, group tasks by day of week
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek.map((day, index) => ({
      day,
      tasks: tasks.filter((_, taskIndex) => taskIndex % 7 === index)
    }));
  };

  const groupedTasks = getTasksGroupedByDay();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-content, #printable-content * { visibility: visible; }
            #printable-content { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}
      </style>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b no-print">
          <h2 className="text-xl font-bold">
            {viewType === "weekly" ? "Weekly" : "Monthly"} Study Plan
          </h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Printable Content */}
        <div id="printable-content" className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Mathematics Study Planner</h1>
            <p className="text-muted-foreground mb-2">Topic-based learning schedule</p>
            <p className="text-muted-foreground">
              {viewType === "weekly" ? "Weekly" : "Monthly"} Overview - {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Topics Legend */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Topics:</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-2 mr-4 mb-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: resolveColor(topic.color) }}
                  />
                  <span className="text-sm">{topic.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          {viewType === "weekly" && (
            <div className="space-y-6">
              {groupedTasks.map(({ day, tasks: dayTasks }) => (
                <div key={day} className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">{day}</h3>
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border" style={{ borderLeft: '4px solid', borderLeftColor: `hsl(var(--${task.color}))` }}>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {task.topic} • {task.startTime} - {task.endTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No tasks scheduled</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Monthly Schedule */}
          {viewType === "monthly" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Tasks</h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border" style={{ borderLeft: '4px solid', borderLeftColor: `hsl(var(--${task.color}))` }}>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {task.topic} • {task.startTime} - {task.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Extra Notes (optional) */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
              <div className="h-24 border border-dashed rounded-md" />
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()} | Study AI Tool
          </div>
        </div>
      </div>
    </div>
  );
}