import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, X, Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  type: "text" | "file";
  fileName?: string;
}

interface NoteUploadProps {
  topicName: string;
  taskTitle: string;
  onClose: () => void;
}

export function NoteUpload({ topicName, taskTitle, onClose }: NoteUploadProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date(),
      type: "text"
    };

    setNotes(prev => [note, ...prev]);
    setNewNote("");
    toast({
      title: "Note saved",
      description: `Note added to ${topicName}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const note: Note = {
        id: Date.now().toString(),
        content: `File uploaded: ${file.name}`,
        createdAt: new Date(),
        type: "file",
        fileName: file.name
      };

      setNotes(prev => [note, ...prev]);
      setIsUploading(false);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded to ${topicName}`,
      });
    }, 1500);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Note deleted",
      description: "Note has been removed",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes for {taskTitle}
          </DialogTitle>
          <Badge variant="secondary" className="w-fit">
            {topicName}
          </Badge>
        </DialogHeader>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">My Notes</TabsTrigger>
            <TabsTrigger value="files">Uploaded Files</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            {/* Add New Note */}
            <Card className="p-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add your notes for this topic..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {newNote.length}/500 characters
                  </span>
                  <Button 
                    onClick={handleSaveNote} 
                    disabled={!newNote.trim()}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Note
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notes List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.filter(note => note.type === "text").map((note) => (
                <Card key={note.id} className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {notes.filter(note => note.type === "text").length === 0 && (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No notes yet. Add your first note above.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            {/* File Upload */}
            <Card className="p-4">
              <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload study materials, PDFs, images
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    disabled={isUploading}
                  />
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    className="gap-2"
                  >
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Plus className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Choose File"}
                    </label>
                  </Button>
                </div>
              </div>
            </Card>

            {/* File List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.filter(note => note.type === "file").map((note) => (
                <Card key={note.id} className="p-4">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-study-blue" />
                      <div>
                        <p className="font-medium text-sm">{note.fileName}</p>
                        <span className="text-xs text-muted-foreground">
                          Uploaded {note.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {notes.filter(note => note.type === "file").length === 0 && (
                <Card className="p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No files uploaded yet.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}