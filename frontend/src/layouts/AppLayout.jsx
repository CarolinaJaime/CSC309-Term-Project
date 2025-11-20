import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";

export default function app() {
    return (
        <div className="pt-16">
            <Navbar />
            <Outlet/>
        </div>
    )

}