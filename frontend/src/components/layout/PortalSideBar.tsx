import { Link, useLocation } from "react-router"
import { 
    LayoutDashboard, 
    Calendar, 
    Ticket, 
    TrendingUp, 
    LogOut, 
    Sparkles 
} from "lucide-react"
import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    SidebarSeparator 
} from "../ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { authService } from "@/api/auth"

export const PortalSideBar = () => {
    const location = useLocation()
    const { user } = useAuthStore()

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error("Gagal melakukan revoke token di server:", error)
        } finally {
            window.location.replace("/")
        }
    }

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/organizer/portal",
        },
        {
            title: "Events",
            icon: Calendar,
            path: "/organizer/events",
        },
        {
            title: "Tickets",
            icon: Ticket,
            path: "/organizer/tickets",
        },
        {
            title: "Sales",
            icon: TrendingUp,
            path: "/organizer/sales",
        },
    ]

    return (
        <Sidebar className="border-r border-slate-200 bg-[#EFF4FF] ">
            <SidebarHeader className="p-4 border-b border-slate-100">
                <Link to="/organizer/portal" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20L">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                            EventPulse
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                            Organizer Portal
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarMenu>
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`w-full h-12 justify-start gap-3 px-3 py-2.5 rounded-lg font-medium transition-all 
                                        ${ isActive ? 
                                            "bg-primary text-white hover:bg-primary/90 shadow-sm data-[active=true]:bg-primary data-[active=true]:text-white"
                                            : 
                                            "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 data-[active=false]:bg-transparent"
                                        }`}
                                >
                                    <Link to={item.path}>
                                        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarSeparator className="my-1" />
            <SidebarFooter className="p-3">
                <div className="flex flex-col gap-3 p-2.5 rounded-xl bg-[#EFF4FF] border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold shadow-inner">
                            {user?.profile?.avatarUrl ? (
                                <img
                                    src={user.profile.avatarUrl}
                                    alt={user.name || "User Avatar"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "O"}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate text-sm font-semibold text-slate-800">
                                {user?.name || "Organizer Name"}
                            </span>
                            <span className="truncate text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {user?.role || "ORGANIZER"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
