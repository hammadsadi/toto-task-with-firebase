import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "react-hot-toast";
import { RouterProvider } from 'react-router-dom';
import route from './routes/route.jsx';
import AuthProvider from './providers/AuthProvider.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>

   <RouterProvider router={route}/>
    <Toaster />
    </AuthProvider>
  </StrictMode>
);
