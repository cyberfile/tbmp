import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface StudyStatsProps {
  hoursStudied: number;
  totalHours: number;
  subjects: Subject[];
  lastQuizResult: number;
}

export function StudyStats({ hoursStudied, totalHours, subjects, lastQuizResult }: StudyStatsProps) {
  const studyProgress = (hoursStudied / totalHours) * 100;

  const getColorClass = (color: string) => {
    switch (color) {
      case "study-purple":
        return "text-study-purple";
      case "study-orange":
        return "text-study-orange";
      case "study-green":
        return "text-study-green";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Hours Studied Today */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">Hours Studied Today</div>
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-progress-bg"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-progress-green"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${studyProgress}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold">{hoursStudied}/{totalHours}</div>
                  <div className="text-xs text-muted-foreground">hours</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Areas */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Week Areas</div>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.id} className={`font-medium ${getColorClass(subject.color)}`}>
                  {subject.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Quiz Result */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Last Quiz Result</div>
            <div className="text-3xl font-bold">{lastQuizResult}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}