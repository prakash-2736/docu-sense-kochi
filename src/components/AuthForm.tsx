import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Train, FileText, Shield } from "lucide-react";

interface AuthFormProps {
  onLogin: (role: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - in real app would validate credentials
    const role = formData.role || "engineer";
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center space-y-4 animate-bounce-in">
          <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow animate-glow">
            <Train className="h-8 w-8 text-white hover-scale" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent story-link">
              KMRL Intelligence
            </h1>
            <p className="text-muted-foreground">Document Management System</p>
          </div>
        </div>

        <Card className="shadow-medium card-hover animate-slide-in-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Enter your credentials to access the system" 
                : "Create your account to get started"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 stagger-item">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="transition-all focus:shadow-soft"
                />
              </div>
              <div className="space-y-2 stagger-item">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="transition-all focus:shadow-soft"
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2 stagger-item animate-fade-in">
                  <Label htmlFor="role">Department Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    required
                  >
                    <SelectTrigger className="transition-all focus:shadow-soft">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2 hover-scale">
                          <Shield className="h-4 w-4" />
                          Administrator
                        </div>
                      </SelectItem>
                      <SelectItem value="engineer">
                        <div className="flex items-center gap-2 hover-scale">
                          <Train className="h-4 w-4" />
                          Engineering
                        </div>
                      </SelectItem>
                      <SelectItem value="hr">
                        <div className="flex items-center gap-2 hover-scale">
                          <FileText className="h-4 w-4" />
                          Human Resources
                        </div>
                      </SelectItem>
                      <SelectItem value="finance">
                        <div className="flex items-center gap-2 hover-scale">
                          <FileText className="h-4 w-4" />
                          Finance
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full button-glow hover-glow stagger-item" variant="hero">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm stagger-item">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium story-link"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {/* Demo Login Buttons */}
            <div className="mt-6 space-y-2 stagger-item">
              <p className="text-xs text-muted-foreground text-center">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => onLogin("admin")}
                  className="hover-glow hover-scale"
                >
                  Admin Demo
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => onLogin("engineer")}
                  className="hover-glow hover-scale"
                >
                  Engineer Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};