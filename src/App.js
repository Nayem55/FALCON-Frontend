import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { ThemeContext } from "./Contexts/ThemeContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./Routes/Routes";


/* ---------- helper to read cart once ---------- */
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("shopping_cart") || "[]");
  } catch {
    return [];
  }
};

function App() {

  /* cart (hydrate from localStorage) */
  const [cart, setCart] = useState(() => loadCart());

  /* keep React state & localStorage in sync on every change */
  useEffect(() => {
    localStorage.setItem("shopping_cart", JSON.stringify(cart));
  }, [cart]);

  const [searchText, setSearchText] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  /* ------------ memoised context --------------- */
  const contextValue = useMemo(
    () => ({
      cart,
      setCart,
      searchText,
      setSearchText,
      appliedCoupon,
      setAppliedCoupon,
    }),
    [
      cart,
      searchText,
      appliedCoupon,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeContext.Provider>
  );
}

export default App;
