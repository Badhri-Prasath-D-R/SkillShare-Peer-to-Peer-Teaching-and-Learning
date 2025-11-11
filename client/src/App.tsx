import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/app-layout";
import Dashboard from "@/pages/dashboard";
import BrowseSessions from "@/pages/browse-sessions";
import CreateSession from "@/pages/create-session";
import Profile from "@/pages/profile";
import VideoCallPage from "@/pages/video-call";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/browse" component={BrowseSessions} />
      <Route path="/create" component={CreateSession} />
      <Route path="/profile" component={Profile} />
      <Route path="/meeting/:sessionId" component={VideoCallPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
