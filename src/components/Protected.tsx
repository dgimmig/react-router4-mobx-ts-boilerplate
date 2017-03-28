import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect } from 'react-router-dom';

import AppState from '../stores/AppState';

export default function Protected(Component: any) {
    @inject('store') @observer
    class AuthenticatedComponent extends React.Component<{ store?: AppState, location: any }, {}> {

        store = this.props.store;

        render() {
            const { authenticated, authenticating } = this.store;
            return (
                <div className="authComponent">
                    {authenticated
                        ? <Component {...this.props} />
                        : !authenticating && !authenticated
                            ? <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
                            : null
                    }
                </div>
            );
        }

    }
    return AuthenticatedComponent;
}