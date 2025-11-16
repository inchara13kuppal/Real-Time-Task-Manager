import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // If authenticated, render the component (BoardPage)
    // Otherwise, redirect to the login page
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;