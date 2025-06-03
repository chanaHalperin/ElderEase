import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './Store/UserSlice.js'

const queryClient = new QueryClient();
const myStore = configureStore({
  reducer: {
    user: UserSlice,
  }
})
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <Provider store={myStore}>
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  </QueryClientProvider>
);
