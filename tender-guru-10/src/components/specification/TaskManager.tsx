
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import type { SpecificationDocument, TaskAssignment } from "@/types/specification";

interface TaskManagerProps {
  specification: SpecificationDocument | null;
  onTaskAssignment: (task: TaskAssignment) => void;
}

const TaskManager = ({ specification, onTaskAssignment }: TaskManagerProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<number>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate || !assignedTo) return;

    const newTask: TaskAssignment = {
      id: Date.now(),
      title,
      description,
      assignedTo,
      dueDate: dueDate.toISOString(),
      status: "pending",
      attachments: [],
      notificationType: "both",
    };

    onTaskAssignment(newTask);
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setAssignedTo(undefined);
  };

  if (!specification) {
    return (
      <div className="text-center py-8 text-gray-500">
        No specification selected
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Task Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        <div>
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Assign Task
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold">Assigned Tasks</h3>
        {specification.tasks?.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {task.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
