import * as React from 'react'
import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import DataWrapper from './DataWrapper'
import Protected from './Protected'

import AppState from '../stores/AppState';

export interface ISubitem {
    title: string,
    body: string,
    id: number,
    userId: number
}
@Protected @DataWrapper @inject('store') @observer
export default class Subitem extends Component<{ store?: AppState }, {}> {
    render() {
        return (
            <div className="page post">
                <Link to="/posts">&larr; Back to Posts</Link>
                {!!this.props.store.item && (
                    <article>
                        <h1>{this.props.store.item.title}</h1>
                        <p>{this.props.store.item.body}</p>
                    </article>
                )}

            </div>
        )
    }
}