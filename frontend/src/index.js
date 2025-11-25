import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {NotificationProvider} from "./components/notifications/NotificationProvider";
import {ToastContainer} from "./components/notifications/ToastContainer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <NotificationProvider>
        <App />
        <ToastContainer />
    </NotificationProvider>
);