import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import AppState from './stores/AppState';
// import './styles/main.scss';

const appState = new AppState();

const root = document.createElement('div');
root.id = 'app';
document.body.appendChild(root);

ReactDOM.render(
    <App store={appState} />,
    document.querySelector('#app')
);