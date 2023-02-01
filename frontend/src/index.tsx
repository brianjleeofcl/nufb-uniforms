import React from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize-css';
import './index.css';
import '@fontsource/cooper-hewitt/500.css';
import '@fontsource/cooper-hewitt/700.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: () => {}
})

const App = <Provider store={store}>
  <RouterProvider router={router} />
</Provider>

createRoot(document.getElementById('root') as Element).render(App)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
