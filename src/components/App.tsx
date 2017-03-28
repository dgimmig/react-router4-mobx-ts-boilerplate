// import LazyRoute from 'lazy-route';
import { observer, Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Subpage from './Subpage';
import Subitem from './Subitem';
import TopBar from './TopBar';
import Home from './Home'

// https://github.com/djeeg/example-react-router-universal-lazyroutes-typescript/search?utf8=%E2%9C%93&q=system&type=
interface ISystemExt extends Object {
    import?(path: string): any;
}

declare var System: ISystemExt;

@observer
export default class App extends Component<any, any> {

    store = this
        .props
        .store;

    componentDidMount() {
        this.authenticate();

    }
    authenticate(e?: any) {
        if (e) {
            e.preventDefault();
        }
        this
            .store
            .authenticate();
    }
    render() {
        const { timeToRefresh } = this.store;
        return (
            <Router >
                <Provider store={this.store}>
                    <div className="wrapper">
                        <DevTools />
                        <TopBar />
                        {/*//https://github.com/djeeg/example-react-router-universal-lazyroutes-typescript/search?utf8=%E2%9C%93&q=system&type=*/}
                        <Route exact path="/" render={props => (<Home {...props} />)} />
                        <Route exact path="/posts" render={props => (<Subpage {...props} />)} />
                        <Route
                            exact
                            path="/posts/:id"
                            render={props => (<Subitem {...props} />)}
                        />
                        <Route
                            exact
                            path="/login"
                            render={(props) => (<Login {...props} />)}
                        />
                        <footer>
                            Cobbled together by
                            <a href="https://twitter.com/mhaagens" target="_blank">@mhaagens</a>
                            | github:
                            <a href="https://github.com/mhaagens" target="_blank">mhaagens</a>
                        </footer>
                    </div>
                </Provider>
            </Router>
        );
    }
}