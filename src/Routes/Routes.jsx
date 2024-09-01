import {
  createBrowserRouter,
} from "react-router-dom";
import PosOrders from "../Pages/POS/PosOrders";
import Login from "../Pages/Login/Login";
import AdminProtected from "./AdminProtected";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminProtected><PosOrders /></AdminProtected>,
  },
  {
    path:'/login',
    element:<Login/>
  }
]);