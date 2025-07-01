// src/Pages/Shared/Footer/Footer.js
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
} from "react-icons/si";
import logo from "../../../Images/Logo.png";

/* ——————————————————————————————————————————— */
/* If you prefer to self-host the SVGs, save them in /public and swap src= */
/* ——————————————————————————————————————————— */
const BKASH_SVG =
  "https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg";
const NAGAD_SVG =
  "https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg";

const Footer = () => {
  return (
    <footer className="bg-[#0C1C2C] text-white pt-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
        {/* Brand & Contact */}
        <div className="space-y-4 col-span-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img src={logo} alt="Falcon logo" className="h-6" />
            <span>FALCON</span>
          </h2>

          <p className="text-gray-400">
            Experience our new platform &amp; enjoy exciting deals and offers every
            day.
          </p>

          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="shrink-0 mt-0.5" />
              House #64, Road 13, ASA Center, Uttara – Dhaka 1402
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt />
              01729-1497201
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope />
              falcon@gmail.com
            </li>
          </ul>

          <div className="flex items-center gap-4 pt-2 text-lg">
            <a href="#fb" className="icon-btn"><FaFacebookF /></a>
            <a href="#ig" className="icon-btn"><FaInstagram /></a>
            <a href="#tw" className="icon-btn"><FaTwitter /></a>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-semibold mb-2">ABOUT</h4>
          <ul className="space-y-1 text-gray-400">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Cancellation & Returns</li>
            <li>Terms of Use</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-semibold mb-2">HELP</h4>
          <ul className="space-y-1 text-gray-400">
            <li>Payments</li>
            <li>Shipping</li>
            <li>My Orders</li>
            <li>FAQs</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>

        {/* Support & App */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Need Support?</h4>
            <button className="border border-teal-400 text-teal-400 px-4 py-1 rounded hover:bg-teal-400 hover:text-[#0C1C2C] transition">
              📞 10724-7814XX
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-2">DOWNLOAD APP</h4>
            <div className="flex flex-col gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="w-32"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments & Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-400">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-gray-700 pt-4">
          <span>Falcon ©2025. Design by xyz</span>

          <div className="flex items-center gap-3 text-white text-lg">
            <span className="text-xs text-gray-400 mr-2">
              PAYMENTS ACCEPTED
            </span>
            <SiVisa />
            <SiMastercard />
            <SiAmericanexpress />
            {/* Inline SVG logos */}
            <img src={BKASH_SVG} alt="bKash" className="h-5" />
            <img src={NAGAD_SVG} alt="Nagad" className="h-5" />
          </div>
        </div>
      </div>

      {/* Small utility for uniform hover effect */}
      <style jsx>{`
        .icon-btn:hover {
          color: #14b8a6; /* teal-400 */
        }
      `}</style>
    </footer>
  );
};

export default Footer;
