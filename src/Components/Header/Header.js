import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../Images/Logo.png";
import { ThemeContext } from "../../Contexts/ThemeContext";
import Cart from "../Cart/Cart";
import { Search, Menu, X } from "lucide-react";
import cart from "../../Images/shopping-cart-01.png";
import user from "../../Images/User.png";
import menu from "../../Images/menu-01.png";
import track from "../../Images/track.png";
import help from "../../Images/helpline.png";
import sell from "../../Images/Sell-with-us (1).gif";
/**
 * Header – fully responsive header (mobile ⇄ desktop)
 */
const Header = ({ popCart, handlePopCart }) => {
  const { searchText, setSearchText } = useContext(ThemeContext);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    fetch("http://157.230.240.97:9999/api/v1/categories")
      .then((res) => res.json())
      .then((json) => setCategories(json?.data || []))
      .catch((err) => console.error("Category Fetch Error", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search/${searchText}`);
      setFocus(false);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="bg-[#0c1c2c] text-white w-full shadow-sm">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-4 lg:px-0 lg:w-[1280px] mx-auto py-3 space-x-4">
        {/* Left: Burger (mobile) + Logo */}
        <div className="flex items-center">
          {/* Mobile burger */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div
            className="flex gap-[4px] items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="FALCON" className="h-[24px] w-[24px]" />
            <span className="text-[24px] font-bold tracking-wide">FALCON</span>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex w-[763px] h-[48px]"
        >
          <input
            type="text"
            placeholder="Search for anything...."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            className="w-full px-4 py-2 text-black rounded-l"
          />
          <button
            type="submit"
            className="bg-[#00B795] rounded-r flex items-center justify-center w-[48px] h-[48px]"
          >
            <Search size={20} className="stroke-2" />
          </button>
        </form>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileSearchOpen((p) => !p)}
          >
            <Search size={22} />
          </button>

          {/* Cart dropdown (desktop) */}
          <div className="hidden md:block">
            <Cart />
          </div>

          {/* Mobile cart icon (simplified) */}
          <Link to="/cart" className="md:hidden relative">
            <img alt="" src={cart} />
          </Link>

          {/* User */}
          <Link to="/">
            <img alt="" src={user} />
          </Link>
        </div>
      </div>

      {/* ------------ Mobile search dropdown ------------ */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search for products…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-grow px-4 py-2 text-black rounded-l-md"
            />
            <button
              type="submit"
              className="bg-[#00B795] px-4 rounded-r-md flex items-center justify-center"
            >
              <Search size={20} className="stroke-2" />
            </button>
          </form>
        </div>
      )}

      {/* ================= SECOND ROW (Desktop only) ================= */}
      <div className="bg-white">
        <nav className="hidden md:flex items-center justify-between bg-white text-black lg:w-[1280px] mx-auto py-4">
          {/* Categories */}
          <div className="flex items-center space-x-6 overflow-x-auto hide-scrollbar">
            <button
              className="flex items-center space-x-1 text-sm font-medium min-w-max"
              onClick={() => setMenuOpen(true)}
            >
              <img alt="" src={menu} />
              <span className="text-[#0F172A] text-[16px] font-medium">
                Categories
              </span>
            </button>
            <div className="flex gap-[32px]">
              {[
                "Electronics",
                "Home Appliances",
                "Mother & Baby",
                "Automotive",
                "Sports Gear",
              ].map((cat) => (
                <Link
                  key={cat}
                  className="text-[14px] text-[#0F172A] font-normal hover:text-[#00A788] min-w-max"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Utilities */}
          <div className="flex items-center gap-[24px] text-sm font-medium">
            <Link className="flex gap-[8px]" to="/track-order">
              <img className="w-[16px] h-[16px]" alt="" src={track} />{" "}
              <span className="text-[12px] text-[#475569] font-medium">
                TRACK ORDER
              </span>{" "}
            </Link>
            <Link className="flex gap-[8px]" to="/help-center">
              <img className="w-[16px] h-[16px]" alt="" src={help} />{" "}
              <span className="text-[12px] text-[#475569] font-medium">
                HELP CENTER
              </span>{" "}
            </Link>
            <Link className="flex gap-[8px]" to="/sell-with-us">
              <img className="w-[16px] h-[16px]" alt="" src={sell} />{" "}
              <span className="text-[12px] text-[#475569] font-medium">
                SELL WITH US
              </span>{" "}
            </Link>
          </div>
        </nav>
      </div>

      {/* ================= SHARED DRAWER (Mobile + Desktop) ================= */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Categories</span>
          <button onClick={() => setMenuOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/${cat.slug}`}
              className="block text-sm font-medium text-gray-800 hover:text-[#00B795]"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          <hr className="my-3" />
          <Link to="/track-order" onClick={() => setMenuOpen(false)}>
            TRACK ORDER
          </Link>
          <Link to="/help-center" onClick={() => setMenuOpen(false)}>
            HELP CENTER
          </Link>
          <Link to="/sell-with-us" onClick={() => setMenuOpen(false)}>
            SELL WITH US
          </Link>
        </div>
      </aside>
    </header>
  );
};

export default Header;
