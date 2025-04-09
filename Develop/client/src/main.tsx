import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import Board from './pages/Board.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import EditTicket from './pages/EditTicket.tsx';
import CreateTicket from './pages/CreateTicket.tsx';
import Login from './pages/Login.tsx';
import AuthService from './utils/auth.ts';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!AuthService.loggedIn()) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }
  return children; // Render the protected component if logged in
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Board />
      }, 
      {
        path: '/edit',
        element: (
          <ProtectedRoute>
            <EditTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: '/create',
        element: (
          <ProtectedRoute>
            <CreateTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}