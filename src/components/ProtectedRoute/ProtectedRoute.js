import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from 'services/auth/AuthContext';

export default function ProtectedRoute(props) {
    const { authData: authDataCtx } = useContext(AuthContext);

    const isUserAuthorized = () => {
        if (authDataCtx && Array.isArray(authDataCtx.authorities) && props.targetRole) {
            const isAuthorized = authDataCtx.authorities.find((role) => {
                if (role.authority === props.targetRole) {
                    return true;
                }
                return false;
            });
            return isAuthorized;
        }
        return false;
    }


    return (
        isUserAuthorized() ? (
            <Route {...props} />
        ) : (
            <Redirect from={props.path} to="/auth/login" />
        )
    );

    //redirect if there is no user 
}
