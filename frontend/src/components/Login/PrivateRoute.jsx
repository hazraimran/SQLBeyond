import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if(loading && user){
        return <p>Loading ...</p>
    }

    if(user) 
        return <Outlet />;

    return <Navigate to="/" />
}

export default PrivateRoute;