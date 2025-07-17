// src/Pages/Shared/Footer/Footer.js
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import logo from "../../../Images/Logo.png";
import location from "../../../Images/location.png";
import phone from "../../../Images/phone.png";
import mail from "../../../Images/mail.png";
import fb from "../../../Images/facebook.png";
import insta from "../../../Images/insta.png";
import twitter from "../../../Images/twitter.png";
import support from "../../../Images/customer-support.png";
import google from "../../../Images/Google.png";
import apple from "../../../Images/apple.png";

/* ——————————————————————————————————————————— */
/* If you prefer to self-host the SVGs, save them in /public and swap src= */
/* ——————————————————————————————————————————— */
const BKASH_SVG = "https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg";
const NAGAD_SVG = "https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg";

const Footer = () => {
  return (
    <footer className="bg-[#0C1C2C] text-white pt-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
        {/* Brand & Contact */}
        <div className="space-y-4 col-span-2 w-[272px]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img src={logo} alt="Falcon logo" className="h-[48px] w-[48px]" />
            <span className="text-[48px] font-bold">FALCON</span>
          </h2>

          <p className="text-[#F1F5F9] text-[14px] font-normal">
            Experience our new platform & Enjoy exiting deals and offers on your
            day to day
          </p>

          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-2 text-[14px]">
              <img alt="" src={location} />
              House #64, Road 13, ASA Center, Uttara – Dhaka 1402
            </li>
            <li className="flex items-center text-[14px] gap-2">
              <img alt="" src={phone} />
              01729-1497201
            </li>
            <li className="flex items-center gap-2 text-[14px]">
              <img alt="" src={mail} />
              falcon@gmail.com
            </li>
          </ul>

          <div className="flex items-center gap-4 pt-2 text-lg">
            <p className="text-[16px]">Follow us on</p>
            <a href="#fb" className="icon-btn">
              <img alt="" src={fb} />
            </a>
            <a href="#ig" className="icon-btn">
              <img alt="" src={insta} />
            </a>
            <a href="#tw" className="icon-btn">
              <img alt="" src={twitter} />
            </a>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">ABOUT</h4>
          <ul className="space-y-2 text-white">
            <li className="text-[16px]">Contact Us</li>
            <li className="text-[16px]">About Us</li>
            <li className="text-[16px]">Careers</li>
            <li className="text-[16px]">Press</li>
            <li className="text-[16px]">Cancellation & Returns</li>
            <li className="text-[16px]">Terms of Use</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">HELP</h4>
          <ul className="space-y-2 text-white">
            <li className="text-[16px]">Payments</li>
            <li className="text-[16px]">Shipping</li>
            <li className="text-[16px]">My Orders</li>
            <li className="text-[16px]">FAQs</li>
            <li className="text-[16px]">Terms of Use</li>
            <li className="text-[16px]">Security</li>
            <li className="text-[16px]">Privacy</li>
          </ul>
        </div>

        {/* Support & App */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">Need Support?</h4>
            <button className="border border-[#F1F5F9] px-4 py-1 rounded-[4px] transition flex gap-2">
              <img alt="" src={support}/> <span className="text-white">10724-7814XX</span>
            </button>
          </div>

          <div>
            <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">DOWNLOAD APP</h4>
            <div className="flex flex-col gap-2">
              <img
                src={google}
                alt="Get it on Google Play"
                className="w-[180px]"
              />
              <img
                src={apple}
                alt="Download on the App Store"
                className="w-[180px]"
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
