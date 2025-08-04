import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, Clock, Bell, Printer, Settings, User } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-study-blue" />
                <span className="text-xl font-bold">StudyAI</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-foreground font-medium">
                  Study Tools
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">aly</span>
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-study-blue to-study-purple bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Study Planner
            <br />
            <span className="text-foreground">For The Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of learning with our AI-powered platform. Personalized 
            study plans, intelligent tools, and adaptive assessments to help you achieve your goals.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="gap-2 bg-study-blue hover:bg-study-blue/90"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-4 h-4" />
              Set Reminders
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={() => setShowPrintView(true)}
            >
              <Printer className="w-4 h-4" />
              Export Schedule
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="space-y-6">
            <StudyStats 
              hoursStudied={hoursStudiedToday}
              totalHours={totalHoursGoal}
              subjects={subjects}
              lastQuizResult={lastQuizResult}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-sm border-0 bg-card">
              <div className="p-6">
                {/* View Toggle */}
                <Tabs value={view} onValueChange={(value) => setView(value as "daily" | "weekly")}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Your Study Schedule</h2>
                    <TabsList className="grid grid-cols-2 w-auto">
                      <TabsTrigger value="daily" className="gap-2 data-[state=active]:bg-study-blue data-[state=active]:text-white">
                        <Calendar className="w-4 h-4" />
                        Daily View
                      </TabsTrigger>
                      <TabsTrigger value="weekly" className="gap-2 data-[state=active]:bg-study-blue data-[state=active]:text-white">
                        <Clock className="w-4 h-4" />
                        Weekly View
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="daily" className="space-y-6 mt-0">
                    <TaskList 
                      tasks={filteredTasks}
                      subjects={subjects}
                      selectedTopic={selectedTopic}
                      onTopicChange={setSelectedTopic}
                      onTaskToggle={toggleTaskCompletion}
                    />
                  </TabsContent>

                  <TabsContent value="weekly" className="space-y-6 mt-0">
                    <WeeklyView tasks={tasks} subjects={subjects} />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
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