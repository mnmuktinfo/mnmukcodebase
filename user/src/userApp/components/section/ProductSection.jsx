// components/sections/ProductSection.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../cards/ProductCard";
import TaruVedaProductCard from "../../features/taruveda/components/TaruVedaProductCard";

const ProductSection = ({
  title,
  subtitle,
  products = [],
  loading = false,
  type = "",
  themeColor = "",
  buttonClass = "bg-white text-black border border-[#da127d] hover:opacity-90",
}) => {
  const navigate = useNavigate();

  const visibleProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  if (!loading && (!products || products.length === 0)) return null;

  return (
    <section
      style={{ backgroundColor: themeColor || "#ffffff" }}
      className="max-w-[1500px] w-full py-5 md:py-10 mx-auto px-4 sm:px-6 lg:px-10">
      <div>
        {/* ── PREMIUM HEADER (Matched with VideoSection sizes) ── */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-12">
          {title && (
            <h2 className="flex items-center justify-center gap-2 text-[18px] sm:text-[20px] md:text-[26px] font-medium text-[#1a1a1a] tracking-[0.01em] leading-tight">
              {title}
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="50"
                  cy="50"
                  r="18"
                  fill="#FDE047"
                  fillOpacity="0.6"
                />
                <g stroke="#FDE047" strokeWidth="2" strokeLinecap="round">
                  <path d="M50 15v10M50 75v10M85 50H75M25 50H15M74.7 25.3l-7.1 7.1M32.4 67.6l-7.1 7.1M74.7 74.7l-7.1-7.1M32.4 32.4l-7.1-7.1" />
                </g>
              </svg>
            </h2>
          )}

          {subtitle && (
            <p className="mt-1.5 md:mt-2 text-[12px] sm:text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[420px] tracking-[0.02em]">
              {subtitle}
            </p>
          )}
        </div>

        {/* ── RESPONSIVE GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:gap-x-6 md:gap-y-14">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col w-full animate-pulse">
                  <div className="w-full aspect-[3/4] bg-gray-100/80 mb-3 md:mb-4 rounded-sm" />
                  <div className="h-2.5 md:h-3 bg-gray-200/80 w-3/4 mb-2 mx-auto rounded" />
                  <div className="h-2.5 md:h-3 bg-gray-200/80 w-1/2 mb-3 md:mb-4 mx-auto rounded" />
                  <div className="h-3 md:h-4 bg-gray-200/80 w-1/4 mx-auto rounded" />
                </div>
              ))
            : visibleProducts.map((product) => (
                <div
                  key={product.id || product.sku || product.name}
                  className="w-full transition-transform duration-300 md:hover:-translate-y-1">
                  {type === "taruveda" ? (
                    <TaruVedaProductCard product={product} />
                  ) : (
                    <ProductCard product={product} />
                  )}
                </div>
              ))}
        </div>

        {/* ── VIEW COLLECTION BUTTON ── */}
        {!loading && products.length > 3 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <button
              onClick={() => navigate("/products")}
              className={`px-6 py-2.5 md:px-8 md:py-3 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 rounded-none shadow-sm ${buttonClass}`}>
              View Collection
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
