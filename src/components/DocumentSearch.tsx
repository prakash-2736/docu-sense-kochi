import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Users, 
  Eye,
  Download,
  MessageSquare,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentSearchProps {
  userRole: string;
}

const mockSearchResults = [
  {
    id: 1,
    title: "Metro Safety Protocol Update - Emergency Response Procedures",
    summary: "Comprehensive update to platform safety protocols including new emergency evacuation procedures, crowd management strategies, and coordination with emergency services during peak hours.",
    department: "Engineering",
    language: "Malayalam + English",
    uploadDate: "2024-01-10",
    keywords: ["safety", "emergency", "evacuation", "protocol"],
    score: 0.95,
    snippet: "In case of emergency evacuation, all platform staff must follow the updated protocol which includes immediate announcement in both Malayalam and English...",
    assignedTo: "Safety Team",
    status: "processed",
    fileType: "pdf",
    priority: "high"
  },
  {
    id: 2,
    title: "Annual Track Maintenance Contract - Vendor Selection",
    summary: "Detailed analysis of vendor proposals for annual track maintenance including cost comparison, technical specifications, and compliance requirements for metro rail systems.",
    department: "Engineering",
    language: "English", 
    uploadDate: "2024-01-08",
    keywords: ["maintenance", "contract", "vendor", "track"],
    score: 0.87,
    snippet: "The selected vendor must demonstrate at least 5 years of experience in metro rail track maintenance with certified technical personnel...",
    assignedTo: "Procurement Team",
    status: "pending",
    fileType: "docx",
    priority: "medium"
  },
  {
    id: 3,
    title: "Employee Leave Policy Amendment - Maternity Benefits",
    summary: "Revised employee leave policies including enhanced maternity and paternity benefits, flexible working arrangements, and updated approval processes for all departments.",
    department: "HR",
    language: "English",
    uploadDate: "2024-01-05",
    keywords: ["policy", "leave", "maternity", "benefits"],
    score: 0.82,
    snippet: "The new maternity leave policy extends the benefit period to 26 weeks with full salary protection and optional work-from-home arrangements...",
    assignedTo: "HR Department",
    status: "processed",
    fileType: "pdf",
    priority: "low"
  },
];

const departmentFilters = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "safety", label: "Safety" },
  { value: "procurement", label: "Procurement" },
];

const dateFilters = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
];

export const DocumentSearch = ({ userRole }: DocumentSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      // Filter results based on user role and filters
      let filtered = mockSearchResults;
      
      if (userRole !== "admin") {
        filtered = filtered.filter(doc => 
          doc.department.toLowerCase() === userRole || userRole === "engineer"
        );
      }

      if (selectedDepartment !== "all") {
        filtered = filtered.filter(doc => 
          doc.department.toLowerCase() === selectedDepartment
        );
      }

      if (searchQuery.trim()) {
        filtered = filtered.filter(doc =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

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

  const getFileTypeIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold mb-2">
          Semantic Document Search
        </h1>
        <p className="opacity-90">
          Find documents using intelligent search across all indexed content
        </p>
      </div>

      {/* Search Interface */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Intelligent Search
          </CardTitle>
          <CardDescription>
            Search by content, keywords, or natural language queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by content, keywords, or ask questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departmentFilters.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFilters.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Quick searches:</span>
            {["safety protocols", "contract documents", "policy updates", "maintenance reports"].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch();
                }}
                className="h-7 text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} documents matching your query
              </CardDescription>
            </div>
            {searchResults.length > 0 && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Searching documents...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">No documents found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border rounded-lg hover:shadow-soft transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Result Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(result.fileType)}
                          <h3 className="font-semibold hover:text-primary cursor-pointer">
                            {result.title}
                          </h3>
                          <Badge className="text-xs">
                            Score: {Math.round(result.score * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getStatusColor(result.status)} variant="secondary">
                            {result.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(result.priority)}>
                            {result.priority}
                          </Badge>
                          <Badge variant="secondary">
                            {result.department}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-muted-foreground">
                      {result.summary}
                    </p>

                    {/* Snippet */}
                    <div className="p-3 bg-accent/20 rounded border-l-4 border-primary">
                      <p className="text-sm italic">
                        "...{result.snippet}..."
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {result.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {result.uploadDate}
                      </span>
                      <span>{result.language}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Document
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};