import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Component } from 'react';

import TopNav from './TopNav';
import Button from './ui/Button';

import AppState from '../stores/AppState'
@inject('store') @observer
export default class TopBar extends Component<{ store?: AppState }, {}> {
    store = this.props.store

    authenticate(e: Event) {
        if (e) {
            e.preventDefault();
        }
        console.log('CLICKED BUTTON');
        this.store
            .authenticate();
    }

    render() {
        const { authenticated } = this.store;
        return (
            <div className="topbar">
                <TopNav />
                <Button onClick={this.authenticate.bind(this)}
                    title={authenticated ? 'Log out' : 'Sign in'} />
            </div>
        );
    }

}