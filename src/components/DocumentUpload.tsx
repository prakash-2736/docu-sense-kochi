import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  userRole: string;
}

const departmentOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "safety", label: "Safety" },
  { value: "procurement", label: "Procurement" },
];

const priorityOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  department?: string;
  priority?: string;
  description?: string;
}

export const DocumentUpload = ({ userRole }: DocumentUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((fileObj) => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileObj.id) {
            if (f.progress >= 100) {
              clearInterval(interval);
              return { ...f, status: "processing" as const };
            }
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 300);

      // Simulate processing completion
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: "completed" as const, progress: 100 } : f
        ));
        toast({
          title: "Document processed",
          description: `${fileObj.file.name} has been successfully processed and indexed.`,
        });
      }, 4000);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const updateFileMetadata = (fileId: string, field: string, value: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, [field]: value } : f
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('image')) return <Image className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "processing": return "bg-primary text-primary-foreground";
      case "uploading": return "bg-accent text-accent-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold mb-2">Document Upload</h1>
        <p className="opacity-90">
          Upload documents for intelligent processing and analysis
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: PDF, DOCX, JPG, PNG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop files here to upload</p>
              <p className="text-sm text-muted-foreground">
                or click to browse your computer
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" asChild>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Files
                </Label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              Monitor upload and processing status of your documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  {/* File Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(fileObj.file)}
                      <div>
                        <p className="font-medium">{fileObj.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(fileObj.status)} variant="secondary">
                        {fileObj.status === "uploading" && "Uploading"}
                        {fileObj.status === "processing" && "Processing"}
                        {fileObj.status === "completed" && <><CheckCircle className="h-3 w-3 mr-1" />Completed</>}
                        {fileObj.status === "error" && <><AlertCircle className="h-3 w-3 mr-1" />Error</>}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileObj.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileObj.status !== "completed" && (
                    <Progress value={fileObj.progress} className="h-2" />
                  )}

                  {/* Metadata Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`dept-${fileObj.id}`}>Department</Label>
                      <Select onValueChange={(value) => updateFileMetadata(fileObj.id, "department", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`priority-${fileObj.id}`}>Priority</Label>
                      <Select onValueChange={(value) => updateFileMetadata(fileObj.id, "priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`desc-${fileObj.id}`}>Description</Label>
                      <Input
                        placeholder="Brief description"
                        onChange={(e) => updateFileMetadata(fileObj.id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Upload Options */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Bulk Import</CardTitle>
          <CardDescription>
            Connect to external systems for automated document import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">Email Import</span>
              <span className="text-xs text-muted-foreground">Import from emails</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">SharePoint</span>
              <span className="text-xs text-muted-foreground">Sync documents</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">Maximo</span>
              <span className="text-xs text-muted-foreground">Work orders</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">WhatsApp</span>
              <span className="text-xs text-muted-foreground">Chat exports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};