import { useContext, useEffect, useState, useMemo } from "react";
import { ThemeContext } from "../../Contexts/ThemeContext";
import {
  addToDb,
  updateQtyInDb,
  removeFromDb,
  getStoredCart,
} from "../../utilities/CartDb";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import rightArrow from "../../Images/arrow-right-01-sharp.png";
import shop from "../../Images/shop.png";
import "./CartPage.css";

const CartPage = () => {
  const { cart, setCart } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);

  /* ───────────────── sync with LS (hard-refresh) ───────────────── */
  useEffect(() => {
    if (cart.length === 0) setCart(getStoredCart());
  }, []); // eslint-disable-line

  /* ────────────────── derived totals & grouping ────────────────── */
  const { totals, grouped } = useMemo(() => {
    const t = { items: 0, amount: 0 };
    const map = {}; // merchantName → rows[]
    cart.forEach((row) => {
      t.items += row.qty;
      t.amount += row.price * row.qty;

      const merchant = row.merchantName || "Unknown shop";
      if (!map[merchant]) map[merchant] = [];
      map[merchant].push(row);
    });
    return { totals: t, grouped: map };
  }, [cart]);

  /* ─────────────────────── helpers ─────────────────────── */
  const updateQty = (key, d) => {
    setCart(updateQtyInDb(key, d));
  };

  const remove = (key) => {
    setCart(removeFromDb(key));
    toast.success("Removed from cart");
  };

  const toggleRow = (key, checked) => {
    setCart((prev) =>
      prev.map((r) => (r.key === key ? { ...r, selected: checked } : r))
    );
  };

  const toggleMerchant = (m, checked) => {
    setCart((prev) =>
      prev.map((r) =>
        (r.merchantName || "Unknown shop") === m
          ? { ...r, selected: checked }
          : r
      )
    );
  };

  const toggleAll = (checked) => {
    setCart((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const anySelected = cart.some((r) => r.selected);

  /* ─────────────────────────────────────────────────────── */

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link
          to="/"
          className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-[#0C1C2C] transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  return (
    <section className="px-4 py-6 bg-[#F1F5F9]">
      {/* breadcrumb mimic */}
      <nav className="text-[14px] font-normal  px-4 lg:px-0 py-4 mb-4 lg:mb-0 flex gap-[4px] bg-[#F1F5F9] lg:w-[1269px] mx-auto">
        <Link to="/" className="text-[#0F172A] text-[14px] font-normal">
          Home
        </Link>
        <img alt="" src={rightArrow} />
        <p className="text-[#475569]">My Cart</p>
      </nav>

      <div className="flex flex-col sm:flex-row gap-6 lg:w-[1269px] mx-auto">
        {/* ───────────────—  LEFT: cart list  —─────────────── */}
        <div className="border rounded bg-white lg:w-[823px]">
          {/* header line */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-[#0F172A] lg:text-[32px] font-semibold">
              My Cart <span className="">({totals.items})</span>
            </h2>

            <div className="flex items-center space-x-6 text-sm">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="custom-checkbox accent-[#00B795] lg:w-[20px] lg:h-[20px]"
                  checked={cart.every((r) => r.selected)}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
                <span className="text-[#475569]  text-sm lg:text-[16px]">
                  Select All
                </span>
              </label>
              <button
                className="text-[#475569]  text-sm lg:text-[16px] disabled:opacity-40 mt-1"
                disabled={!anySelected}
                onClick={() =>
                  cart.filter((r) => r.selected).forEach((r) => remove(r.key))
                }
              >
                Clear All
              </button>
            </div>
          </div>

          {/* merchants */}
          {Object.entries(grouped).map(([merchant, rows]) => (
            <div key={merchant} className="border-b last:border-0">
              {/* merchant bar */}
              <div className="bg-[#F1F5F9] flex items-center px-4 py-2 text-sm font-medium flex gap-4">
                <input
                  type="checkbox"
                  className="custom-checkbox accent-[#00B795] mr-2 lg:w-[20px] lg:h-[20px]"
                  checked={rows.every((r) => r.selected)}
                  onChange={(e) => toggleMerchant(merchant, e.target.checked)}
                />

                <div className="flex gap-2 text-[#334155]">
                  <img src={shop} alt="" />
                  <p>BD FASHION HOUSE</p>
                  <p className="text-[#64748B]">></p>
                </div>
              </div>

              {rows.map((it) => (
                <div
                  key={it.key}
                  className="flex items-start px-4 py-3 border-b last:border-0"
                >
                  {/* row-checkbox */}
                  <input
                    type="checkbox"
                    className="custom-checkbox accent-[#00B795] text-white mt-2 sm:mt-0 mr-3 lg:w-[20px] lg:h-[20px]"
                    checked={!!it.selected}
                    onChange={(e) => toggleRow(it.key, e.target.checked)}
                  />

                  {/* thumbnail + info */}
                  <img
                    src={it.img}
                    alt={it.name}
                    className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] object-cover rounded mr-3 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium  text-sm lg:text-[16px] text-[#0F172A]">
                      {it.product.name}
                    </p>
                    <p className="text-sm lg:text-[16px] text-[#475569] font-normal flex flex-col lg:flex-row">
                      <span>Color : {it.color};</span>
                      <span>Size : {it.size}</span>
                    </p>
                    {/* qty box */}
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-4 justify-between px-1 border rounded-full lg:w-[161px] h-[40px]">
                        <button
                          onClick={() => updateQty(it.key, -1)}
                          className="hover:bg-gray-100 flex justify-center items-center w-[36px] bg-[#F1F5F9] h-[33px] rounded-full"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-center text-[#171717]  text-sm lg:text-[16px] font-bold">
                          {String(it.qty).padStart(2, "0")}
                        </span>

                        <button
                          onClick={() => updateQty(it.key, 1)}
                          className="hover:bg-gray-100 flex justify-center items-center w-[36px] bg-[#F1F5F9] h-[33px] rounded-full"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(it.key)}
                        className="text-[#94A3B8] hover:text-red-500 ml-3"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="w-24 text-right font-bold hidden md:block">
                    ৳{(it.price * it.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ───────────────—  RIGHT: summary card  —─────────────── */}
        <aside className="bg-white border rounded p-6 space-y-4 lg:w-[418px]">
          <h3 className="text-[#475569] text-[24px] font-medium">
            Order summary
          </h3>

          <div className="flex justify-between  text-sm lg:text-[16px] text-[#475569]">
            <span className="font-medium">
              Price ({totals.items} {totals.items > 1 ? "items" : "item"})
            </span>
            <span className="font-normal text-[#0F172A]  text-sm lg:text-[16px]">
              ৳{totals.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[#475569]  text-sm lg:text-[16px] font-medium">
              Shipping fee
            </span>
            <span className="text-[#3B82F6] text-[14px] font-normal">
              To be added
            </span>
          </div>

          {/* coupon */}
          <div className="flex">
            <input
              type="text"
              placeholder="Store / Falcon coupon"
              className="border rounded-l px-3 py-2 flex-1 text-sm"
            />
            <button className="bg-[#00B795] text-white px-4 rounded-r text-sm">
              Apply
            </button>
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold">
            <span className="text-[#334155] text-[18px] font-medium">
              Sub Total
            </span>
            <span className="text-[#171717] font-semibold text-[20px]">
              ৳{totals.amount.toLocaleString()}
            </span>
          </div>

          <button
            disabled={!agree}
            onClick={() => navigate("/checkout")}
            className={`w-full h-[48px] rounded text-white text-sm font-medium ${
              agree
                ? "bg-[#00B795] hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
          </button>

          <label className="flex items-start space-x-2 ">
            <input
              type="checkbox"
              className="custom-checkbox accent-[#00B795] p-2 lg:w-[20px] lg:h-[20px] "
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <span className="text-[#475569] text-sm lg:text-[16px] font-normal">
              I have read and agree to the Terms and Conditions, Privacy Policy
              and Refund and Return Policy
            </span>
          </label>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;
