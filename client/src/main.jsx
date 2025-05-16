import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from  'react-router-dom'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './Store/UserSlice.js'

const myStore = configureStore({
  reducer: {
    user: UserSlice,
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={myStore}>
          <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
