import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'aos/dist/aos.css';
import Aos from 'aos';
Aos.init();
const queryClient = new QueryClient()
import {
  
  QueryClientProvider, QueryClient,
} from '@tanstack/react-query'

import {
  
  RouterProvider,
} from "react-router";
import { router } from './router/router.jsx';
import AuthProvider from './Context/AuthContext/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode >
  <div className='font-urbanist max-w-7xl mx-auto'>
  
  <QueryClientProvider client={queryClient}>
      
      <AuthProvider>
  <RouterProvider router={router} />
  </AuthProvider>
    </QueryClientProvider>
  </div>
  </StrictMode>,
)
