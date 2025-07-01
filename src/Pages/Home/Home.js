import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Banner from "../../Components/Banner/Banner";

// Endpoints
const PRODUCTS_API = "http://157.230.240.97:9999/api/v1/shop/products";
const CATEGORIES_API = "http://157.230.240.97:9999/api/v1/categories";

/**
 * Professional Home page – multiple sections (Categories, New Arrivals, Best Sellers, All Products)
 */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* -------------------------------------------------- */
  /* Product helpers                                    */
  /* -------------------------------------------------- */
  const fetchProducts = (url = PRODUCTS_API) => {
    setLoadingProducts(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setProducts((prev) => [...prev, ...json.data]);
        setNextUrl(json.next_page_url);
      })
      .catch((err) => console.error("Products Fetch Error", err))
      .finally(() => setLoadingProducts(false));
  };


  /* -------------------------------------------------- */
  /* Category helpers                                   */
  /* -------------------------------------------------- */
  const fetchCategories = () => {
    setLoadingCategories(true);
    fetch(CATEGORIES_API)
      .then((res) => res.json())
      .then((json) => setCategories(json.data || []))
      .catch((err) => console.error("Categories Fetch Error", err))
      .finally(() => setLoadingCategories(false));
  };

  /* -------------------------------------------------- */
  /* Lifecycle                                          */
  /* -------------------------------------------------- */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* -------------------------------------------------- */
  /* Derived slices                                      */
  /* -------------------------------------------------- */
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);

  /* -------------------------------------------------- */
  /* Render helpers                                     */
  /* -------------------------------------------------- */
  const ProductCard = ({ product, compact = false }) => (
    <Link
      to={`/product/${product.slug}`}
      className={`relative border rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition ${compact ? "w-40" : ""}`}
    >
      {product.badges?.[0] && (
        <span className="absolute top-2 left-2 bg-[#00B795] text-white text-[10px] font-semibold px-2 py-1 rounded z-10">
          {product.badges[0].name}
        </span>
      )}
      <img
        src={product.thumbnail}
        alt={product.name}
        className="w-auto mx-auto h-40 lg:h-[400px] object-cover group-hover:scale-105 transition-transform"
      />
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-black font-bold">৳{product.discount_price}</span>
          {parseFloat(product.discount_price) < parseFloat(product.regular_price) && (
            <span className="text-xs line-through text-gray-400">
              ৳{product.regular_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  const CategoryPill = ({ cat }) => (
    <Link
      to={`/${cat.slug}`}
      className="flex flex-col items-center space-y-2 min-w-[64px]"
    >
      {cat.image ? (
        <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-full border" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200" />
      )}
      <span className="text-xs text-center line-clamp-2">{cat.name}</span>
    </Link>
  );

  /* -------------------------------------------------- */
  /* JSX                                                */
  /* -------------------------------------------------- */
  return (
    <main className="px-4 md:px-16 py-8 space-y-12">
    <Banner></Banner>
      {/* ================= Categories Carousel ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Shop by Category</h2>
          <Link to="/categories" className="text-sm text-primary">View All</Link>
        </div>
        <div className="flex space-x-6 overflow-x-auto hide-scrollbar py-2">
          {loadingCategories ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse w-12 h-12 bg-gray-200 rounded-full" />
            ))
          ) : (
            categories.slice(0, 12).map((cat) => <CategoryPill key={cat.id} cat={cat} />)
          )}
        </div>
      </section>

      {/* ================= New Arrivals ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">New Arrivals</h2>
          <Link to="/newarrivals" className="text-sm text-primary">See All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {newArrivals.length ? newArrivals.map((p) => <ProductCard key={p.id} product={p} />) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-52 bg-gray-200 rounded" />
            ))
          )}
        </div>
      </section>

      {/* ================= Best Sellers ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Best Sellers</h2>
          <Link to="/bestsellers" className="text-sm text-primary">See All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bestSellers.length ? bestSellers.map((p) => <ProductCard key={p.id} product={p} />) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-52 bg-gray-200 rounded" />
            ))
          )}
        </div>
      </section>

      {/* ================= All Products ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Products</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}

          {loadingProducts &&
            Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="animate-pulse h-52 bg-gray-200 rounded" />
            ))}
        </div>

        {nextUrl && !loadingProducts && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchProducts(nextUrl)}
              className="bg-[#00B795] text-white px-6 py-2 rounded flex items-center space-x-2 hover:bg-teal-600"
            >
              <ShoppingCart size={16} />
              <span>Load More</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;