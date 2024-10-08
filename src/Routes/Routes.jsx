import {
  createBrowserRouter,
} from "react-router-dom";
import PosOrders from "../Pages/POS/PosOrders";
import Login from "../Pages/Login/Login";
import AdminProtected from "./AdminProtected";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Invoice from "../Pages/Invoice/Invoice";
import ProductList from "../Pages/Account/ProductList";
import ClosingCash from "../Pages/ClosingCash/ClosingCash";





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
    path: "/invoice/:id",
    element: <AdminProtected><Invoice /></AdminProtected>,
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/account',
    element:<ProductList/>
  },
  {
    path:'/closing-cash',
    element:<ClosingCash/>
  },
]);