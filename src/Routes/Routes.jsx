import {
  createBrowserRouter,
} from "react-router-dom";
import PosOrders from "../Pages/POS/PosOrders";
import Login from "../Pages/Login/Login";
import AdminProtected from "./AdminProtected";
import Dashboard from "../Pages/Dashboard/Dashboard";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminProtected><Dashboard/> </AdminProtected>,
  },
  {
    path: "/pos",
    element: <AdminProtected><PosOrders /></AdminProtected>,
  },
  {
    path:'/login',
    element:<Login/>
  }
]);