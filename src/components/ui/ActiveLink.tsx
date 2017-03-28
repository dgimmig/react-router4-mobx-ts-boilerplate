import * as React from 'react';
import { NavLink, Route } from 'react-router-dom';

const ActiveLink = ({ to, activeOnlyWhenExact = false, ...rest }) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <NavLink to={to} {...rest} className={match ? 'active' : ''} />
        )}
    />
);

export default ActiveLink;
