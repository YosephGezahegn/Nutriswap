// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot instead of ReactDOM.render
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

// Create a root element to render the app
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app with the Redux provider
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);