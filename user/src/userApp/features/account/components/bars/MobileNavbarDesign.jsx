import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import PromotionalNavbar from "./PromotionalNavbar";
import NavbarDropdown from "../dropdown/NavbarDropdwown";
import LoginPopup from "../../../../components/pop-up/LoginPoup";

import { categoryMenuItems } from "../../data/categoryMenuItems";
import { accountMenuData } from "../../data/accountMenuData";
import { IMAGES } from "../../../../../assets/images";

import { GoldUserIcon } from "./Icons";
import { useAuth } from "../../../auth/context/UserContext";

const ICON_SIZE = 18;

const MobileNavbar = ({ cartCount = 0, promoData, onCartClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAccountPage = location.pathname.startsWith("/user");
  const activeMenuItems = isAccountPage ? accountMenuData : categoryMenuItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleProtectedRoute = (path) => {
    if (user) navigate(path);
    else setLoginOpen(true);
  };

  // Theming: Matched to Desktop (Black default, Pink on hover)
  const iconBase =
    "transition-colors duration-300 hover:text-[#e91e8b] text-gray-800";

  const iconWrapper = "relative p-1 flex items-center justify-center";

  const badge =
    "absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-[4px] rounded-full bg-black text-white text-[9px] font-semibold flex items-center justify-center shadow-sm";

  return (
    <>
      <header
        className={`md:hidden fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}>
        {/* PROMO BAR (Black to Pink Gradient) */}
        {promoData?.length > 0 && (
          <div
            className={`overflow-hidden bg-gradient-to-r from-[#000000] via-[#e91e8b] to-[#da127d] text-white font-medium transition-all duration-500 ${
              scrolled ? "max-h-0 opacity-0" : "max-h-[38px] opacity-100"
            }`}>
            <PromotionalNavbar items={promoData} interval={4000} />
          </div>
        )}

        {/* NAVBAR */}
        <div className="flex items-center justify-between h-[62px] px-4">
          {/* 1. LEFT: MENU */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1 -ml-1 flex flex-col justify-center gap-[5px] active:scale-95 transition-transform"
              aria-label="Open Menu">
              <span className="h-[2px] w-5 bg-black rounded-full" />
              <span className="h-[2px] w-5 bg-black rounded-full" />
              <span className="h-[2px] w-5 bg-black rounded-full" />
            </button>
          </div>

          {/* 2. CENTER: LOGO */}
          <div className="flex-1 flex items-center justify-center">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer active:scale-95 transition-transform">
              <img
                src={IMAGES.brand.logo}
                alt="logo"
                className="h-6 object-contain"
              />
            </div>
          </div>

          {/* 3. RIGHT: ICONS */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
            {/* USER (Original GoldUserIcon) */}
            <button
              onClick={() => handleProtectedRoute("/user/profile")}
              className={`${iconWrapper} ${iconBase}`}
              aria-label="User Profile">
              <GoldUserIcon className="w-[18px] h-[18px]" />
            </button>
            {/* SEARCH
            <button
              onClick={() => navigate("/search")}
              className={`${iconWrapper} ${iconBase}`}
              aria-label="Search">
              <svg
                width={ICON_SIZE}
                height={ICON_SIZE}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button> */}
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
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
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

      {/* MODALS & DROPDOWNS */}
      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <NavbarDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={activeMenuItems}
      />
    </>
  );
};

export default MobileNavbar;
