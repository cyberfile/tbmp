import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Clock, Bell, Printer, Lock, Settings } from "lucide-react";
import { TaskList } from "./TaskList";
import { WeeklyView } from "./WeeklyView";
import { StudyStats } from "./StudyStats";
import { SubjectManager } from "./SubjectManager";
import { NotificationSettings } from "./NotificationSettings";
import { PrintableView } from "./PrintableView";

interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface Task {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color: string;
}

const initialSubjects: Subject[] = [
  { id: "1", name: "Cells", color: "study-purple", progress: 75 },
  { id: "2", name: "Algebra", color: "study-orange", progress: 60 },
  { id: "3", name: "Python", color: "study-green", progress: 40 },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Cell Functions",
    subject: "Cells",
    startTime: "1:00 pm",
    endTime: "2:00pm",
    completed: false,
    color: "study-purple",
  },
  {
    id: "2",
    title: "Booleans",
    subject: "Python",
    startTime: "7:00 pm",
    endTime: "8:00pm",
    completed: false,
    color: "study-orange",
  },
  {
    id: "3",
    title: "Exponential Functions",
    subject: "Algebra",
    startTime: "2:30 pm",
    endTime: "3:15pm",
    completed: false,
    color: "study-green",
  },
  {
    id: "4",
    title: "Cell Quiz",
    subject: "Cells",
    startTime: "4:00 pm",
    endTime: "4:30pm",
    completed: false,
    color: "study-purple",
  },
  {
    id: "5",
    title: "Graphing",
    subject: "Algebra",
    startTime: "6:00 pm",
    endTime: "6:30pm",
    completed: false,
    color: "study-green",
  },
];

export function StudyPlanner() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [printViewType, setPrintViewType] = useState<"weekly" | "monthly">("weekly");

  const hoursStudiedToday = 4;
  const totalHoursGoal = 5;
  const lastQuizResult = 70;

  const studyProgress = (hoursStudiedToday / totalHoursGoal) * 100;

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = selectedTopic === "All" 
    ? tasks 
    : tasks.filter(task => task.subject === selectedTopic);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowPrintView(true)}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Title and Tags */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">New Study Planner</h1>
          <p className="text-muted-foreground">Plan and track your study sessions efficiently</p>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Tags</span>
            <Badge variant="secondary" className="bg-study-pink-light text-study-purple">
              Tag 1
            </Badge>
            <Badge variant="secondary" className="bg-study-green-light text-study-green">
              Tag 2
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <StudyStats 
              hoursStudied={hoursStudiedToday}
              totalHours={totalHoursGoal}
              subjects={subjects}
              lastQuizResult={lastQuizResult}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Toggle */}
            <Tabs value={view} onValueChange={(value) => setView(value as "daily" | "weekly")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Daily View
                </TabsTrigger>
                <TabsTrigger value="weekly" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Weekly View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-6">
                <TaskList 
                  tasks={filteredTasks}
                  subjects={subjects}
                  selectedTopic={selectedTopic}
                  onTopicChange={setSelectedTopic}
                  onTaskToggle={toggleTaskCompletion}
                />
              </TabsContent>

              <TabsContent value="weekly" className="space-y-6">
                <WeeklyView tasks={tasks} subjects={subjects} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <NotificationSettings onClose={() => setShowNotifications(false)} />
        </div>
      )}

      {/* Printable View Modal */}
      {showPrintView && (
        <PrintableView
          tasks={tasks}
          subjects={subjects}
          viewType={printViewType}
          onClose={() => setShowPrintView(false)}
        />
      )}
    </div>
  );
}