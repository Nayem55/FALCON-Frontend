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
  ArrowDownLeft,
  ArrowDown,
  ArrowBigDown,
} from "lucide-react";
import { ThemeContext } from "../../Contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { addToDb } from "../../utilities/CartDb";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./ProductDetails.css";
import down from "../../Images/down.png";
import share from "../../Images/Share.png";
import like from "../../Images/Like.png";
import variation1 from "../../Images/variation-1.png";
import variation2 from "../../Images/variation-2.png";
import variation3 from "../../Images/variation-3.png";
import variation4 from "../../Images/variation-4.png";
import package1 from "../../Images/package.png";
import packageMoving from "../../Images/package-moving.png";
import seller from "../../Images/Seller.png";
import chat from "../../Images/chat.png";
import rightArrow from "../../Images/arrow-right-01-sharp.png";

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
  const [selectedSize, setSelectedSize] = useState("XS");
  const [selectedColor, setSelectedColor] = useState("Navy Blue");

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
        size: selectedSize,
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

  /* -------------------- sub‑components -------------------- */
  const DeliveryCard = () => (
    <div className="flex flex-col gap-[16px]">
      <div className="border border-[1px] rounded-[12px] p-4 text-xs space-y-4 md:col-span-1 h-fit lg:w-[313px]">
        {/* Delivery */}
        <div className="space-y-2">
          <h3 className="font-medium text-[18px] text-[#475569] flex items-center space-x-2 mb-[12px]">
            <span>Delivery Options</span>
          </h3>
          <div className="flex flex-col justify-between text-sm">
            <div className="flex items-center space-x-2">
              <img alt="" src={package1} />
              <span className="text-[#334155] text-[16px] font-medium">
                Regular
              </span>
            </div>
            <span className="text-[#475569] text-[12px] font-normal ms-[32px]">
              Delivery within 2-3 days
            </span>
          </div>
          <div className="flex flex-col justify-between text-sm">
            <div className="flex items-center space-x-2">
              <img alt="" src={packageMoving} />
              <p className="text-[#CBD5E1] text-[16px] font-medium flex items-center">
                Express{" "}
                <span className="text-[#F87171] text-[10px] font-semibold ms-[12px]">
                  Not Available
                </span>
              </p>
            </div>
            <span className="text-[#CBD5E1] text-[12px] font-normal ms-[32px]">
              Delivery within 24 Hours.
            </span>
          </div>
        </div>
      </div>
      <div className="border rounded-[12px] p-4 text-xs md:col-span-1 h-fit lg:w-[313px] flex flex-col gap-[16px]">
        {/* Seller */}
        <p className="text-[#475569] text-[12px font-regular]">Sold by</p>
        <div className="space-y-2">
          <div className="w-[211px]">
            <img src={seller} alt="brand" className="object-contain" />
            {/* <span>{product.merchant.shop_name}</span> */}
          </div>
          <div className="flex text-xs mt-4 gap-[12px] border-b-[1px] pb-[12px] w-[282px] mx-auto">
            <button className="bg-[#E6F8F4] text-[#00A788] font-medium text-[14px] rounded-[4px] w-[135px] h-[28px] flex items-center justify-center gap-[8px]">
              <img alt="" src={chat} /> <span>Chat Now</span>
            </button>
            <button className="bg-[#F1F5F9] text-[#475569] font-medium text-[14px] rounded-[4px] w-[135px] h-[28px]">
              View Shop
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 w-[282px]">
            <div className="mt-2 flex flex-col gap-[12px]">
              <p className="text-[12px] text-[#475569] font-medium">
                Ship on time
              </p>
              <p className="font-normal text-[28px] text-[#64748B]">100%</p>
            </div>
            <div className="mt-2 flex flex-col gap-[12px]">
              <p className="text-[12px] text-[#475569] font-medium">
                Chat Response
              </p>
              <p className="font-normal text-[28px] text-[#64748B]">90%</p>
            </div>
            <div className="mt-2 flex flex-col gap-[12px]">
              <p className="text-[12px] text-[#475569] font-medium">
                Shop Rating
              </p>
              <p className="font-normal text-[28px] text-[#64748B]">99.8%</p>
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
      <nav className="text-[14px] font-normal  px-4 lg:px-0 py-4 mb-4 lg:mb-0 flex gap-[4px] bg-[#F1F5F9] lg:w-[1280px] mx-auto">
        <Link to="/" className="text-[#0F172A] text-[14px] font-normal">
          Home
        </Link>
        <img alt="" src={rightArrow}/>
        <Link to={`/${product.slug}`} className="text-[#475569] text-[14px] font-normal">
          {catName}
        </Link>
      </nav>

      {/* 3‑column */}
      <section className="lg:w-[1440px] mx-auto bg-white lg:py-[24px] lg:px-[80px]">
        <div className="lg:w-[1280px] mx-auto flex flex-col sm:flex-row gap-[32px]">
          {/* Gallery */}
          <div>
            <div className="border rounded-[5px] flex items-center justify-center lg:w-[380px] lg:h-[380px] overflow-hidden">
              <img
                src={mainImg}
                alt="main"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="flex lg:w-[372px] h-[68px] gap-[8px] mt-[16px] overflow-x-auto overflow-y-hidden scrollbar-custom">
              {product.variations.map((v) => (
                <img
                  key={v.id}
                  src={v.image}
                  alt="variant"
                  onClick={() => setVariation(v.id)}
                  className={`w-[68px] h-[68px] object-cover border cursor-pointer rounded-[5px] ${
                    v.id === selectedVar?.id ? "border-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-[8px] sm:w-[507px]">
            <h1 className="font-medium text-[20px] leading-[28px] tracking-normal font-onest text-[#0F172A]">
              {product.name}
            </h1>

            <div className="flex justify-between sm:w-[507px]">
              <div className="flex items-center space-x-2 text-sm gap-[10px]">
                <span className="text-[#475569] text-[16px] font-normal">
                  4.7
                </span>
                <div className="flex gap-[4px]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < 4
                          ? "fill-[#EAB308] text-[#EAB308]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#475569] text-[16px] font-normal">
                  2,254
                </span>
                <span className="text-[#475569] text-[16px]">
                  <img alt="" src={down} />
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-[#475569] text-[16px] cursor-pointer">
                  <img alt="" src={like} />
                </span>
                <span className="text-[#475569] text-[16px] cursor-pointer">
                  <img alt="" src={share} />
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-[24px] font-semibold text-[#00A788]">
                ৳
                {parseFloat(price).toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              {parseFloat(price) < parseFloat(regularPrice) && (
                <div className="text-[16px] line-through text-[#94A3B8] font-normal">
                  ৳
                  {parseFloat(regularPrice).toLocaleString("en-BD", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-[227px] h-[25px] mt-4">
              <span className="font-medium text-[14px] text-[#475569]">
                Promotion
              </span>
              <div className="relative w-[154px] h-[25px] text-white text-[14px] font-bold leading-[24px]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF8810] to-[#D23707] pr-[16px] pl-[10px] flex items-center text-white font-medium">
                  <span>Min. spend ৳550</span>
                  {/* Small downward arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[14px] h-[14px] ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <div className="absolute right-[-1px] top-0 h-full w-[12px] bg-white clip-triangle-inset" />
              </div>
            </div>

            {/* Available Color - Updated with color options */}
            <div className="mt-4">
              <p className="text-[16px] ffont-medium mb-2">
                <span className="text-[#475569]">Available Color:</span>{" "}
                {selectedColor}
              </p>
              <div className="flex gap-[8px]">
                {[
                  { name: "Navy Blue", img: variation1 },
                  { name: "Black", img: variation2 },
                  { name: "White", img: variation3 },
                  { name: "Red", img: variation4 },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    <img
                      src={color.img}
                      alt={color.name}
                      className={`w-[56px] h-[56px] object-cover rounded-[4px] mb-1 border rounded ${
                        color.name === selectedColor
                          ? "border-[#00A788] bg-gray-100"
                          : "border-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Select Size */}
            <div className="mt-2">
              <p className="text-[16px] ffont-medium mb-2">
                <span className="text-[#475569]">Select Size:</span>{" "}
                {selectedSize}
              </p>
              <div className="flex gap-[12px]">
                {["XL", "XS", "S", "M", "L"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-[40px] h-[40px] border rounded-[4px] text-xs ${
                      size === selectedSize
                        ? "border-[#00A788] bg-gray-100"
                        : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-4 lg:w-[195px] h-[72px]">
              <p className="text-[16px] font-medium">Quantity</p>
              <div className="flex items-center justify-between border rounded-full p-1 w-24 mt-[8px] w-[195px] h-[40px]">
                <button
                  onClick={() => toggleQty(-1)}
                  className="w-[33px] h-[33px] flex items-center justify-center border-x rounded-full text-[#64748B] bg-[#F1F5F9] text-[24px] font-medium hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  value={String(qty).padStart(2, "0")}
                  readOnly
                  className="w-10 text-center text-[16px] font-medium py-1"
                />

                <button
                  onClick={() => toggleQty(1)}
                  className="w-[33px] h-[33px] flex items-center justify-center border-x rounded-full text-[#64748B] bg-[#F1F5F9] text-[24px] font-medium hover:bg-gray-100"
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
        </div>
      </section>

      {/* desc & spec*/}
      <section className="flex flex-col gap-8 py-10 lg:w-[1280px] mx-auto">
        {/* description */}
        <div className="bg-white rounded-[4px] sm:py-4 sm:px-2 overflow-hidden relative min-h-[230px] lg:min-h-[339px] lg:w-[955px]">
          <header className="px-4 py-2 font-medium text-[24px]">
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
              <div
                className="whitespace-pre-line text-[16px] text-[#475569] font-normal"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              {!expandedDesc && (
                <div className="absolute bottom-4 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
          </div>
          <button
            onClick={() => setExpandedDesc(!expandedDesc)}
            className="text-black absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 text-xs"
          >
            <span className="text-[#0F172A] text-[16px] font-medium">{expandedDesc ? "See Less" : "See More"}</span>
            {expandedDesc ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>

        {/* specification */}
        <div className="bg-white rounded-[4px] sm:py-4 sm:px-2 overflow-hidden relative min-h-[230px] lg:min-h-[339px] lg:w-[955px]">
          <header className="px-4 py-2 font-medium text-[24px]">
            Specification
          </header>
          <div className="p-4 relative text-[16px] text-[#475569] font-normal">
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
            <span className="text-[#0F172A] text-[16px] font-medium">{expandedSpec ? "See Less" : "See More"}</span>
            {expandedSpec ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
