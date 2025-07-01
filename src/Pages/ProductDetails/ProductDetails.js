import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  StarOff,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ThemeContext } from "../../Contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { addToDb } from "../../utilities/CartDb";
import "react-lazy-load-image-component/src/effects/blur.css";

/**
 * ProductDetails – full 3‑column layout with delivery card matching screenshot
 */
const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(ThemeContext);

  /* -------------------- endpoints -------------------- */
  const PRODUCT_API = `http://157.230.240.97:9999/api/v1/product/${slug}`;
  const CATEGORIES_API = "http://157.230.240.97:9999/api/v1/categories";

  /* -------------------- state -------------------- */
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedVar, setSelectedVar] = useState(null);
  const [categories, setCategories] = useState({});
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [expandedSpec, setExpandedSpec] = useState(false);
  const [loading, setLoading] = useState(true);

  /* -------------------- fetch product -------------------- */
  useEffect(() => {
    setLoading(true);
    fetch(PRODUCT_API)
      .then((res) => res.json())
      .then(({ data }) => {
        setProduct(data);
        const defVar = data.variations?.[0] || null;
        setSelectedVar(defVar);
        const defImg =
          defVar?.image ||
          Object.values(data.image || {})[0]?.url ||
          data.thumbnail;
        setMainImg(defImg);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  /* -------------------- fetch categories map -------------------- */
  useEffect(() => {
    fetch(CATEGORIES_API)
      .then((r) => r.json())
      .then(({ data }) => {
        const map = {};
        data.forEach((c) => (map[c.id] = c.name));
        setCategories(map);
      })
      .catch(console.error);
  }, []);

  if (loading || !product)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        Loading…
      </div>
    );

  /* -------------------- derived -------------------- */
  const price =
    selectedVar?.discount_price || product.product_detail.discount_price;
  const regularPrice =
    selectedVar?.regular_price || product.product_detail.regular_price;
  const stock = selectedVar?.total_stock_qty || product.total_stock_qty;
  const catName = categories[product.category_id] || "Category";

  const ratingStars = Array.from({ length: 5 }).map((_, i) =>
    i < product.rating_avg ? (
      <Star key={i} size={16} className="fill-[#FFD700] stroke-[#FFD700]" />
    ) : (
      <StarOff key={i} size={16} className="stroke-gray-400" />
    )
  );

  /* -------------------- handlers -------------------- */
  const toggleQty = (d) => setQty((q) => Math.min(Math.max(1, q + d), stock));

  const addToCart = () => {
    // unique key distinguishes variants
    const key = `${product.id}${selectedVar ? "-" + selectedVar.id : ""}`;

    // pull latest cart from storage (so multi‑tab stays in sync)
    const stored = JSON.parse(localStorage.getItem("shopping_cart") || "[]");

    // does this item already exist?
    const exists = stored.find((it) => it.key === key);

    if (exists) {
      exists.qty += qty; // increment qty
    } else {
      stored.push({
        key,
        product: product,              // ← full product object
        variation: selectedVar ?? null, // (includes variation attrs)
        qty,
        price,                          // capture price at add‑time
        img: selectedVar?.image || product.thumbnail,
      });
    }

    // persist + sync context
    localStorage.setItem("shopping_cart", JSON.stringify(stored));
    setCart(stored);

    toast.success("Added to cart");
    // navigate("/cart"); // re‑enable if you want auto‑redirect
  };

  const setVariation = (id) => {
    const v = product.variations.find((vx) => vx.id === id);
    if (v) {
      setSelectedVar(v);
      setMainImg(v.image);
      setQty(1);
    }
  };

  /* -------------------- sub‑components -------------------- */
  const DeliveryCard = () => (
    <aside className="border rounded p-4 text-xs space-y-4 md:col-span-1 h-fit">
      {/* Delivery */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center space-x-2">
          <Truck size={14} /> <span>Delivery Options</span>
        </h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle size={14} className="text-green-600" />
            <span>Regular</span>
          </div>
          <span className="text-gray-500">2‑3 days</span>
        </div>
        <div className="flex items-center justify-between text-sm opacity-60">
          <div className="flex items-center space-x-1">
            <XCircle size={14} className="text-red-500" />
            <span>Express</span>
          </div>
          <span>Not Available</span>
        </div>
      </div>

      {/* Seller */}
      <div className="border rounded p-3 space-y-2">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <img
            src={product.brand?.media?.[0]?.full_url || product.brand?.image}
            alt="brand"
            className="w-6 h-6 rounded-full object-contain"
          />
          <span>{product.merchant.shop_name}</span>
        </div>
        <div className="flex space-x-2 text-xs">
          <button className="bg-[#00B26A] text-white px-3 py-1 rounded">
            Chat Now
          </button>
          <button className="border px-3 py-1 rounded">View Shop</button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px] mt-2">
          <div className="text-center">
            <p className="font-semibold">100%</p>
            <p>Ship on time</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">90%</p>
            <p>Chat Response</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">99.8%</p>
            <p>Shop Rating</p>
          </div>
        </div>
      </div>
    </aside>
  );

  /* -------------------- render -------------------- */
  return (
    <main className="px-4 md:px-16 py-6">
      {/* breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 space-x-1">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to={`/${product.slug}`} className="hover:underline">
          {catName}
        </Link>
        <span>/</span>
        <span className="text-black font-semibold line-clamp-1 max-w-xs inline-block align-bottom">
          {product.name}
        </span>
      </nav>

      {/* 3‑column */}
      <section className="grid md:grid-cols-[1fr_1.6fr_0.8fr] gap-8">
        {/* Gallery */}
        <div>
          <div className="border rounded flex items-center justify-center h-[360px]">
            <img
              src={mainImg}
              alt="main"
              className="max-h-full object-contain"
            />
          </div>
          <div className="flex space-x-2 mt-3 overflow-x-auto hide-scrollbar">
            {product.variations.map((v) => (
              <img
                key={v.id}
                src={v.image}
                alt="variant"
                onClick={() => setVariation(v.id)}
                className={`w-16 h-16 object-cover border cursor-pointer ${
                  v.id === selectedVar?.id ? "border-black" : ""
                }`}
              />
            ))}
            {Object.values(product.image || {}).map(({ url }, idx) => (
              <img
                key={idx}
                src={url}
                alt="thumb"
                onClick={() => setMainImg(url)}
                className="w-16 h-16 object-cover border cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h1 className="text-xl font-semibold leading-6">{product.name}</h1>
          <div className="flex items-center space-x-3 text-sm">
            {ratingStars}
            <span>({product.rating_count})</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-black">৳{price}</div>
            {parseFloat(price) < parseFloat(regularPrice) && (
              <div className="text-sm line-through text-gray-400">
                ৳{regularPrice}
              </div>
            )}
          </div>

          {/* variations loop */}
          {product.variations[0] && (
            <div className="space-y-3 mt-4 text-sm">
              {product.variations[0].variation_attributes.map(
                ({ attribute }) => (
                  <div
                    key={attribute.id}
                    className="flex items-start space-x-2"
                  >
                    <span className="font-medium w-20 capitalize">
                      {attribute.name}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((v) => {
                        const opt = v.variation_attributes.find(
                          (a) => a.attribute_id === attribute.id
                        );
                        return (
                          <button
                            key={`${v.id}-${attribute.id}`}
                            onClick={() => setVariation(v.id)}
                            className={`px-3 py-1 border rounded text-xs ${
                              v.id === selectedVar?.id
                                ? "border-black"
                                : "hover:border-black"
                            }`}
                          >
                            {opt?.attribute_option.attribute_value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* quantity */}
          <div className="flex items-center mt-4 space-x-3">
            <span className="font-medium text-sm">Quantity:</span>
            <div className="flex items-center border rounded">
              <button
                onClick={() => toggleQty(-1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <input
                value={qty}
                readOnly
                className="w-10 text-center text-sm py-1 border-x"
              />
              <button
                onClick={() => toggleQty(1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-500">(Available: {stock})</span>
          </div>

          <button
            onClick={addToCart}
            className="bg-teal-700 text-white w-full py-2 rounded hover:bg-[#0C1C2C] ease-in-out duration-200 mt-4"
          >
            Add to Cart
          </button>

          {/* simple assurance box */}
          <div className="border rounded p-4 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <ShieldCheck size={14} />
              <span>Quality Check</span>
            </div>
            <p>
              Authenticity verified by{" "}
              <span className="font-semibold">
                {product.merchant.shop_name}
              </span>
            </p>
          </div>
        </div>

        {/* Delivery / Seller */}
        <DeliveryCard />
      </section>

      {/* desc & spec */}
      <section className="grid md:grid-cols-2 gap-8 mt-10">
        {/* description */}
        <div className="border rounded overflow-hidden relative">
          <header className="bg-gray-100 px-4 py-2 font-semibold text-sm">
            Description
          </header>
          <div className="p-4 text-sm relative">
            <div
              className={`${
                expandedDesc
                  ? "max-h-full min-h-[60px]"
                  : "max-h-[120px] min-h-[60px] overflow-hidden"
              }`}
            >
              <p className="whitespace-pre-line">{product.description}</p>
              {!expandedDesc && (
                <div className="absolute bottom-4 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
          </div>
          <button
            onClick={() => setExpandedDesc(!expandedDesc)}
            className="text-black flex items-center space-x-1 text-xs mt-2 mx-auto"
          >
            {expandedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{expandedDesc ? "See Less" : "See More"}</span>
          </button>
        </div>

        {/* specification */}
        <div className="border rounded overflow-hidden relative">
          <header className="bg-gray-100 px-4 py-2 font-semibold text-sm">
            Specification
          </header>
          <div className="p-4 text-sm relative">
            <ul
              className={`${
                expandedSpec ? "max-h-full" : "h-16 overflow-hidden"
              } list-disc pl-4`}
            >
              <li>Brand: {product.brand?.name}</li>
              <li>SKU: {product.sku}</li>
              <li>Barcode: {product.barcode}</li>
              <li>Stock: {stock}</li>
            </ul>
            {!expandedSpec && (
              <div className="absolute bottom-4 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
          <button
            onClick={() => setExpandedSpec(!expandedSpec)}
            className="text-black flex items-center space-x-1 text-xs mt-2 mx-auto"
          >
            {expandedSpec ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{expandedSpec ? "See Less" : "See More"}</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
