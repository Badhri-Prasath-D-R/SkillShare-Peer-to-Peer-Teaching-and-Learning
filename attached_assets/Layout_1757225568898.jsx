import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Users, Plus, User, Search, Home, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User as UserEntity } from "@/entities/User";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Browse Sessions", 
    url: createPageUrl("BrowseSessions"),
    icon: Search,
  },
  {
    title: "Create Session",
    url: createPageUrl("CreateSession"),
    icon: Plus,
  },
  {
    title: "My Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);
      } catch (error) {
        console.error("User not logged in");
      }
    };
    loadUser();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-pink-50">
        <Sidebar className="border-r border-orange-200">
          <SidebarHeader className="border-b border-orange-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">SkillShare</h2>
                <p className="text-xs text-gray-600">Learn & Teach Together</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
                  Your Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3 bg-white/50 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Learning Points
                      </span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                        {user.points || 10}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Sessions Hosted
                      </span>
                      <span className="font-semibold text-gray-900">{user.sessions_hosted || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sessions Attended</span>
                      <span className="font-semibold text-gray-900">{user.sessions_attended || 0}</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-4">
            {user ? (
              <div className="flex items-center gap-3 p-2">
                <Avatar className="w-10 h-10 border-2 border-orange-200">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold">
                    {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name || 'User'}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="p-2 text-center">
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">SkillShare</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}