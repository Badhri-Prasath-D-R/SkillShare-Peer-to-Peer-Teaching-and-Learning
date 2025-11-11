import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Plus, User, Sparkles, BookOpen, Users } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Browse Sessions",
    url: "/browse",
    icon: Search,
  },
  {
    title: "Create Session",
    url: "/create",
    icon: Plus,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  
  const { data: user } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="w-64 bg-white border-r border-orange-200" data-testid="app-sidebar">
      <SidebarHeader className="border-b border-orange-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg" data-testid="sidebar-title">SkillShare</h2>
            <p className="text-xs text-gray-600">Learn & Teach Together</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setLocation(item.url)}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 rounded-xl mb-1 ${
                        isActive ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 shadow-sm' : ''
                      }`}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
              Your Stats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-4 py-3 space-y-3 bg-white/50 rounded-xl border border-orange-200" data-testid="sidebar-stats">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Learning Points
                  </span>
                  <Badge className="bg-orange-100 text-orange-800 font-semibold px-2.5 py-0.5 rounded-full text-xs" data-testid="sidebar-points">
                    {user.points}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Sessions Hosted
                  </span>
                  <span className="font-semibold text-gray-900" data-testid="sidebar-hosted">
                    {user.sessionsHosted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sessions Attended</span>
                  <span className="font-semibold text-gray-900" data-testid="sidebar-attended">
                    {user.sessionsAttended}
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="border-t border-orange-200 p-4">
          <div className="flex items-center gap-3 p-2" data-testid="sidebar-user">
            <Avatar className="w-10 h-10 border-2 border-orange-200">
              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate" data-testid="sidebar-user-name">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-600 truncate" data-testid="sidebar-user-email">
                {user.email}
              </p>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
