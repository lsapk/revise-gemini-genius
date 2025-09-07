
import { 
  Home, 
  Plus, 
  BarChart3, 
  Settings, 
  Brain,
  BookOpen,
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
} from '@/components/ui/sidebar';
import { useApp } from '@/contexts/AppContext';

const mainItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Mes cours', url: '/courses', icon: BookOpen },
  { title: 'Ajouter', url: '/add', icon: Plus },
  { title: 'Planning', url: '/planning', icon: Calendar },
  { title: 'Assistant IA', url: '/assistant', icon: Brain },
  { title: 'Statistiques', url: '/stats', icon: BarChart3 },
  { title: 'Paramètres', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { subjects } = useApp();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar 
      className="border-r bg-sidebar text-sidebar-foreground"
      collapsible="icon"
    >
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-sidebar-primary">
              ReviseGenius
            </h2>
            <p className="text-xs text-sidebar-foreground/60">IA Révision</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {subjects.length > 0 && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
              Matières ({subjects.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {subjects.slice(0, 8).map((subject) => (
                  <SidebarMenuItem key={subject.id}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={`/subject/${subject.id}`}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate text-sm">{subject.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {subjects.length > 8 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/subjects" className="text-sidebar-foreground/60 text-xs px-3 py-1">
                        +{subjects.length - 8} autres matières
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          Version 2.1 • Interface améliorée
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
