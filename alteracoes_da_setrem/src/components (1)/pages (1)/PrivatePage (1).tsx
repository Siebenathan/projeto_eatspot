import { Navigate, Outlet } from "react-router-dom";

export default function PrivatePage() {
    const user = true;

    return user ? <Outlet></Outlet> : <Navigate to="/"/>
}