import React  from 'react'
import { Route, Redirect } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = (props) => {
    const { component: Component, render, ...rest } = props;
    return ( 
        <Route // protected route
              {...rest}
              render={(props) => {
                if (!auth.hasCurrentUser()) return <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />;
                return Component ? <Component {...props} /> : render(props);
              }}
            />
     );
}
 
export default ProtectedRoute;