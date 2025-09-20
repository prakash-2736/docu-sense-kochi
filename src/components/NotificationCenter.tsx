import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Users,
  Settings,
  Mail,
  MessageSquare,
  Clock,
  X,
  MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationCenterProps {
  userRole: string;
}

interface Notification {
  id: number;
  type: "document" | "task" | "system" | "deadline" | "approval";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionRequired: boolean;
  relatedId?: number;
  department?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "deadline",
    title: "Urgent: Safety Protocol Review Due",
    message: "Safety protocol document review is due in 2 days. Immediate action required for compliance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: "urgent",
    actionRequired: true,
    relatedId: 1,
    department: "Engineering"
  },
  {
    id: 2,
    type: "document",
    title: "New Document Processed",
    message: "Malayalam safety manual has been successfully processed and is ready for review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: "medium",
    actionRequired: false,
    relatedId: 2,
    department: "Engineering"
  },
  {
    id: 3,
    type: "task",
    title: "Task Assignment",
    message: "You have been assigned a new task: 'Vendor Contract Analysis' by Engineering Head.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    priority: "medium",
    actionRequired: true,
    relatedId: 2,
    department: "Engineering"
  },
  {
    id: 4,
    type: "approval",
    title: "Document Approval Required",
    message: "HR Policy Amendment requires your approval before implementation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: "high",
    actionRequired: true,
    relatedId: 3,
    department: "HR"
  },
  {
    id: 5,
    type: "system",
    title: "System Update Complete",
    message: "Document intelligence system has been updated with improved Malayalam translation capabilities.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    priority: "low",
    actionRequired: false,
    department: "System"
  }
];

export const NotificationCenter = ({ userRole }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [deadlineNotifications, setDeadlineNotifications] = useState(true);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "document": return <FileText className="h-5 w-5 text-primary" />;
      case "task": return <CheckCircle className="h-5 w-5 text-success" />;
      case "approval": return <Users className="h-5 w-5 text-warning" />;
      case "system": return <Settings className="h-5 w-5 text-muted-foreground" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-destructive bg-destructive/5";
      case "high": return "border-l-warning bg-warning/5";
      case "medium": return "border-l-primary bg-primary/5";
      case "low": return "border-l-muted-foreground bg-muted/5";
      default: return "border-l-muted-foreground bg-muted/5";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    const roleFilter = userRole === "admin" || 
      !notif.department || 
      notif.department.toLowerCase() === userRole || 
      userRole === "engineer";
    
    const typeFilter = 
      filter === "all" ? true :
      filter === "unread" ? !notif.read :
      filter === "urgent" ? notif.priority === "urgent" || notif.priority === "high" :
      true;
    
    return roleFilter && typeFilter;
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  const urgentCount = filteredNotifications.filter(n => n.priority === "urgent").length;

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Notifications</h1>
            <p className="opacity-90">
              Stay updated with document processing and task assignments
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{unreadCount}</div>
            <div className="text-sm opacity-90">Unread</div>
          </div>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow" onClick={() => setFilter("all")}>
          <CardContent className="p-4 text-center">
            <Bell className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{filteredNotifications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow" onClick={() => setFilter("unread")}>
          <CardContent className="p-4 text-center">
            <Mail className="h-6 w-6 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-warning">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow" onClick={() => setFilter("urgent")}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
            <div className="text-sm text-muted-foreground">Urgent</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-success">
              {filteredNotifications.filter(n => n.actionRequired).length}
            </div>
            <div className="text-sm text-muted-foreground">Action Needed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <Card className="shadow-medium lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  {filter === "all" ? "All notifications" : 
                   filter === "unread" ? "Unread notifications" : 
                   "Urgent notifications"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilter(filter === "all" ? "unread" : "all")}
                >
                  {filter === "all" ? "Show Unread" : "Show All"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 rounded-lg cursor-pointer transition-colors ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">Action Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(notification.timestamp)} ago
                            </span>
                            {notification.department && (
                              <span>{notification.department}</span>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {notification.actionRequired && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="default">
                              Take Action
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">No notifications</p>
                    <p className="text-sm text-muted-foreground">
                      {filter === "unread" ? "All caught up!" : "You're all set"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-notifications">Task Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about task assignments
                  </p>
                </div>
                <Switch
                  id="task-notifications"
                  checked={taskNotifications}
                  onCheckedChange={setTaskNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deadline-notifications">Deadline Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Urgent alerts for approaching deadlines
                  </p>
                </div>
                <Switch
                  id="deadline-notifications"
                  checked={deadlineNotifications}
                  onCheckedChange={setDeadlineNotifications}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Test Notifications
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};