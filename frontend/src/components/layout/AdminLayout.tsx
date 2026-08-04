import { ReactNode } from "react"
import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar"
import { PortalNavbar } from "./PortalNavbar"
import { AdminSideBar } from "./AdminSideBar"

interface AdminLayoutProps {
    children?: ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-900">
                <AdminSideBar />
                <SidebarInset className="flex flex-col flex-1 bg-[#EFF4FF] min-h-screen">
                    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 sm:gap-4 bg-white/95 px-3 sm:px-6 shadow-xs backdrop-blur-md border-b border-slate-200/60">
                        <SidebarTrigger className="text-slate-700 hover:bg-slate-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <PortalNavbar/>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">
                        {children || <Outlet />}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
