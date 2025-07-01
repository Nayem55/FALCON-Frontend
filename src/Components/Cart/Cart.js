import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Contexts/ThemeContext";
import "./Cart.css";

const Cart = () => {
  const location = useLocation();
    const navigate = useNavigate();
  

  const { cart } = useContext(ThemeContext);

  let qty = 0;
  cart?.forEach((product) => {
    qty = qty + product?.qty;
  });

  return (
    <div className="flex-none">
      {/*----------------- Navbar Cart -----------------*/}
      <div
        className={`mr-2 mt-2`}
      >
        <div className="indicator">
          {/*-------------- cart icon -------------*/}

          {location.pathname.includes("/cart") || (
            <div onClick={()=>navigate("/cart")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`transition ease-in duration-200 h-6 w-6 cursor-pointer text-secondary`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <span
                className={`badge text-primary font-bold border-none cursor-pointer lg:badge-sm text-xs indicator-item bg-red-500 flex justify-center items-center pt-[1px]`}
              >
                {qty}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
