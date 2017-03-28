import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ActiveLink from './ui/Activelink';

import AppState from '../stores/AppState';

@inject('store') @observer
export default class TopNav extends React.Component<{ store?: AppState }, {}> {

    store = this.props.store

    authenticate(e: Event) {
        if (e) {
            e.preventDefault();
        }
        this.store.authenticate();
    }

    render() {
        const { authenticated } = this.store;
        return (
            <nav>
                <ActiveLink activeOnlyWhenExact to="/">Home</ActiveLink>
                {authenticated && <ActiveLink to="/posts">Posts</ActiveLink>}
            </nav>
        );
    }

}