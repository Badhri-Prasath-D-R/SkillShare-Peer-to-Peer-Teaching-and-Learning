import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext({});

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const Sidebar = ({ children, className = "" }) => (
  <aside className={`w-64 bg-white border-r ${className}`}>
    {children}
  </aside>
);

export const SidebarHeader = ({ children, className = "" }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

export const SidebarContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const SidebarFooter = ({ children, className = "" }) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);

export const SidebarGroup = ({ children, className = "" }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);

export const SidebarGroupLabel = ({ children, className = "" }) => (
  <div className={`text-xs font-medium text-muted-foreground mb-2 ${className}`}>
    {children}
  </div>
);

export const SidebarGroupContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const SidebarMenu = ({ children, className = "" }) => (
  <ul className={`space-y-1 ${className}`}>{children}</ul>
);

export const SidebarMenuItem = ({ children, className = "" }) => (
  <li className={className}>{children}</li>
);

export const SidebarMenuButton = ({ children, className = "", asChild, ...props }) => (
  <button className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${className}`} {...props}>
    {children}
  </button>
);

export const SidebarTrigger = ({ className = "", ...props }) => {
  const { setIsOpen } = useSidebar();
  return (
    <button
      className={`p-2 rounded-md hover:bg-muted ${className}`}
      onClick={() => setIsOpen(prev => !prev)}
      {...props}
    >
      ☰
    </button>
  );
};