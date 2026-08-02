import { Blocks, LayoutDashboard, LogOut, Search, UserCheck, UserIcon } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu"
import { Link, useNavigate } from "react-router"
import { Field } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { useAuthStore } from "@/store/useAuthStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { authService } from "@/api/auth"
import pointImg from "@/assets/point.webp"

export const Navbar = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated, logout } = useAuthStore();

    const getFirstName = (fullName?:string) => {
        if(!fullName) return "User";
        return fullName.trim().split(" ")[0];
    };

    const handleLogout = async() => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Gagal melakukan revoke token di server:", error);
        } finally {
            logout()
            navigate("/", { replace: true});
        }
    }
    const profileLink = user?.role === "ORGANIZER" ? "/organizer/portal" : "/"

    return (
        <header className="sticky flex top-0 z-50 border-b border-primary/50 bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4 gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-bold text-primary">
                        EventPulse
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Blocks className="w-5 h-5 mr-2"/>
                                    Kategori
                                </NavigationMenuTrigger>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>    
                </div>
                <div className="flex items-center gap-4">
                    <Field className="w-75 bg-white rounded-lg">
                        <InputGroup className="bg-transparent">
                            <InputGroupInput id="input-group-search" placeholder="Cari Tiket"/>
                            <InputGroupAddon>
                                <Search className="w-4 h-4"/>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>

                    { isAuthenticated && user ? (

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-secondary hover:bg-neutral-100 transition-colors outline-none cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                        {user.profile?.avatarUrl ? (
                                            <img src={user.profile.avatarUrl} alt={user.name} className="w-full h-full object-cover"/>
                                        ) : (
                                            <span className="text-sm font-bold">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : "O"}
                                            </span>
                                        )} 
                                    </div>
                                    <span>{getFirstName(user.name)}</span>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52 mt-2">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Hi, {user.name}!</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <img src={pointImg} alt="Point" className="w-5 h-5"/>
                                        <span>{user.balancePoints.toLocaleString("id-ID")} Points</span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator/>

                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to={profileLink} className="flex items-center gap-2 w-full">
                                        { user.role=="ORGANIZER" ? 
                                            <LayoutDashboard className="w-4 h-4 text-neutral-600" /> 
                                            : 
                                            <UserCheck className="w-4 h-4 text-neutral-600" />}
                                        <span>{ user.role=="ORGANIZER" ? "Portal Saya" : "Profil Saya"}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>

                                <DropdownMenuItem 
                                    onClick={handleLogout} 
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                            <div className = "flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-primary"/>
                                <Link to="/login" className = "px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                    Masuk/Daftar
                                </Link>
                            </div>
                    )}
                </div>
            </div>
        </header>
    )
}