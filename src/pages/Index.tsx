import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
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
      <Dashboard userRole={user.role} />
    </Layout>
  );
};

export default Index;
