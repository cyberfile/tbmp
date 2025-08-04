import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
}

interface SubjectManagerProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

const colorOptions = [
  { name: "Purple", value: "study-purple" },
  { name: "Orange", value: "study-orange" },
  { name: "Green", value: "study-green" },
  { name: "Blue", value: "study-blue" },
  { name: "Pink", value: "study-pink" },
];

export function SubjectManager({ subjects, onSubjectsChange }: SubjectManagerProps) {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("study-purple");

  const addSubject = () => {
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        color: selectedColor,
        progress: 0,
      };
      
      onSubjectsChange([...subjects, newSubject]);
      setNewSubjectName("");
    }
  };

  const removeSubject = (subjectId: string) => {
    onSubjectsChange(subjects.filter(s => s.id !== subjectId));
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "study-purple":
        return "bg-study-purple text-white";
      case "study-orange":
        return "bg-study-orange text-white";
      case "study-green":
        return "bg-study-green text-white";
      case "study-blue":
        return "bg-study-blue text-white";
      case "study-pink":
        return "bg-study-pink text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Subjects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Subject */}
        <div className="space-y-3">
          <Input
            placeholder="Subject name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSubject()}
          />
          
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color.value ? "border-black" : "border-transparent"
                } ${getColorClass(color.value)}`}
                title={color.name}
              />
            ))}
          </div>
          
          <Button onClick={addSubject} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>

        {/* Current Subjects */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Current Subjects</div>
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getColorClass(subject.color)}`} />
                <span className="font-medium">{subject.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSubject(subject.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}