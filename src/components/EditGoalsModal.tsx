import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

interface EditGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: number;
  weeklyGoal: number;
  onUpdateGoals: (daily: number, weekly: number) => void;
}

export function EditGoalsModal({ isOpen, onClose, dailyGoal, weeklyGoal, onUpdateGoals }: EditGoalsModalProps) {
  const [newDailyGoal, setNewDailyGoal] = useState(dailyGoal.toString());
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(weeklyGoal.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const daily = parseFloat(newDailyGoal);
    const weekly = parseFloat(newWeeklyGoal);
    
    if (daily > 0 && weekly > 0) {
      onUpdateGoals(daily, weekly);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Edit Study Goals
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Daily Study Goal (hours)</Label>
            <Input
              id="dailyGoal"
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              value={newDailyGoal}
              onChange={(e) => setNewDailyGoal(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyGoal">Weekly Study Goal (hours)</Label>
            <Input
              id="weeklyGoal"
              type="number"
              step="1"
              min="1"
              max="168"
              value={newWeeklyGoal}
              onChange={(e) => setNewWeeklyGoal(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-study-blue hover:bg-study-blue/90">
              Update Goals
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}