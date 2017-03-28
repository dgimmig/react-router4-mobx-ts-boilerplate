import { inject, observer } from 'mobx-react';
import * as React from 'react';

import AppState from '../stores/AppState';

export default function DataWrapper(Component: any) {
    @inject('store') @observer
    class DataFetcher extends React.Component<{ store?: AppState, match: any }, {}> {

        store = this.props.store;

        componentDidMount() {
            console.log(this.props);
            const pathname = this.props.match.url;

            this.store.fetchData(pathname);
        }

        componentWillUnmount() {
            this.store.clearItems();
        }

        render() {
            return <Component {...this.props} />;
        }

    }
    return DataFetcher;
}