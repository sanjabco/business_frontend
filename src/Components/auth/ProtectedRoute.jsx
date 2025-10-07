import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";
import {useAuth} from "../../store/selectors/index.js";
import {useEffect, useState} from "react";
import {deleteCookie} from "../../helper";

const ProtectedRoute = ({children}) => {
    const isAuthenticated = useAuth();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            deleteCookie("jwt");
        }
        setAuthChecked(true);
    }, [isAuthenticated]);

    if (!authChecked) return null;

    return isAuthenticated ? children : <Navigate to="/login" replace/>;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
};

export default ProtectedRoute;
