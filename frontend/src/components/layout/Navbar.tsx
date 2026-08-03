import { Blocks, LayoutDashboard, LogOut, Search, Ticket, UserCheck, UserIcon } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { Link, useNavigate } from "react-router";
import { Field } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useAuthStore } from "@/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { authService } from "@/api/auth";
import pointImg from "@/assets/point.webp";

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();

    const getFirstName = (fullName?: string) => {
        if (!fullName) return "User";
        return fullName.trim().split(" ")[0];
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Gagal melakukan revoke token di server:", error);
        } finally {
            logout();
            navigate("/", { replace: true });
        }
    };

    const profileLink = user?.role === "ORGANIZER" ? "/organizer/portal" : "/";

    return (
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-white/95 backdrop-blur-md shadow-xs">
            <div className="container mx-auto flex h-16 items-center px-3 sm:px-4 gap-2 sm:gap-4 justify-between">
                <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
                    <Link to="/" className="text-base sm:text-xl font-bold text-primary tracking-tight">
                        EventPulse
                    </Link>

                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-slate-700 font-medium px-2 sm:px-3">
                                    <Blocks className="w-4 h-4 md:mr-2 text-primary shrink-0" />
                                    <span className="hidden md:inline">Kategori</span>
                                </NavigationMenuTrigger>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex-1 max-w-60 xs:max-w-[180px] sm:max-w-xs md:max-w-md">
                    <Field className="w-full bg-white rounded-lg">
                        <InputGroup className="bg-slate-50 border border-slate-200 rounded-full focus-within:bg-white focus-within:border-primary transition-colors">
                            <InputGroupInput 
                                id="input-group-search" 
                                placeholder="Cari Tiket..."
                                className="text-xs sm:text-sm text-slate-900 bg-transparent placeholder:text-slate-400 px-2 sm:px-3"
                            />
                            <InputGroupAddon>
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-1.5 sm:px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors outline-none cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                                        {user.profile?.avatarUrl ? (
                                            <img src={user.profile.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs sm:text-sm font-bold">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : "O"}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden sm:inline-block text-slate-700 font-medium">
                                        {getFirstName(user.name)}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none text-slate-900">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                    {
                                        user.role === "CUSTOMER" ? ( 
                                            <div className="flex flex-col gap-1.5 mt-3">
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                            <img src={pointImg} alt="Point" className="w-4 h-4 shrink-0" />
                                            <span className="text-xs font-semibold text-slate-700">{user.balancePoints.toLocaleString("id-ID")} Points</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                            <Ticket className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-xs font-semibold text-slate-700">{(user.couponsCount ?? 0).toLocaleString("id-ID")} Kupon</span>
                                        </div>
                                    </div>
                                        ) : null
                                    }
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="my-1.5" />

                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to={profileLink} className="flex items-center gap-2.5 w-full py-2">
                                        {user.role === "ORGANIZER" ? (
                                            <LayoutDashboard className="w-4 h-4 text-slate-600" />
                                        ) : (
                                            <UserCheck className="w-4 h-4 text-slate-600" />
                                        )}
                                        <span className="text-sm font-medium">{user.role === "ORGANIZER" ? "Portal Saya" : "Profil Saya"}</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1.5" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer py-2"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">Log Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                            >
                                <UserIcon className="w-4 h-4 text-white shrink-0" />
                                <span className="hidden xs:inline">Masuk/Daftar</span>
                                <span className="xs:hidden">Masuk</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};