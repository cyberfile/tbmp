import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, Target, TrendingUp } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface StudyStatsProps {
  hoursStudied: number;
  totalHours: number;
  topics: Topic[];
  lastQuizResult: number;
}

export function StudyStats({ hoursStudied, totalHours, topics, lastQuizResult }: StudyStatsProps) {
  const progressPercent = (hoursStudied / totalHours) * 100;

  return (
    <div className="space-y-6">
      {/* Today's Progress Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-study-blue-light to-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-study-blue/10 rounded-lg">
              <Clock className="w-5 h-5 text-study-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">Track your daily goals</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-study-blue mb-2">
                {hoursStudied}
                <span className="text-lg text-muted-foreground">/{totalHours}h</span>
              </div>
              <Progress 
                value={progressPercent} 
                className="h-3 bg-study-blue-light/30"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {progressPercent.toFixed(0)}% complete • {totalHours - hoursStudied}h remaining
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
                      className={`w-4 h-4 rounded-full bg-${topic.color}`}
                    />
                    <span className="font-medium">{topic.name}</span>
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