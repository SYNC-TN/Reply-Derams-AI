import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a1525]">
      <Providers>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 relative w-full">
              <div className="sticky top-0 z-10 flex justify-between items-center p-4">
                <SidebarTrigger />
              </div>
              <div className="w-full"> {children}</div>
            </main>
          </div>
        </SidebarProvider>
      </Providers>
    </div>
  );
}
