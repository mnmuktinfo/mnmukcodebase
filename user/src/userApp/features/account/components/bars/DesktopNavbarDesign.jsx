import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import PromotionalNavbar from "./PromotionalNavbar";
import NavbarDropdown from "../dropdown/NavbarDropdwown";
import LoginPopup from "../../../../components/pop-up/LoginPoup";
import { IMAGES } from "../../../../../assets/images";
import { useAuth } from "../../../auth/context/UserContext";
import { GoldUserIcon } from "./Icons";

const ICON_SIZE = 18;

const DesktopNavbar = ({
  app_name = "Mnmukt",
  cartCount = 0,
  wishlistCount = 0,
  categoryMenuItems = [],
  promoData,
  onCartClick,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setIsScrolled(y > 15);

      if (y > lastScrollY.current && y > 50) setShowPromo(false);
      else setShowPromo(true);

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProtectedRoute = (path) => {
    if (user) navigate(path);
    else setLoginOpen(true);
  };

  const iconBase =
    "transition-colors duration-300 hover:text-[#e91e8b] text-gray-800";

  const iconWrapper = "relative p-1 flex items-center justify-center";

  const badge =
    "absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-[4px] rounded-full bg-black text-white text-[9px] font-semibold flex items-center justify-center";

  return (
    <>
      {/* PROMO BAR */}
      <div
        className={`bg-gradient-to-r from-[#000000] via-[#e91e8b] to-[#da127d] text-white text-[12px] overflow-hidden transition-all duration-500 ${
          showPromo ? "max-h-[40px]" : "max-h-0"
        }`}>
        <PromotionalNavbar items={promoData} interval={4000} />
      </div>

      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}>
        <div className="max-w-[1600px] mx-auto px-5 h-[64px] flex items-center justify-between">
          {/* 1. LEFT: MENU & SHIP TO */}
          <div className="flex-1 flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-3 p-1 transition-all"
              aria-label="Toggle Menu">
              <div className="w-[18px] flex flex-col gap-[4px]">
                <span className="h-[1.5px] w-full bg-gray-900 group-hover:bg-[#e91e8b] transition-colors" />
                <span className="h-[1.5px] w-full bg-gray-900 group-hover:bg-[#e91e8b] transition-colors" />
                <span className="h-[1.5px] w-full bg-gray-900 group-hover:bg-[#e91e8b] transition-colors" />
              </div>
              <span className="text-[13px] font-medium tracking-widest text-gray-900 group-hover:text-[#e91e8b] transition-colors">
                MENU
              </span>
            </button>
          </div>

          {/* 2. CENTER: LOGO */}
          <div className="flex-1 flex items-center justify-center">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer flex items-center justify-center">
              <img
                src={IMAGES.brand.logo}
                className="h-10 object-contain"
                alt="logo"
              />
            </div>
          </div>

          {/* 3. RIGHT: ICONS & UTILITIES */}
          <div className="flex-1 flex items-center justify-end gap-5">
            {/* CONTACT US (Standard Icon to replace Chip) */}
            <button
              onClick={() => navigate("/pages/contact-us")}
              className="hidden md:block text-[13px] font-medium tracking-widest text-gray-900 hover:text-[#e91e8b] transition-colors">
              CONTACT US
            </button>

            {/* USER PROFILE */}
            <button
              onClick={() => handleProtectedRoute("/user/profile")}
              className={`${iconWrapper} ${iconBase}`}
              aria-label="User Profile">
              <GoldUserIcon className="w-[18px] h-[18px]" />
            </button>

            {/* WISHLIST */}
            <button
              onClick={() => navigate("/wishlist")}
              className={`${iconWrapper} ${iconBase}`}
              aria-label="Wishlist">
              <svg
                width={ICON_SIZE}
                height={ICON_SIZE}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5">
                <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6.5-8 11-8 11z" />
              </svg>
              {wishlistCount > 0 && (
                <span className={badge}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>

            {/* CART */}
            <button
              onClick={onCartClick}
              className={`${iconWrapper} ${iconBase}`}
              aria-label="Shopping Cart">
              <svg
                width={ICON_SIZE}
                height={ICON_SIZE}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6l-2-3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {cartCount > 0 && (
                <span className={badge}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MODALS */}
      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <NavbarDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={categoryMenuItems}
      />
    </>
  );
};

export default DesktopNavbar;
