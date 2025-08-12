import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, X } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

const toUTC12h = (time: string) => {
  if (!time) return "";
  const [hStr, mStr = '0'] = time.split(':');
  const d = new Date();
  d.setHours(Number(hStr) || 0, Number(mStr) || 0, 0, 0);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  const mm = String(m).padStart(2,'0');
  return `${h}:${mm} ${ampm}`;
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
  dayIndex?: number;
  priority?: 'low' | 'medium' | 'high';
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
  const [notes, setNotes] = useState("");
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const node = document.getElementById('printable-content');
    if (!node) return;

    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft * -1;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save(`study-plan-${viewType}.pdf`);
  };

  const getTasksGroupedByDay = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek.map((day, index) => ({
      day,
      tasks: tasks.filter((t) => (t.dayIndex ?? 0) === index)
    }));
  };

  const groupedTasks = getTasksGroupedByDay();
  const leftDays = groupedTasks.slice(0, 4);
  const rightDays = groupedTasks.slice(4);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <style>
        {`
          @page { size: A4 portrait; margin: 10mm; }
          @media print {
            html, body { padding: 0; margin: 0; }
            body * { visibility: hidden; }
            #printable-content, #printable-content * { visibility: visible; }
            #printable-content { position: static; width: 100%; font-size: 12px; }
            .no-print { display: none !important; }
            .day-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
            .day-card { break-inside: avoid; page-break-inside: avoid; }
            .notes-area { break-inside: avoid; page-break-inside: avoid; }
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Study Planner</h1>
              <p className="text-sm text-muted-foreground">Topic-based learning schedule</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {viewType === "weekly" ? "Weekly Overview" : "Monthly Overview"} - {new Date().toLocaleDateString()}
            </div>
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

            {viewType === "weekly" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 day-grid">
                <div className="space-y-4">
                  {leftDays.map(({ day, tasks: dayTasks }) => (
                    <div key={day} className="day-card border rounded p-2">
                      <h3 className="text-sm font-semibold border-b pb-1 mb-2">{day}</h3>
                      {dayTasks.length > 0 ? (
                        <div className="space-y-1">
                          {dayTasks.map((task) => (
                            <div key={task.id} className="p-2 bg-white rounded border" style={{ borderLeft: '4px solid', borderLeftColor: resolveColor(task.color) }}>
                              <div className="font-medium text-sm break-words">{task.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded border text-white" style={{ backgroundColor: resolveColor(task.color), borderColor: resolveColor(task.color) }}>{task.topic}</span>
                                <span
                                  className="inline-flex items-center text-[10px] px-2 py-0.5 border rounded"
                                  title={`${(task.priority ?? 'medium').charAt(0).toUpperCase()}${(task.priority ?? 'medium').slice(1)} priority`}
                                  style={{
                                    backgroundColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                                    color: `hsl(var(--priority-${task.priority ?? 'medium'}))`,
                                    borderColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                                  }}
                                >
                                  {'!'.repeat(task.priority === 'high' ? 3 : task.priority === 'low' ? 1 : 2)}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {toUTC12h(task.startTime)} - {toUTC12h(task.endTime)} UTC
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-xs">No tasks</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {rightDays.map(({ day, tasks: dayTasks }) => (
                    <div key={day} className="day-card border rounded p-2">
                      <h3 className="text-sm font-semibold border-b pb-1 mb-2">{day}</h3>
                      {dayTasks.length > 0 ? (
                        <div className="space-y-1">
                        {dayTasks.map((task) => (
                          <div key={task.id} className="p-2 bg-white rounded border" style={{ borderLeft: '4px solid', borderLeftColor: resolveColor(task.color) }}>
                            <div className="font-medium text-sm break-words">{task.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded border text-white" style={{ backgroundColor: resolveColor(task.color), borderColor: resolveColor(task.color) }}>{task.topic}</span>
                              <span
                                className="inline-flex items-center text-[10px] px-2 py-0.5 border rounded"
                                title={`${(task.priority ?? 'medium').charAt(0).toUpperCase()}${(task.priority ?? 'medium').slice(1)} priority`}
                                style={{
                                  backgroundColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                                  color: `hsl(var(--priority-${task.priority ?? 'medium'}))`,
                                  borderColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                                }}
                              >
                                {'!'.repeat(task.priority === 'high' ? 3 : task.priority === 'low' ? 1 : 2)}
                              </span>
                              <span className="text-xs text-gray-600">
                                {toUTC12h(task.startTime)} - {toUTC12h(task.endTime)} UTC
                              </span>
                            </div>
                          </div>
                        ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-xs">No tasks</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Monthly Schedule */}
          {viewType === "monthly" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Tasks</h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border" style={{ borderLeft: '4px solid', borderLeftColor: resolveColor(task.color) }}>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded border text-white" style={{ backgroundColor: resolveColor(task.color), borderColor: resolveColor(task.color) }}>{task.topic}</span>
                        <span
                          className="inline-flex items-center text-[10px] px-2 py-0.5 border rounded"
                          title={`${(task.priority ?? 'medium').charAt(0).toUpperCase()}${(task.priority ?? 'medium').slice(1)} priority`}
                          style={{
                            backgroundColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                            color: `hsl(var(--priority-${task.priority ?? 'medium'}))`,
                            borderColor: `hsl(var(--priority-${task.priority ?? 'medium'}) / 0.3)`,
                          }}
                        >
                          {'!'.repeat(task.priority === 'high' ? 3 : task.priority === 'low' ? 1 : 2)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {toUTC12h(task.startTime)} - {toUTC12h(task.endTime)} UTC
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Extra Notes (optional) */}
            <div className="mt-8 notes-area">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
<textarea
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  rows={8}
  className="w-full border rounded-md p-3 text-sm resize-none min-h-[160px]"
/>
            </div>

        </div>
      </div>
    </div>
  );
}