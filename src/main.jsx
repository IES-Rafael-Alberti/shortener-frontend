import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router/index.jsx'

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
