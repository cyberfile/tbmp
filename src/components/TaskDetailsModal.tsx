import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Save, Upload } from "lucide-react";

const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

export interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
}

export interface Task {
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
}

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task;
  topics: Topic[];
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
}

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  type: "text" | "file";
  fileName?: string;
}

export function TaskDetailsModal({ isOpen, task, topics, onClose, onUpdateTask }: TaskDetailsModalProps) {
  const [title, setTitle] = useState(task.title);
  const [selectedTopicName, setSelectedTopicName] = useState(task.topic);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const [details, setDetails] = useState(task.details || "");
  const [color, setColor] = useState<string>(task.color);

  // Notes & Files state (local, ephemeral for now)
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setSelectedTopicName(task.topic);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setDetails(task.details || "");
    setColor(task.color);
  }, [task]);

  useEffect(() => {
    const t = topics.find(tt => tt.name === selectedTopicName);
    if (t && (!color || !color.startsWith('#'))) {
      // Default to topic color if not using custom hex
      setColor(t.color);
    }
  }, [selectedTopicName, topics]);

  const selectedTopic = useMemo(() => topics.find(t => t.name === selectedTopicName), [topics, selectedTopicName]);

  const handleSave = () => {
    if (!title || !selectedTopicName || !startTime || !endTime) return;
    const updated: Task = {
      ...task,
      title,
      topic: selectedTopicName,
      startTime,
      endTime,
      details,
      color: color || selectedTopic?.color || task.color,
    };
    onUpdateTask(updated);
    onClose();
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date(),
      type: "text",
    };
    setNotes(prev => [note, ...prev]);
    setNewNote("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      const note: Note = {
        id: Date.now().toString(),
        content: `File uploaded: ${file.name}`,
        createdAt: new Date(),
        type: "file",
        fileName: file.name,
      };
      setNotes(prev => [note, ...prev]);
      setIsUploading(false);
    }, 800);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]" aria-describedby="task-dialog-desc">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Task • {task.title}
          </DialogTitle>
          <DialogDescription id="task-dialog-desc">Edit task details, add notes, or upload files.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="notes">Notes & Files</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-topic">Topic</Label>
              <Select value={selectedTopicName} onValueChange={setSelectedTopicName}>
                <SelectTrigger id="task-topic">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.name}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resolveColor(topic.color) }} />
                        {topic.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-start">Start Time</Label>
                <Input id="task-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-end">End Time</Label>
                <Input id="task-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-details">Additional Info</Label>
              <Textarea
                id="task-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add any extra context for this task"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-color">Task Color</Label>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: resolveColor(color) }} />
                <input
                  id="task-color"
                  type="color"
                  value={color && color.startsWith('#') ? color : '#3b82f6'}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-10 bg-transparent border rounded-md cursor-pointer"
                  aria-label="Pick custom color"
                />
                <span className="text-xs text-muted-foreground">Defaults to topic color; pick a custom color if you want.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="bg-study-blue hover:bg-study-blue/90">Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <div>
                  <div className="font-medium">Notes for {task.title}</div>
                  <Badge variant="secondary" className="w-fit mt-1">{task.topic}</Badge>
                </div>
              </div>
            </div>

            {/* Add New Note */}
            <Card className="p-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add your notes for this task..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{newNote.length}/500 characters</span>
                  <Button onClick={handleSaveNote} disabled={!newNote.trim()} size="sm" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Note
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notes List */}
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {notes.filter(n => n.type === 'text').map((note) => (
                <Card key={note.id} className="p-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <span className="text-xs text-muted-foreground">{note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)} className="text-destructive hover:text-destructive">Remove</Button>
                  </div>
                </Card>
              ))}
              {notes.filter(n => n.type === 'text').length === 0 && (
                <Card className="p-8 text-center text-sm text-muted-foreground">No notes yet.</Card>
              )}
            </div>

            {/* File Upload */}
            <Card className="p-4">
              <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload study materials, PDFs, images</p>
                  <input type="file" id="task-file-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" disabled={isUploading} />
                  <Button asChild variant="outline" size="sm" disabled={isUploading} className="gap-2">
                    <label htmlFor="task-file-upload" className="cursor-pointer">{isUploading ? "Uploading..." : "Choose File"}</label>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Files List */}
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {notes.filter(n => n.type === 'file').map((note) => (
                <Card key={note.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      <div>
                        <div className="text-sm font-medium">{note.fileName}</div>
                        <div className="text-xs text-muted-foreground">Uploaded {note.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)} className="text-destructive hover:text-destructive">Remove</Button>
                  </div>
                </Card>
              ))}
              {notes.filter(n => n.type === 'file').length === 0 && (
                <Card className="p-8 text-center text-sm text-muted-foreground">No files uploaded yet.</Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
