import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, Clock, Bell, Printer, Settings, LogOut } from "lucide-react";
import { TaskList } from "./TaskList";
import { WeeklyView } from "./WeeklyView";
import { StudyStats } from "./StudyStats";
import { TopicManager } from "./TopicManager";
import { NotificationSettings } from "./NotificationSettings";
import { PrintableView } from "./PrintableView";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditGoalsModal } from "./EditGoalsModal";
import type { TopicPriority } from "./TopicPriorityLabel";

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
  priority?: TopicPriority;
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
  reminderMinutesBefore?: number;
  dayIndex?: number;
  details?: string;
  priority?: TopicPriority;
}

const initialTopics: Topic[] = [
  { id: "1", name: "Topic 1", color: "study-purple", progress: 75, priority: "medium" },
  { id: "2", name: "Topic 2", color: "study-orange", progress: 60, priority: "high" },
  { id: "3", name: "Topic 3", color: "study-green", progress: 40, priority: "low" },
  { id: "4", name: "Topic 4", color: "study-blue", progress: 20, priority: "medium" },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Introduction to Fundamentals",
    subject: "Mathematics",
    topic: "Topic 1",
    startTime: "13:00",
    endTime: "14:00",
    completed: false,
    color: "study-purple",
    dayIndex: 0,
    priority: "medium",
  },
  {
    id: "2",
    title: "Basic Concepts Review",
    subject: "Mathematics",
    topic: "Topic 2",
    startTime: "14:30",
    endTime: "15:15",
    completed: false,
    color: "study-orange",
    dayIndex: 1,
    priority: "high",
  },
  {
    id: "3",
    title: "Advanced Methods",
    subject: "Mathematics",
    topic: "Topic 3",
    startTime: "16:00",
    endTime: "16:30",
    completed: false,
    color: "study-green",
    dayIndex: 2,
    priority: "low",
  },
  {
    id: "4",
    title: "Problem Solving",
    subject: "Mathematics",
    topic: "Topic 1",
    startTime: "18:00",
    endTime: "18:30",
    completed: false,
    color: "study-purple",
    dayIndex: 3,
    priority: "medium",
  },
  {
    id: "5",
    title: "Practice Questions",
    subject: "Mathematics",
    topic: "Topic 4",
    startTime: "19:00",
    endTime: "20:00",
    completed: false,
    color: "study-blue",
    dayIndex: 4,
    priority: "medium",
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

  const [plannerTitle, setPlannerTitle] = useState("Mathematics Study Planner");
  const [plannerDescription, setPlannerDescription] = useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const mondayBasedToday = (new Date().getDay() + 6) % 7; // 0 = Monday
  const [selectedDay, setSelectedDay] = useState<number>(mondayBasedToday);

  const hoursStudiedToday = 4;
  const [totalHoursGoal, setTotalHoursGoal] = useState(5);
  const lastQuizResult = 70;
  const studyProgress = (hoursStudiedToday / totalHoursGoal) * 100;

  const computeTopicsProgress = (allTasks: Task[], allTopics: Topic[]) => {
    return allTopics.map((t) => {
      const topicTasks = allTasks.filter((ts) => ts.topic === t.name);
      const completed = topicTasks.filter((ts) => ts.completed).length;
      const total = topicTasks.length;
      const progress = total ? Math.round((completed / total) * 100) : 0;
      return { ...t, progress };
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTopics((prevTopics) => computeTopicsProgress(updated, prevTopics));
      return updated;
    });
  };

  const handleTopicsChange = (updatedTopics: Topic[]) => {
    setTopics((prevTopics) => {
      const prevById: Record<string, Topic> = {};
      prevTopics.forEach((t) => (prevById[t.id] = t));
      const renameMap: Record<string, string> = {};
      const priorityChangeByName: Record<string, TopicPriority | undefined> = {};
      updatedTopics.forEach((t) => {
        const prev = prevById[t.id];
        if (prev) {
          if (prev.name !== t.name) {
            renameMap[prev.name] = t.name;
          }
          if (prev.priority !== t.priority) {
            priorityChangeByName[t.name] = t.priority;
          }
        }
      });

      if (Object.keys(renameMap).length || Object.keys(priorityChangeByName).length) {
        setTasks((prevTasks) => prevTasks.map((task) => {
          // Apply topic rename first if any
          const newName = renameMap[task.topic];
          const topicNameAfterRename = newName ? newName : task.topic;

          // Apply priority sync if the topic has a new priority defined
          const newPriority = priorityChangeByName[topicNameAfterRename];
          if (newName || newPriority) {
            return {
              ...task,
              topic: topicNameAfterRename,
              ...(newPriority ? { priority: newPriority } : {}),
            };
          }
          return task;
        }));
      }
      return updatedTopics;
    });
  };

  const handleTopicPriorityChange = (topicId: string, priority: TopicPriority) => {
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, priority } : t)));
    setTasks((prev) => prev.map((task) => {
      const topic = topics.find((t) => t.id === topicId);
      if (!topic) return task;
      return task.topic === topic.name ? { ...task, priority } : task;
    }));
  };

  const tasksForDay = tasks.filter(t => (t.dayIndex ?? 0) === selectedDay);
  const filteredTasks = selectedTopic === "All" 
    ? tasksForDay 
    : tasksForDay.filter(task => task.topic === selectedTopic);

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task); // Debug log
    setSelectedTask(task);
    setShowNoteUpload(true);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
      dayIndex: newTask.dayIndex ?? selectedDay,
    };
    setTasks((prev) => {
      const next = [...prev, task];
      setTopics((prevTopics) => computeTopicsProgress(next, prevTopics));
      return next;
    });
  };

  const handleUpdateGoals = (daily: number, weekly: number) => {
    setTotalHoursGoal(daily);
    setWeeklyGoal(weekly);
  };

  const handleTasksReorder = (reorderedTasks: Task[]) => {
    setTasks(() => {
      setTopics((prevTopics) => computeTopicsProgress(reorderedTasks, prevTopics));
      return reorderedTasks;
    });
  };

  const handleTaskDayChange = (taskId: string, dayIndex: number) => {
    setTasks((prev) => {
      const next = prev.map(t => t.id === taskId ? { ...t, dayIndex } : t);
      setTopics((prevTopics) => computeTopicsProgress(next, prevTopics));
      return next;
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => {
      const next = prev.map(t => t.id === updatedTask.id ? updatedTask : t);
      setTopics((prevTopics) => computeTopicsProgress(next, prevTopics));
      return next;
    });
  };

  const handleTaskPriorityChange = (taskId: string, priority: TopicPriority) => {
    setTasks((prev) => {
      const next = prev.map(t => t.id === taskId ? { ...t, priority } : t);
      setTopics((prevTopics) => computeTopicsProgress(next, prevTopics));
      return next;
    });
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
              <Button variant="outline" size="sm" className="gap-2 border-study-blue text-study-blue bg-transparent hover:bg-study-blue/10 rounded-lg">
                <span className="inline-flex items-center justify-center rounded-sm w-5 h-5 border border-study-blue text-study-blue bg-transparent">
                  <LogOut className="w-3.5 h-3.5" />
                </span>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="max-w-2xl">
            {isEditingTitle ? (
              <Input
                value={plannerTitle}
                onChange={(e) => setPlannerTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                className="h-10 text-2xl font-bold"
                aria-label="Planner title"
              />
            ) : (
              <h1
                className="text-3xl font-bold cursor-text"
                onClick={() => setIsEditingTitle(true)}
              >
                {plannerTitle}
              </h1>
            )}
            <div className="mt-2">
              {isEditingDescription ? (
                <Textarea
                  value={plannerDescription}
                  onChange={(e) => setPlannerDescription(e.target.value)}
                  onBlur={() => setIsEditingDescription(false)}
                  placeholder="Add an optional description"
                  className="min-h-[60px]"
                  aria-label="Planner description"
                />
              ) : (
                <button
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {plannerDescription ? plannerDescription : "Add an optional description"}
                </button>
              )}
            </div>
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
              onTopicPriorityChange={handleTopicPriorityChange}
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
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d, i) => (
                        <Button
                          key={i}
                          size="sm"
                          variant={selectedDay === i ? 'default' : 'outline'}
                          className={selectedDay === i ? 'bg-study-blue text-white' : ''}
                          onClick={() => setSelectedDay(i)}
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                    <TaskList 
                      tasks={filteredTasks}
                      topics={topics}
                      selectedTopic={selectedTopic}
                      onTopicChange={setSelectedTopic}
                      onTaskToggle={toggleTaskCompletion}
                      onTaskClick={handleTaskClick}
                      onAddTask={() => setShowAddTask(true)}
                      onTopicPriorityChange={handleTopicPriorityChange}
                      onTaskPriorityChange={handleTaskPriorityChange}
                    />
                  </TabsContent>

                  <TabsContent value="weekly" className="space-y-6 mt-0">
                    <WeeklyView 
                      tasks={tasks} 
                      topics={topics} 
                      onTaskClick={handleTaskClick}
                      onAddTask={() => setShowAddTask(true)}
                      onTasksReorder={handleTasksReorder}
                      onTaskDayChange={handleTaskDayChange}
                      onTaskPriorityChange={handleTaskPriorityChange}
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
          onTopicsChange={handleTopicsChange}
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
          plannerTitle={plannerTitle}
        />
      )}

      {/* Task Details Modal */}
      {showNoteUpload && selectedTask && (
        <TaskDetailsModal
          isOpen={true}
          task={selectedTask}
          topics={topics}
          onClose={() => {
            setShowNoteUpload(false);
            setSelectedTask(null);
          }}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={handleAddTask}
        topics={topics}
        defaultDayIndex={selectedDay}
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
