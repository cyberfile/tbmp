
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit2, Trash2, BookOpen, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TopicPriorityLabel, type TopicPriority } from "./TopicPriorityLabel";
const resolveColor = (c?: string) => {
  if (!c) return undefined;
  const v = c.trim();
  if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl(')) return v;
  return `hsl(var(--${v}))`;
};

interface Topic {
  id: string;
  name: string;
  color: string;
  progress: number;
  description?: string;
  priority?: TopicPriority;
}

interface TopicManagerProps {
  topics: Topic[];
  onTopicsChange: (topics: Topic[]) => void;
  onClose: () => void;
}

const availableColors = [
  { name: "Purple", value: "study-purple", bg: "bg-study-purple" },
  { name: "Blue", value: "study-blue", bg: "bg-study-blue" },
  { name: "Green", value: "study-green", bg: "bg-study-green" },
  { name: "Orange", value: "study-orange", bg: "bg-study-orange" },
  { name: "Pink", value: "study-pink", bg: "bg-study-pink" },
  { name: "Red", value: "study-red", bg: "bg-study-red" },
  { name: "Teal", value: "study-teal", bg: "bg-study-teal" },
  { name: "Yellow", value: "study-yellow", bg: "bg-study-yellow" },
  { name: "Indigo", value: "study-indigo", bg: "bg-study-indigo" },
];

export function TopicManager({ topics, onTopicsChange, onClose }: TopicManagerProps) {
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [selectedColor, setSelectedColor] = useState(availableColors[0].value);
  const [newTopicPriority, setNewTopicPriority] = useState<TopicPriority>('none');
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const { toast } = useToast();

  const addTopic = () => {
    if (!newTopicName.trim()) return;

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      color: selectedColor,
      progress: 0,
      priority: newTopicPriority,
    };

    onTopicsChange([...topics, newTopic]);
    setNewTopicName("");
    setSelectedColor(availableColors[0].value);
    setNewTopicPriority('none');
    setIsAddingTopic(false);
    
    toast({
      title: "Topic added",
      description: `${newTopic.name} has been added to your study plan`,
    });
  };

  const updateTopic = (updatedTopic: Topic) => {
    onTopicsChange(topics.map(topic => 
      topic.id === updatedTopic.id ? updatedTopic : topic
    ));
    setEditingTopic(null);
    
    toast({
      title: "Topic updated",
      description: `${updatedTopic.name} has been updated`,
    });
  };

  const deleteTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    onTopicsChange(topics.filter(topic => topic.id !== topicId));
    
    toast({
      title: "Topic deleted",
      description: `${topic?.name} has been removed from your study plan`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Manage Study Topics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {/* Add New Topic */}
          <Card className="p-4 border-dashed border-2">
            {!isAddingTopic ? (
              <Button
                variant="ghost"
                onClick={() => setIsAddingTopic(true)}
                className="w-full h-20 text-muted-foreground hover:text-foreground gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Topic
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Enter topic name (e.g., Topic 1, Topic 2)"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTopic()}
                />
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Choose color:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                          selectedColor === color.value ? "border-foreground" : "border-transparent"
                        }`}
                        title={color.name}
                      />
                    ))}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="new-topic-custom-color"
                        className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center cursor-pointer shadow-sm bg-[conic-gradient(at_50%_50%,_hsl(0_100%_50%),_hsl(60_100%_50%),_hsl(120_100%_45%),_hsl(180_100%_50%),_hsl(240_100%_60%),_hsl(300_100%_50%),_hsl(360_100%_50%))] hover:opacity-90"
                        title="Custom color"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </label>
                      <input
                        id="new-topic-custom-color"
                        type="color"
                        value={selectedColor.startsWith('#') ? selectedColor : '#3b82f6'}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="sr-only"
                        aria-label="Custom color"
                      />
                      <span className="text-xs text-muted-foreground">Custom</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <TopicPriorityLabel priority={newTopicPriority} onChange={setNewTopicPriority} />
                </div>

                <div className="flex gap-2">
                  <Button onClick={addTopic} disabled={!newTopicName.trim()}>
                    Add Topic
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTopic(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Topics List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topics.map((topic) => (
              <Card key={topic.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: resolveColor(topic.color) }} />
                      <div>
                        <h4 className="font-medium">{topic.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {topic.progress}% complete
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTopic(topic)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTopic(topic.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2 [&>div]:bg-[var(--bar-color)]" style={{ ['--bar-color' as any]: resolveColor(topic.color) }} />
                  </div>
                </div>
              </Card>
            ))}

            {topics.length === 0 && (
              <Card className="p-8 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No topics yet. Add your first study topic above.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Topic Modal */}
        {editingTopic && (
          <Dialog open={true} onOpenChange={() => setEditingTopic(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={editingTopic.name}
                  onChange={(e) => setEditingTopic({...editingTopic, name: e.target.value})}
                  placeholder="Topic name"
                />
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Color:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setEditingTopic({...editingTopic, color: color.value})}
                        className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                          editingTopic.color === color.value ? "border-foreground" : "border-transparent"
                        }`}
                      />
                    ))}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="edit-topic-custom-color"
                        className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center cursor-pointer shadow-sm bg-[conic-gradient(at_50%_50%,_hsl(0_100%_50%),_hsl(60_100%_50%),_hsl(120_100%_45%),_hsl(180_100%_50%),_hsl(240_100%_60%),_hsl(300_100%_50%),_hsl(360_100%_50%))] hover:opacity-90"
                        title="Custom color"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </label>
                      <input
                        id="edit-topic-custom-color"
                        type="color"
                        value={editingTopic.color.startsWith('#') ? editingTopic.color : '#3b82f6'}
                        onChange={(e) => setEditingTopic({ ...editingTopic, color: e.target.value })}
                        className="sr-only"
                        aria-label="Custom color"
                      />
                      <span className="text-xs text-muted-foreground">Custom</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <TopicPriorityLabel 
                    priority={editingTopic.priority ?? 'none'} 
                    onChange={(p) => setEditingTopic({ ...editingTopic, priority: p })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => updateTopic(editingTopic)}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingTopic(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
