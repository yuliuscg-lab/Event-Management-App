import { Bell, CircleQuestionMark, Plus, Search, Store } from "lucide-react";
import { Field } from "../ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/input-group";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useNavigate } from "react-router";

export const PortalNavbar = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between gap-2 md:gap-4 w-full">
            <div className="flex-1 max-w-45 xs:max-w-[220px] sm:max-w-xs md:max-w-md">
                <Field className="w-full bg-white rounded-lg">
                    <InputGroup className="bg-slate-50 border border-slate-200 rounded-full focus-within:bg-white focus-within:border-primary transition-colors">
                        <InputGroupInput 
                            id="input-group-search" 
                            placeholder="Cari Event, Tiket..."
                            className="text-xs sm:text-sm text-slate-900 bg-transparent placeholder:text-slate-400 px-3"
                        />
                        <InputGroupAddon>
                            <Search className="w-4 h-4 text-slate-400 shrink-0"/>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
            </div>

            {}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 w-9" 
                            onClick={() => navigate("/")}
                        >
                            <Store className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>EventPulse Home Page</p>
                    </TooltipContent>
                </Tooltip>  

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 w-9"
                        >
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Notifikasi</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hidden sm:inline-flex rounded-full cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 w-9"
                        >
                            <CircleQuestionMark className="h-5 w-5"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Bantuan</p>
                    </TooltipContent>
                </Tooltip>

                {}
                <Button 
                    onClick={() => navigate("/organizer/events/create")} 
                    className="h-9 sm:h-10 px-2.5 sm:px-4 cursor-pointer font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs"
                    title="Buat Event Baru"
                >
                    <Plus className="h-4 w-4 md:mr-1.5 shrink-0"/>
                    <span className="hidden md:inline">Buat Event Baru</span>
                </Button>
            </div>
        </div>
    );
};