import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user,loading}=useAuth();
    if(loading){
        return <span className="loading loading-spinner text-error"></span>
    }
    if(!user){
        <Navigate to='/login'></Navigate>
    }
    return children;
};

export default PrivateRoute;