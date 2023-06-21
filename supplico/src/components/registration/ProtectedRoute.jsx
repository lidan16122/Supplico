import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({children}) => {
    let {isLoggedIn} = useContext(AuthContext);
    if (isLoggedIn) {
        return children
    }
    else{
        return <Navigate to="/login" />;
    }
}

export default ProtectedRoute;