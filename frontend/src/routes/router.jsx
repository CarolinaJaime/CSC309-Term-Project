// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "../auth/ProtectedRoutes";
import Transactions from "../pages/Transactions";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [ 
        {element: <ProtectedRoute/>, children:
            [
                { element: <AppLayout />, children:
                  [
                  {index: true, element: <Dashboard />},
                  {path: "transactions", element: <Transactions />}
                  ]
                 },
            ]
        },
        { path: "login", element: <PublicLayout /> },
    ],
  },
]);

export default router;

