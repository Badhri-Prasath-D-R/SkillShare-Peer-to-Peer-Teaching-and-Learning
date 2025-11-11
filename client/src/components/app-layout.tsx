import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-pink-50">
        <AppSidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          {isMobile && (
            <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 px-6 py-4 lg:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" data-testid="mobile-menu-trigger" />
                <h1 className="text-xl font-bold text-gray-900">SkillShare</h1>
              </div>
            </header>
          )}

          {/* Page Content Container */}
          <div className="flex-1 overflow-auto p-6" data-testid="main-content">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
