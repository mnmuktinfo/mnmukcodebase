import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// 1. Import your brand color from the config file (adjust path as needed)
import { BRAND_PINK } from "../../../config/AppConfig";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[80px] md:bottom-0 left-0 right-0 w-full z-[105] bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] py-4 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 font-sans animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Body text with Cookie Policy Link */}
      <p className="text-[13px] md:text-[15px] text-gray-700 leading-relaxed md:pr-8">
        We use cookies on our website to give you the most relevant experience
        by remembering your preferences and repeat visits. By continuing to use
        the website, you agree with our{" "}
        <Link
          to="/pages/cookie-policy"
          style={{ color: BRAND_PINK }}
          className="underline hover:opacity-80 transition-opacity">
          Cookie Policy
        </Link>
      </p>

      {/* Action button - Updated to use BRAND_PINK */}
      <button
        onClick={handleAccept}
        style={{ backgroundColor: BRAND_PINK }}
        className="text-white text-sm md:text-base font-medium py-2.5 px-10 transition-all hover:opacity-90 active:scale-[0.98] w-full md:w-auto shrink-0">
        OK
      </button>
    </div>
  );
};

export default CookieConsent;
