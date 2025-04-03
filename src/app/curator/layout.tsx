import { CuratorSidebar } from "@/components/CuratorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <CuratorSidebar />
      {children}
    </SidebarProvider>
  );
}
