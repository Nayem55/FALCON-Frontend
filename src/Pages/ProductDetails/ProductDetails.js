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
  const [selectedSize, setSelectedSize] = useState('XS');
  const [selectedColor, setSelectedColor] = useState('Navy Blue');

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
    const key = `${product.id}${selectedVar ? "-" + selectedVar.id : ""}`;
    const stored = JSON.parse(localStorage.getItem("shopping_cart") || "[]");
    const exists = stored.find((it) => it.key === key);

    if (exists) {
      exists.qty += qty;
    } else {
      stored.push({
        key,
        product: product,
        variation: selectedVar ?? null,
        qty,
        price,
        img: selectedVar?.image || product.thumbnail,
        color: selectedColor,
        size: selectedSize
      });
    }

    localStorage.setItem("shopping_cart", JSON.stringify(stored));
    setCart(stored);
    toast.success("Added to cart");
  };

  const setVariation = (id) => {
    const v = product.variations.find((vx) => vx.id === id);
    if (v) {
      setSelectedVar(v);
      setMainImg(v.image);
      setQty(1);
    }
  };

  console.log(product)

  /* -------------------- sub‑components -------------------- */
  const DeliveryCard = () => (
   <div className="flex flex-col gap-4">
        <div className="border rounded p-4 text-xs space-y-4 md:col-span-1 h-fit lg:w-[313px]">
      {/* Delivery */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center space-x-2">
          <Truck size={14} /> <span>Delivery Options</span>
        </h3>
        <div className="flex flex-col justify-between text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle size={14} className="text-green-600" />
            <span>Regular</span>
          </div>
          <span className="text-gray-500 ms-4">Delivery within &lt;3 days</span>
        </div>
        <div className="flex flex-col justify-between text-sm opacity-60">
          <div className="flex items-center space-x-1">
            <XCircle size={14} className="text-red-500" />
            <span>Express</span>
          </div>
          <span className="ms-4">Maximum Delivery within 30 hours</span>
        </div>
      </div>
    </div>
    <div className="border rounded p-4 text-xs space-y-4 md:col-span-1 h-fit lg:w-[313px]">
      {/* Seller */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <img
            src={product.brand?.media?.[0]?.full_url || product.brand?.image}
            alt="brand"
            className="w-6 h-6 rounded-full object-contain"
          />
          <span>{product.merchant.shop_name}</span>
        </div>
        <div className="flex justify-between space-x-2 text-xs">
          <button className="bg-[#E6F8F4] text-[#00A788] px-3 py-2 rounded w-[135px] h-[28px]">
            Chat Now
          </button>
          <button className="border px-3 py-2 rounded w-[135px] h-[28px]">View Shop</button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center mt-2">
            <p>Ship on time</p>
            <p className="font-semibold text-xl">100%</p>
          </div>
          <div className="text-center mt-2">
            <p>Chat Response</p>
            <p className="font-semibold text-xl">90%</p>
          </div>
          <div className="text-center mt-2">
            <p>Shop Rating</p>
            <p className="font-semibold text-xl">99.8%</p>
          </div>
        </div>
      </div>
    </div>
   </div>
  );

  /* -------------------- render -------------------- */
  return (
    <main className="p-4 lg:p-0 lg:bg-[#F1F5F9]">
      {/* breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 space-x-1 bg-[#F1F5F9] p-4 lg:w-[1280px] mx-auto">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to={`/${product.slug}`} className="hover:underline">
          {catName}
        </Link>

      </nav>

      {/* 3‑column */}
      <section className="bg-white grid md:grid-cols-[1fr_1.6fr_0.8fr] gap-6 md:px-16 py-6 lg:w-[1280px] lg:h-[553px] mx-auto">
        {/* Gallery */}
        <div>
          <div className="border rounded flex items-center justify-center lg:w-[380px]">
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
       {/* Rating - Updated to match Figma exactly */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-black">4.7</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${i < 4 ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-gray-600">2,254</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-black">৳{price}</div>
            {parseFloat(price) < parseFloat(regularPrice) && (
              <div className="text-sm line-through text-gray-400">
                ৳{regularPrice}
              </div>
            )}
          </div>

        {/* Promotion - Exact match to Figma */}
          <div className="flex items-center">
              <span className="font-semibold mr-2">Promotion</span>
              <span className="bg-gradient-to-r from-[#FF8810] to-[#DA4A09] text-white px-3 py-2 text-sm">Min. spend ৳550</span>
          </div>

          {/* Available Color - Updated with color options */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Available Color: {selectedColor}</p>
            <div className="flex gap-2">
              {['Navy Blue', 'Black', 'White', 'Red'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 border rounded text-xs ${
                    color === selectedColor ? 'border-black bg-gray-100' : 'border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Select Size */}
          <div className="mt-2">
            <p className="text-sm font-medium">Select Size: {selectedSize}</p>
            <div className="flex gap-2 mt-1">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded text-xs ${
                    size === selectedSize ? 'border-black bg-gray-100' : 'border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4 lg:w-[195px] h-[72px]">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center border rounded w-24 mt-1">
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
          </div>

          <button
            onClick={addToCart}
            className="bg-[#00A788] text-white w-full py-2 rounded hover:bg-[#0C1C2C] ease-in-out duration-200 mt-4 lg:w-[412px] lg:h-[48px]"
          >
            Add to Cart
          </button>
        </div>

        {/* Delivery / Seller */}
        <DeliveryCard />
      </section>

      {/* desc & spec*/}
      <section className="flex flex-col gap-8 py-10 lg:w-[1280px] mx-auto">
        {/* description */}
        <div className="bg-white border rounded overflow-hidden relative h-[230px] lg:h-[339px] lg:w-[955px]">
          <header className="bg-[#E6F8F4] px-4 py-2 font-semibold text-sm">
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
        className="text-black absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 text-xs"
>     
        {expandedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span>{expandedDesc ? "See Less" : "See More"}</span>
        </button>
        </div>

        {/* specification */}
        <div className="bg-white border rounded overflow-hidden relative h-[230px] lg:h-[339px] lg:w-[955px]">
          <header className="bg-[#E6F8F4] px-4 py-2 font-semibold text-sm">
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
            className="text-black absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 text-xs"
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