import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootNode = document.getElementById('app');

if (!rootNode) {
    throw new Error('root node #app not found');
}

const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(App));
