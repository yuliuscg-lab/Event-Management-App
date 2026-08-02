import { BrowserRouter, Route, Routes } from "react-router"
import { RegisterPage } from "../pages/Register"
import { LoginPage } from "@/pages/Login/Login"
import { CustomerLayout } from "@/components/layout/CustomerLayout"
import { Home } from "@/pages/customer/Home/Home"
import { PublicOnlyRoute } from "./PublicOnlyRoute"
import { ProtectedRoute } from "./ProtectedRoute"
import { PortalLayout } from "@/components/layout/PortalLayout"
import { Dashboard } from "@/pages/organizer/Dashboard"
import { Events } from "@/pages/organizer/Events"
import { Tickets } from "@/pages/organizer/Tickets"
import { Sales } from "@/pages/organizer/Sales"

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicOnlyRoute/>}>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element = {<RegisterPage/>}/>
                </Route>
                <Route element={<CustomerLayout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/events/:id" element={<></>}/>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]}/>}>
                    <Route path="/organizer/portal" element={<PortalLayout children={<Dashboard/>}/>}/>
                    <Route path="/organizer/events" element={<PortalLayout children={<Events/>}/>}/>
                    <Route path="/organizer/tickets" element={<PortalLayout children={<Tickets/>}/>}/>
                    <Route path="/organizer/sales" element={<PortalLayout children={<Sales/>}/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}