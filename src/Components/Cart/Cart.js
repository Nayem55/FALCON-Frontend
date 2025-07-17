import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Contexts/ThemeContext";
import "./Cart.css";
import cartImage from "../../Images/shopping-cart-01.png"

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
      <div className={`mr-2 mt-2`}>
        <div className="indicator">
          {/*-------------- cart icon -------------*/}

          {location.pathname.includes("/cart") || (
            <div onClick={() => navigate("/cart")}>
              <img className="w-[28px] h-[28px]" alt="" src={cartImage} />
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
