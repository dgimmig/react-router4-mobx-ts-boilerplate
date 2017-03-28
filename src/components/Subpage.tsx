import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import DataWrapper from './DataWrapper';
import Protected from './Protected';

import AppState from '../stores/AppState';

@Protected @DataWrapper @inject('store') @observer
export default class Subpage extends Component<{ store?: AppState, match?: any }, {}> {
    render() {
        return (
            <div className="page posts">
                <h1>Posts</h1>
                <p className="subheader">Posts are fetched from jsonplaceholder.typicode.com</p>
                <hr />
                <ul>
                    {this.props.store.items && this.props.store.items.length
                        ? this
                            .props.store
                            .items
                            .slice(6, 12)
                            .map((post) => {
                                return <li key={post.id}>
                                    <Link to={`${this.props.match.path}/${post.id}`}>
                                        <h1>{post.title}</h1>
                                    </Link>
                                    <p>{post
                                        .body
                                        .substring(0, 120)}</p>
                                </li>;
                            })
                        : 'Loading...'}
                </ul>
            </div>
        );
    }
}