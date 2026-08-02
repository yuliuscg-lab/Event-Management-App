import { Outlet } from "react-router"
import { Navbar } from "./Navbar"

export const CustomerLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar/>
            <main className="flex-1">
                <Outlet/>
            </main>

        </div>
    )
}