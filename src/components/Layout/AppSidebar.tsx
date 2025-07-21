
import { useState } from 'react';
import { 
  Home, 
  Plus, 
  BarChart3, 
  Settings, 
  Brain,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const mainItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Ajouter', url: '/add', icon: Plus },
  { title: 'Assistant IA', url: '/assistant', icon: Brain },
  { title: 'Statistiques', url: '/stats', icon: BarChart3 },
  { title: 'Paramètres', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { subjects } = useApp();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar 
      className="bg-gray-950 border-gray-800 text-gray-100"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-800">
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                ReviseGenius
              </h2>
              <p className="text-xs text-gray-400">IA Révision</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            {!isCollapsed ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink 
                      to={item.url} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive(item.url)
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && subjects.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
              Matières ({subjects.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {subjects.slice(0, 5).map((subject) => (
                  <SidebarMenuItem key={subject.id}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={`/subject/${subject.id}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                      >
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate text-sm">{subject.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 text-center">
            Version 2.0 • Futuriste
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
