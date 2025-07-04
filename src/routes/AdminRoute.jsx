import React, { Children } from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    const{user,loading}=useAuth();
    const {role,roleLoading} =useUserRole();
    console.log(user,role,loading,roleLoading);
    
    if(loading || roleLoading){
        return <span className="loading loading-spinner text-error"></span>
    }
     if(!user || role !=='admin'){
            return  <Navigate state={{from:location.pathname}} to='/forbidden'></Navigate>
        }
        return children;

   
};

export default AdminRoute;