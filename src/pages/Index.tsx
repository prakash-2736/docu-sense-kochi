import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentSearch } from "@/components/DocumentSearch";
import { TaskManagement } from "@/components/TaskManagement";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Analytics } from "@/components/Analytics";
import { Settings } from "@/components/Settings";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const { toast } = useToast();

  const handleLogin = (role: string) => {
    setUser({ role });
    toast({
      title: "Login Successful",
      description: `Welcome to KMRL Document Intelligence System`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <Layout userRole={user.role} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard userRole={user.role} />} />
        <Route path="/upload" element={<DocumentUpload userRole={user.role} />} />
        <Route path="/search" element={<DocumentSearch userRole={user.role} />} />
        <Route path="/tasks" element={<TaskManagement userRole={user.role} />} />
        <Route path="/notifications" element={<NotificationCenter userRole={user.role} />} />
        <Route path="/analytics" element={<Analytics userRole={user.role} />} />
        <Route path="/settings" element={<Settings userRole={user.role} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default Index;
