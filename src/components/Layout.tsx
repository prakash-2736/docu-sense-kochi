import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Train, 
  FileText, 
  Search, 
  Upload, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  userRole: string;
  onLogout: () => void;
}

const roleConfig = {
  admin: { 
    label: "Administrator", 
    icon: Settings,
    color: "bg-destructive text-destructive-foreground" 
  },
  engineer: { 
    label: "Engineering", 
    icon: Train,
    color: "bg-primary text-primary-foreground" 
  },
  hr: { 
    label: "Human Resources", 
    icon: User,
    color: "bg-accent text-accent-foreground" 
  },
  finance: { 
    label: "Finance", 
    icon: BarChart3,
    color: "bg-warning text-warning-foreground" 
  },
};

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, roles: ["admin", "engineer", "hr", "finance"] },
  { name: "Search", href: "/search", icon: Search, roles: ["admin", "engineer", "hr", "finance"] },
  { name: "Upload", href: "/upload", icon: Upload, roles: ["admin", "engineer", "hr", "finance"] },
  { name: "Tasks", href: "/tasks", icon: FileText, roles: ["admin", "engineer", "hr", "finance"] },
  { name: "Notifications", href: "/notifications", icon: Bell, roles: ["admin", "engineer", "hr", "finance"] },
  { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
];

export const Layout = ({ children, userRole, onLogout }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentRole = roleConfig[userRole as keyof typeof roleConfig];
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-all duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0 animate-slide-in-left" : "-translate-x-full animate-slide-out-right"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 bg-gradient-hero animate-glow">
            <Train className="h-8 w-8 text-white hover-scale" />
            <div className="text-white">
              <h1 className="text-lg font-bold">KMRL</h1>
              <p className="text-xs opacity-90">Intelligence</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden text-white hover:bg-white/20 hover-scale"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Role Badge */}
          <div className="p-4 animate-fade-in">
            <Badge className={cn("w-full justify-center animate-bounce-in", currentRole.color)}>
              <currentRole.icon className="h-4 w-4 mr-1" />
              {currentRole.label}
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavigation.map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-accent hover-scale stagger-item story-link",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : ""
                )}
                onClick={() => navigate(item.href)}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Demo User</p>
                <p className="text-xs text-muted-foreground">demo@kmrl.co.in</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Document Intelligence</h2>
              <p className="text-sm text-muted-foreground">Kochi Metro Rail Limited</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};