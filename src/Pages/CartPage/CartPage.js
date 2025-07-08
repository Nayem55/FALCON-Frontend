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

const CartPage = () => {
  const { cart, setCart } = useContext(ThemeContext);
  const navigate             = useNavigate();
  const [agree, setAgree]     = useState(false);

  /* ───────────────── sync with LS (hard-refresh) ───────────────── */
  useEffect(() => {
    if (cart.length === 0) setCart(getStoredCart());
  }, []);                    // eslint-disable-line

  /* ────────────────── derived totals & grouping ────────────────── */
  const { totals, grouped } = useMemo(() => {
    const t   = { items: 0, amount: 0 };
    const map = {};                                  // merchantName → rows[]
    cart.forEach((row) => {
      t.items  += row.qty;
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
        (r.merchantName || "Unknown shop") === m ? { ...r, selected: checked } : r
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
      <nav className="text-xs text-gray-500 mb-4 lg:w-[1269px] mx-auto">
        Home <span className="mx-1">›</span> <span className="font-medium">My Cart</span>
      </nav>

      <div className="flex flex-col sm:flex-row gap-6 lg:w-[1269px] mx-auto">
        {/* ───────────────—  LEFT: cart list  —─────────────── */}
        <div className="border rounded bg-white lg:w-[823px]">
          {/* header line */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-xl font-semibold">
              My Cart <span className="">({totals.items})</span>
            </h2>

            <div className="flex items-center space-x-6 text-sm">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#00B795]"
                  checked={cart.every((r) => r.selected)}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
                <span className="mt-1 text-[#94A3B8]">Select All</span>
              </label>
              <button
                className="text-red-600 hover:underline disabled:opacity-40 mt-1"
                disabled={!anySelected}
                onClick={() => cart
                  .filter((r) => r.selected)
                  .forEach((r) => remove(r.key))}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* merchants */}
          {Object.entries(grouped).map(([merchant, rows]) => (
            <div key={merchant} className="border-b last:border-0">
              {/* merchant bar */}
              <div className="bg-[#F1F5F9] flex items-center px-4 py-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="accent-[#00B795] mr-2"
                  checked={rows.every((r) => r.selected)}
                  onChange={(e) => toggleMerchant(merchant, e.target.checked)}
                />
                BD FASHION HOUSE
              </div>

              {rows.map((it) => (
                <div
                  key={it.key}
                  className="flex items-start px-4 py-3 border-b last:border-0"
                >
                  {/* row-checkbox */}
                  <input
                    type="checkbox"
                    className="accent-[#00B795] mt-2 sm:mt-0 mr-3"
                    checked={!!it.selected}
                    onChange={(e) => toggleRow(it.key, e.target.checked)}
                  />

                  {/* thumbnail + info */}
                  <img
                    src={it.img}
                    alt={it.name}
                    className="w-[100px] h-[100px] object-cover rounded mr-3 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{it.product.name}</p>
                      <p className="text-xs text-gray-500 flex gap-2">
                        <span>Color : {it.color} ;</span>
                        <span>Size : {it.size}</span>
                      </p>
                  {/* qty box */}
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center border rounded lg:w-[161px] h-[40px]">
                      <button
                        onClick={() => updateQty(it.key, -1)}
                        className="hover:bg-gray-100 flex justify-center items-center w-1/3 bg-[#F1F5F9] h-[40px]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 w-1/2 text-center">{it.qty}</span>
                      <button
                        onClick={() => updateQty(it.key, 1)}
                        className="hover:bg-gray-100 flex justify-center items-center w-1/3 bg-[#F1F5F9] h-[40px]"
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
          <h3 className="text-lg font-semibold">Order summary</h3>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Price ({totals.items} {totals.items > 1 ? "items" : "item"})
            </span>
            <span className="font-medium">
              ৳{totals.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping fee</span>
            <span className="text-gray-400">To be added</span>
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
            <span>Sub Total</span>
            <span>৳{totals.amount.toLocaleString()}</span>
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

          <label className="flex items-start space-x-2 text-xs">
            <input
              type="checkbox"
              className="accent-[#00B795] mt-[2px]"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I have read and agree to the Terms and Conditions, Privacy
              Policy and Refund and Return Policy
            </span>
          </label>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;
