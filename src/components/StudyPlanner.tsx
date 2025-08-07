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
import { TopicManager } from "./TopicManager";
import { NotificationSettings } from "./NotificationSettings";
import { PrintableView } from "./PrintableView";
import { NoteUpload } from "./NoteUpload";
import { AddTaskModal } from "./AddTaskModal";
import { EditGoalsModal } from "./EditGoalsModal";

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
}

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

const initialTopics: Topic[] = [
  { id: "1", name: "Topic 1", color: "study-purple", progress: 75 },
  { id: "2", name: "Topic 2", color: "study-orange", progress: 60 },
  { id: "3", name: "Topic 3", color: "study-green", progress: 40 },
  { id: "4", name: "Topic 4", color: "study-blue", progress: 20 },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Introduction to Fundamentals",
    subject: "Mathematics",
    topic: "Topic 1",
    startTime: "1:00 pm",
    endTime: "2:00pm",
    completed: false,
    color: "study-purple",
  },
  {
    id: "2",
    title: "Basic Concepts Review",
    subject: "Mathematics",
    topic: "Topic 2",
    startTime: "2:30 pm",
    endTime: "3:15pm",
    completed: false,
    color: "study-orange",
  },
  {
    id: "3",
    title: "Advanced Methods",
    subject: "Mathematics",
    topic: "Topic 3",
    startTime: "4:00 pm",
    endTime: "4:30pm",
    completed: false,
    color: "study-green",
  },
  {
    id: "4",
    title: "Problem Solving",
    subject: "Mathematics",
    topic: "Topic 1",
    startTime: "6:00 pm",
    endTime: "6:30pm",
    completed: false,
    color: "study-purple",
  },
  {
    id: "5",
    title: "Practice Questions",
    subject: "Mathematics",
    topic: "Topic 4",
    startTime: "7:00 pm",
    endTime: "8:00pm",
    completed: false,
    color: "study-blue",
  },
];

export function StudyPlanner() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [showTopicManager, setShowTopicManager] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showNoteUpload, setShowNoteUpload] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [printViewType, setPrintViewType] = useState<"weekly" | "monthly">("weekly");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(35);
  const [weeklyHours, setWeeklyHours] = useState(28);

  const hoursStudiedToday = 4;
  const [totalHoursGoal, setTotalHoursGoal] = useState(5);
  const lastQuizResult = 70;

  const studyProgress = (hoursStudiedToday / totalHoursGoal) * 100;

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = selectedTopic === "All" 
    ? tasks 
    : tasks.filter(task => task.topic === selectedTopic);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowNoteUpload(true);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([...tasks, task]);
  };

  const handleUpdateGoals = (daily: number, weekly: number) => {
    setTotalHoursGoal(daily);
    setWeeklyGoal(weekly);
  };

  const handleTasksReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

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
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mathematics Study Planner</h1>
            <p className="text-muted-foreground mt-1">
              Organized by topics for focused learning
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowTopicManager(true)}
            >
              <Settings className="w-4 h-4" />
              Manage Topics
            </Button>
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
              Export
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
              topics={topics}
              lastQuizResult={lastQuizResult}
              weeklyHours={weeklyHours}
              weeklyGoal={weeklyGoal}
              isWeeklyView={view === "weekly"}
              onEditGoals={() => setShowEditGoals(true)}
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
                  topics={topics}
                  selectedTopic={selectedTopic}
                  onTopicChange={setSelectedTopic}
                  onTaskToggle={toggleTaskCompletion}
                  onTaskClick={handleTaskClick}
                  onAddTask={() => setShowAddTask(true)}
                />
              </TabsContent>

              <TabsContent value="weekly" className="space-y-6 mt-0">
                <WeeklyView 
                  tasks={tasks} 
                  topics={topics} 
                  onTaskClick={handleTaskClick}
                  onAddTask={() => setShowAddTask(true)}
                  onTasksReorder={handleTasksReorder}
                />
              </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Topic Manager Modal */}
      {showTopicManager && (
        <TopicManager
          topics={topics}
          onTopicsChange={setTopics}
          onClose={() => setShowTopicManager(false)}
        />
      )}

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
          topics={topics}
          viewType={printViewType}
          onClose={() => setShowPrintView(false)}
        />
      )}

      {/* Note Upload Modal */}
      {showNoteUpload && selectedTask && (
        <NoteUpload
          topicName={selectedTask.topic}
          taskTitle={selectedTask.title}
          onClose={() => {
            setShowNoteUpload(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={handleAddTask}
        topics={topics}
      />

      {/* Edit Goals Modal */}
      <EditGoalsModal
        isOpen={showEditGoals}
        onClose={() => setShowEditGoals(false)}
        dailyGoal={totalHoursGoal}
        weeklyGoal={weeklyGoal}
        onUpdateGoals={handleUpdateGoals}
      />
    </div>
  );
}