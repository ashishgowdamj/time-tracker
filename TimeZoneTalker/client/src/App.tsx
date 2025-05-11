import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Schedule from "@/pages/Schedule";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import TimeZones from "@/pages/TimeZones";
import Languages from "@/pages/Languages";
import Settings from "@/pages/Settings";

// Wrap routes with layout component
function RoutesWithLayout() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/messages" component={Messages} />
        <Route path="/profile" component={Profile} />
        <Route path="/timezone" component={TimeZones} />
        <Route path="/language" component={Languages} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <RoutesWithLayout />
    </TooltipProvider>
  );
}

export default App;
