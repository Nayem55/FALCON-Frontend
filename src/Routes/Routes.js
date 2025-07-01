import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";

import NotFound from "../Pages/NotFound";
import CartPage from "../Pages/CartPage/CartPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/*",
        element: <NotFound></NotFound>,
      },
      {
        path: "/product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },

]);

export default router;
