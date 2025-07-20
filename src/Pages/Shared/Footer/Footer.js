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
import payment from "../../../Images/payment.png";

const Footer = () => {
  return (
    <footer className="bg-[#0C1C2C] text-white pt-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-8 pb-8">
        {/* Brand & Contact */}
        <div className="space-y-4 col-span-2 w-[272px]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img src={logo} alt="Falcon logo" className="h-[32px] lg:h-[48px] w-[32px] lg:w-[48px]" />
            <span className="text-[32px] lg:text-[48px] font-bold">FALCON</span>
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
          <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">
            ABOUT
          </h4>
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
          <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">
            HELP
          </h4>
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
            <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">
              Need Support?
            </h4>
            <button className="border border-[#F1F5F9] px-4 py-1 rounded-[4px] transition flex gap-2">
              <img alt="" src={support} />{" "}
              <span className="text-white">10724-7814XX</span>
            </button>
          </div>

          <div>
            <h4 className="font-medium text-[#94A3B8] text-[18px] mb-[12px]">
              DOWNLOAD APP
            </h4>
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

      <div className="flex gap-4 justify-end items-center max-w-[1200px] mx-auto lg:mt-[-80px]">
        <p className="text-[#94A3B8] text-[18px] font-medium">
          PAYMENTS ACCEPTED
        </p>
        <img alt="" src={payment} />
      </div>

      {/* Payments & Bottom bar */}
      <div className="py-6 border-t border-[#94A3B8]">
        <div className="text-white text-[14px] font-normal text-center">
          <span>Falcon ©2025. Design by xyz</span>
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
