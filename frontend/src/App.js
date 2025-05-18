import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Chat from './pages/Chat';


const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/home', element: <Home/> },
  { path: '/chat', element: <Chat /> },
]);

function App() {
  return <RouterProvider router={router} />;
} 

export default App;
