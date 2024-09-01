import {
  createBrowserRouter,
} from "react-router-dom";
import PosOrders from "../Pages/POS/PosOrders";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <PosOrders />,
  },
]);