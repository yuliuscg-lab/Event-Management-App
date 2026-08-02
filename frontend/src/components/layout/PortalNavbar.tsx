import { Bell, CircleQuestionMark, Plus, Search, Store } from "lucide-react"
import { Field } from "../ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/input-group"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useNavigate } from "react-router"

export const PortalNavbar = () => {
    const navigate = useNavigate();
    return (
        <header className="sticky flex top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center px-4 gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Field className="w-100 bg-white rounded-lg">
                        <InputGroup className="bg-transparent rounded-full">
                            <InputGroupInput id="input-group-search" placeholder="Cari Event, Tiket, atau Laporan"/>
                            <InputGroupAddon>
                                <Search className="w-4 h-4"/>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="rounded-full cursor-pointer" onClick={() => navigate("/")}>
                                <Store size="icon"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>EventPulse Home Page</p>
                        </TooltipContent>
                    </Tooltip>  
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="rounded-full cursor-pointer">
                                <Bell size="icon"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifikasi</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="rounded-full cursor-pointer">
                                <CircleQuestionMark size="icon"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bantuan</p>
                        </TooltipContent>
                    </Tooltip>
                    <Button className="h-10 cursor-pointer">
                        <Plus  size="icon"/>
                        Buat Event Baru
                    </Button>
                </div>
            </div>
        </header>
    )
}