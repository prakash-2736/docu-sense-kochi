import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus,
  Calendar as CalendarIcon,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskManagementProps {
  userRole: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "overdue";
  dueDate: Date;
  createdDate: Date;
  documentId?: number;
  documentTitle?: string;
  comments: number;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Review Safety Protocol Implementation",
    description: "Review and approve the new safety protocols for platform operations. Ensure compliance with latest safety standards.",
    assignedTo: "Safety Team Lead",
    assignedBy: "Station Manager",
    department: "Engineering",
    priority: "high",
    status: "pending",
    dueDate: new Date(2024, 0, 20),
    createdDate: new Date(2024, 0, 10),
    documentId: 1,
    documentTitle: "Safety Protocol Update - Malayalam Version",
    comments: 3
  },
  {
    id: 2,
    title: "Vendor Contract Analysis",
    description: "Analyze vendor proposals and prepare recommendation report for track maintenance contract.",
    assignedTo: "Procurement Officer",
    assignedBy: "Engineering Head",
    department: "Engineering",
    priority: "medium",
    status: "in-progress",
    dueDate: new Date(2024, 0, 25),
    createdDate: new Date(2024, 0, 8),
    documentId: 2,
    documentTitle: "Vendor Contract - Track Maintenance",
    comments: 1
  },
  {
    id: 3,
    title: "HR Policy Communication",
    description: "Communicate new leave policy changes to all departments and update employee handbook.",
    assignedTo: "HR Coordinator",
    assignedBy: "HR Manager",
    department: "HR",
    priority: "low",
    status: "completed",
    dueDate: new Date(2024, 0, 30),
    createdDate: new Date(2024, 0, 5),
    documentId: 3,
    documentTitle: "HR Policy Amendment - Leave Structure",
    comments: 5
  }
];

const departmentOptions = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "safety", label: "Safety" },
  { value: "procurement", label: "Procurement" },
];

const teamMembers = [
  { value: "safety-lead", label: "Safety Team Lead" },
  { value: "procurement-officer", label: "Procurement Officer" },
  { value: "hr-coordinator", label: "HR Coordinator" },
  { value: "engineer-1", label: "Senior Engineer" },
  { value: "finance-analyst", label: "Finance Analyst" },
];

export const TaskManagement = ({ userRole }: TaskManagementProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    department: "",
    priority: "medium" as const,
    dueDate: new Date()
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in-progress": return "bg-primary text-primary-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-destructive";
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: tasks.length + 1,
      ...newTask,
      assignedBy: "Current User",
      status: "pending",
      createdDate: new Date(),
      comments: 0
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      department: "",
      priority: "medium",
      dueDate: new Date()
    });
    setIsCreatingTask(false);
    
    toast({
      title: "Task Created",
      description: `Task "${task.title}" has been assigned successfully.`,
    });
  };

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
    ));
    
    toast({
      title: "Task Updated",
      description: "Task status has been updated successfully.",
    });
  };

  const filteredTasks = tasks.filter(task => {
    const deptFilter = selectedDepartment === "all" || task.department.toLowerCase() === selectedDepartment;
    const statusFilter = selectedStatus === "all" || task.status === selectedStatus;
    const roleFilter = userRole === "admin" || task.department.toLowerCase() === userRole || userRole === "engineer";
    
    return deptFilter && statusFilter && roleFilter;
  });

  const taskStats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === "pending").length,
    inProgress: filteredTasks.filter(t => t.status === "in-progress").length,
    completed: filteredTasks.filter(t => t.status === "completed").length,
    overdue: filteredTasks.filter(t => t.status === "overdue").length,
  };

  return (
    <div className="space-y-6">
      {/* Tasks Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Task Management</h1>
            <p className="opacity-90">
              Assign and track document-related tasks across departments
            </p>
          </div>
          <Button
            onClick={() => setIsCreatingTask(true)}
            className="bg-white/20 text-white border-white/20 hover:bg-white/30"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{taskStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{taskStats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{taskStats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{taskStats.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Task Form */}
      {isCreatingTask && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>
              Assign a new task related to document processing or review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title*</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assign-to">Assign To*</Label>
                <Select onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.value} value={member.label}>
                        {member.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setNewTask(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.filter(d => d.value !== "all").map((dept) => (
                      <SelectItem key={dept.value} value={dept.label}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newTask.dueDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => date && setNewTask(prev => ({ ...prev, dueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingTask(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Manage and track document-related tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status.replace('-', ' ')}</span>
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    {task.documentTitle && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        Related: {task.documentTitle}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Due: {format(task.dueDate, "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {task.comments} comments
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {task.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, "in-progress")}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, "completed")}
                        >
                          Complete Task
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      {task.documentId && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new task</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};