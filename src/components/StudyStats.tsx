import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Target, TrendingUp, Edit3 } from "lucide-react";
import { TopicPriorityLabel, type TopicPriority } from "../components/TopicPriorityLabel";

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
  priority?: TopicPriority;
}

interface StudyStatsProps {
  hoursStudied: number;
  totalHours: number;
  topics: Topic[];
  lastQuizResult: number;
  weeklyHours?: number;
  weeklyGoal?: number;
  isWeeklyView?: boolean;
  onEditGoals?: () => void;
  onTopicPriorityChange?: (topicId: string, priority: TopicPriority) => void;
}

export function StudyStats({ 
  hoursStudied, 
  totalHours, 
  topics, 
  lastQuizResult, 
  weeklyHours = 0, 
  weeklyGoal = 35, 
  isWeeklyView = false,
  onEditGoals,
  onTopicPriorityChange,
}: StudyStatsProps) {
  const progressPercent = isWeeklyView 
    ? (weeklyHours / weeklyGoal) * 100 
    : (hoursStudied / totalHours) * 100;
  
  const currentHours = isWeeklyView ? weeklyHours : hoursStudied;
  const goalHours = isWeeklyView ? weeklyGoal : totalHours;
  const timeUnit = isWeeklyView ? "week" : "day";

  return (
    <div className="space-y-6">
      {/* Today's Progress Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-study-blue-light to-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-study-blue/10 rounded-lg">
              <Clock className="w-5 h-5 text-study-blue" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {isWeeklyView ? "Weekly Progress" : "Today's Progress"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your {isWeeklyView ? "weekly" : "daily"} goals
              </p>
            </div>
            {onEditGoals && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditGoals}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-study-blue mb-2">
                {currentHours}
                <span className="text-lg text-muted-foreground">/{goalHours}h</span>
              </div>
              <Progress 
                value={progressPercent} 
                className="h-3 bg-study-blue-light/30"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {progressPercent.toFixed(0)}% complete • {goalHours - currentHours}h remaining this {timeUnit}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Subject Progress Card */}
      <Card className="shadow-sm border-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-study-green/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-study-green" />
            </div>
            <div>
              <h3 className="font-semibold">Topic Progress</h3>
              <p className="text-sm text-muted-foreground">Your learning journey</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${topic.color}))` }}
                    />
                    <span className="font-medium">{topic.name}</span>
                    {onTopicPriorityChange && (
                      <TopicPriorityLabel 
                        priority={topic.priority ?? 'medium'} 
                        onChange={(p) => onTopicPriorityChange(topic.id, p)}
                        size="sm"
                      />
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {topic.progress}%
                  </Badge>
                </div>
                <Progress 
                  value={topic.progress} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Achievement Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-study-orange-light to-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-study-orange/10 rounded-lg">
              <Trophy className="w-5 h-5 text-study-orange" />
            </div>
            <div>
              <h3 className="font-semibold">Latest Achievement</h3>
              <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="text-4xl font-bold text-study-orange">
                {lastQuizResult}%
              </div>
              <TrendingUp className="w-6 h-6 text-study-orange" />
            </div>
            <p className="text-sm text-muted-foreground">
              Last Quiz Score
            </p>
            <Badge 
              variant="secondary" 
              className={`${
                lastQuizResult >= 80 
                  ? "bg-study-green-light text-study-green border-study-green/20" 
                  : lastQuizResult >= 60 
                  ? "bg-study-orange-light text-study-orange border-study-orange/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {lastQuizResult >= 80 
                ? "🎉 Excellent!" 
                : lastQuizResult >= 60 
                ? "👍 Good Job!"
                : "📚 Keep Practicing!"
              }
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}