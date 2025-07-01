/*  CartPage.jsx  —  redesigned cart  */
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
    <section className="px-4 md:px-16 py-6">
      {/* breadcrumb mimic */}
      <nav className="text-xs text-gray-500 mb-4">
        Home <span className="mx-1">›</span> <span className="font-medium">My Cart</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* ───────────────—  LEFT: cart list  —─────────────── */}
        <div className="border rounded">
          {/* header line */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-xl font-semibold">
              My Cart <span className="text-teal-600">({totals.items})</span>
            </h2>

            <div className="flex items-center space-x-6 text-sm">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal-600"
                  checked={cart.every((r) => r.selected)}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
                <span>Select All</span>
              </label>
              <button
                className="text-red-600 hover:underline disabled:opacity-40"
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
              <div className="bg-gray-50 flex items-center px-4 py-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="accent-teal-600 mr-2"
                  checked={rows.every((r) => r.selected)}
                  onChange={(e) => toggleMerchant(merchant, e.target.checked)}
                />
                {merchant}
              </div>

              {rows.map((it) => (
                <div
                  key={it.key}
                  className="flex items-start sm:items-center px-4 py-3 border-b last:border-0"
                >
                  {/* row-checkbox */}
                  <input
                    type="checkbox"
                    className="accent-teal-600 mt-2 sm:mt-0 mr-3"
                    checked={!!it.selected}
                    onChange={(e) => toggleRow(it.key, e.target.checked)}
                  />

                  {/* thumbnail + info */}
                  <img
                    src={it.img}
                    alt={it.name}
                    className="w-16 h-16 object-cover rounded mr-3 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{it.name}</p>
                    {it.variantLabel && (
                      <p className="text-xs text-gray-500">
                        {it.variantLabel}
                      </p>
                    )}
                  </div>

                  {/* price / qty / subtotal */}
                  <div className="hidden md:block w-20 text-right">
                    ৳{it.price.toLocaleString()}
                  </div>

                  {/* qty box */}
                  <div className="mx-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQty(it.key, -1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4">{it.qty}</span>
                      <button
                        onClick={() => updateQty(it.key, 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="w-24 text-right font-medium hidden md:block">
                    ৳{(it.price * it.qty).toLocaleString()}
                  </div>

                  <button
                    onClick={() => remove(it.key)}
                    className="text-red-500 hover:text-red-700 ml-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ───────────────—  RIGHT: summary card  —─────────────── */}
        <aside className="border rounded p-6 space-y-4 h-max">
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
            <button className="bg-teal-600 text-white px-4 rounded-r text-sm">
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
            className={`w-full py-3 rounded text-white text-sm font-medium ${
              agree
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
          </button>

          <label className="flex items-start space-x-2 text-xs">
            <input
              type="checkbox"
              className="accent-teal-600 mt-[2px]"
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
