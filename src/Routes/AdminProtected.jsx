/* eslint-disable react/no-unescaped-entities */

import { useContext } from "react";
import { AuthContext } from "../Components/context/AuthProvider";
import { Navigate } from "react-router-dom";
// import useLogout from "../Hook/useLogout";


const AdminProtected = ({ children }) => {

    const { authUser, loadingUser } = useContext(AuthContext);
    // const { logout } = useLogout()

    // console.log(authUser);



    if (loadingUser) {
        return (
            <div className="flex justify-center">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    }

    if (authUser && authUser?.role === "showroom_manager") {
        return children
    }
    return <Navigate state={location.pathname} to='/login'></Navigate>

    // return children
};

export default AdminProtected;
