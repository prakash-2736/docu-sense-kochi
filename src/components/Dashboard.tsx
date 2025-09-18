import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Eye,
  MessageSquare
} from "lucide-react";

interface DashboardProps {
  userRole: string;
}

const mockDocuments = [
  {
    id: 1,
    title: "Safety Protocol Update - Malayalam Version",
    summary: "Updated safety protocols for platform operations with new emergency procedures",
    department: "Engineering",
    language: "Malayalam + English",
    status: "processed",
    priority: "high",
    deadline: "2024-01-15",
    keywords: ["safety", "emergency", "platform"],
    assignedTo: "Safety Team",
  },
  {
    id: 2,
    title: "Vendor Contract - Track Maintenance",
    summary: "Annual maintenance contract for track systems and signaling equipment",
    department: "Engineering", 
    language: "English",
    status: "pending",
    priority: "medium",
    deadline: "2024-01-20",
    keywords: ["contract", "maintenance", "track"],
    assignedTo: "Procurement Team",
  },
  {
    id: 3,
    title: "HR Policy Amendment - Leave Structure",
    summary: "Revised leave policies including new maternity and paternity benefits",
    department: "HR",
    language: "English",
    status: "processed",
    priority: "low",
    deadline: "2024-01-25",
    keywords: ["policy", "leave", "benefits"],
    assignedTo: "HR Department",
  },
];

const roleStats = {
  admin: {
    totalDocuments: 1247,
    pendingReview: 23,
    processed: 1224,
    departments: 4,
  },
  engineer: {
    totalDocuments: 342,
    pendingReview: 8,
    processed: 334,
    departments: 1,
  },
  hr: {
    totalDocuments: 156,
    pendingReview: 3,
    processed: 153,
    departments: 1,
  },
  finance: {
    totalDocuments: 89,
    pendingReview: 2,
    processed: 87,
    departments: 1,
  },
};

export const Dashboard = ({ userRole }: DashboardProps) => {
  const stats = roleStats[userRole as keyof typeof roleStats];
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const filteredDocuments = userRole === "admin" 
    ? mockDocuments 
    : mockDocuments.filter(doc => doc.department.toLowerCase() === userRole || userRole === "engineer");

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to KMRL Document Intelligence
        </h1>
        <p className="opacity-90">
          Streamlining document management across Kochi Metro Rail Limited
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-3xl font-bold">{stats.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingReview}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processed</p>
                <p className="text-3xl font-bold text-success">{stats.processed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Rate</p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round((stats.processed / stats.totalDocuments) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Latest documents processed by the intelligence system
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={cn(
                  "p-4 border rounded-lg transition-all cursor-pointer hover:shadow-soft",
                  selectedDoc === doc.id ? "border-primary bg-primary/5" : ""
                )}
                onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <Badge className={getStatusColor(doc.status)} variant="secondary">
                        {doc.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(doc.priority)}>
                        {doc.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{doc.summary}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {doc.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {doc.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {doc.deadline}
                      </span>
                      <span>{doc.language}</span>
                    </div>

                    {selectedDoc === doc.id && (
                      <div className="pt-3 border-t space-y-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Source
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Add Comment
                          </Button>
                          <Button size="sm" variant="default">
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Assign Task
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Upload Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload new documents for processing
            </p>
            <Button className="w-full" variant="default">
              Upload Files
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Semantic Search</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find documents using intelligent search
            </p>
            <Button className="w-full" variant="accent">
              Search Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Urgent Tasks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review high-priority documents
            </p>
            <Button className="w-full" variant="warning">
              View Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}