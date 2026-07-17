import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { UPIIcon } from "../../features/account/components/bars/Icons";

const THEME_PINK = "#da127d";

// Size chart data
const SIZE_CHART_DATA = {
  in: [
    { size: "XS", bust: '34"', shoulder: '13.5"', waist: '38"' },
    { size: "S", bust: '36"', shoulder: '14"', waist: '39"' },
    { size: "M", bust: '38"', shoulder: '14.5"', waist: '40"' },
    { size: "L", bust: '40"', shoulder: '15"', waist: '41"' },
    { size: "XL", bust: '42"', shoulder: '15.5"', waist: '42"' },
    { size: "XXL", bust: '44"', shoulder: '16"', waist: '43"' },
    { size: "3XL", bust: '46"', shoulder: '16.5"', waist: '44"' },
  ],
  cm: [
    { size: "XS", bust: "86", shoulder: "34", waist: "96" },
    { size: "S", bust: "91", shoulder: "35", waist: "99" },
    { size: "M", bust: "96", shoulder: "36", waist: "101" },
    { size: "L", bust: "101", shoulder: "38", waist: "104" },
    { size: "XL", bust: "106", shoulder: "39", waist: "106" },
    { size: "XXL", bust: "111", shoulder: "40", waist: "109" },
    { size: "3XL", bust: "116", shoulder: "42", waist: "112" },
  ],
};

const MAX_QUANTITY = 999;
const MIN_QUANTITY = 1;

/* =========================================================
   STAR RATING COMPONENT
========================================================= */
const StarRating = ({ rating = 5, reviews = 0 }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarSolidIcon
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating) ? "text-[#da127d]" : "text-gray-200"
          }`}
        />
      ))}
    </div>
    {reviews > 0 && <span className="text-sm text-gray-500">({reviews})</span>}
  </div>
);

/* =========================================================
   SIZE CHART MODAL (Sharp Edges)
========================================================= */
const SizeChartModal = ({ isOpen, onClose, chartUnit, onChartUnitChange }) => {
  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-200 max-h-[85dvh] flex flex-col rounded-none">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shrink-0">
          <h3
            id="size-chart-title"
            className="font-medium text-lg text-gray-900">
            Size Chart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Close size chart">
            <XMarkIcon className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="p-5 pb-2 shrink-0">
          <div className="flex border border-gray-200 w-fit rounded-none overflow-hidden">
            {["in", "cm"].map((unit) => (
              <button
                key={unit}
                onClick={() => onChartUnitChange(unit)}
                className={`px-6 py-2 text-sm font-medium transition-colors rounded-none ${
                  chartUnit === unit
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={chartUnit === unit}>
                {unit === "in" ? "Inches" : "Cms"}
              </button>
            ))}
          </div>
        </div>

        {/* Table - Scrollable */}
        <div className="px-5 pb-5 overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-900">
                <th className="py-3 font-medium">Size</th>
                <th className="py-3 font-medium">Bust</th>
                <th className="py-3 font-medium">Shoulder</th>
                <th className="py-3 font-medium">Waist</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART_DATA[chartUnit].map((item) => (
                <tr
                  key={item.size}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">
                    {item.size}
                  </td>
                  <td className="py-3 text-gray-600">{item.bust}</td>
                  <td className="py-3 text-gray-600">{item.shoulder}</td>
                  <td className="py-3 text-gray-600">{item.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* =========================================================
   Helper 
========================================================= */
const isLightColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return false;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
};

/* =========================================================
   QUICK SHOP MODAL
========================================================= */
const QuickShopModal = React.memo(
  ({
    product,
    image,
    formatPrice,
    onClose,
    onAddToCart,
    onBuyNow,
    onViewDetails,
    isLiked,
    onToggleWishlist,
    cartSyncing,
  }) => {
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [chartUnit, setChartUnit] = useState("in");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onClose]);

    const isValidProduct = useMemo(
      () => product && product.name && product.price !== undefined,
      [product],
    );

    const hasSizes = product?.hasSizes ?? product?.sizes?.length > 0;
    const hasColors = product?.hasColors ?? product?.colors?.length > 0;

    const availableSizes = useMemo(
      () => (hasSizes ? product.sizes : []),
      [hasSizes, product?.sizes],
    );
    const availableColors = useMemo(
      () => (hasColors ? product.colors : []),
      [hasColors, product?.colors],
    );

    useEffect(() => {
      if (hasSizes && availableSizes.length === 1 && !selectedSize) {
        setSelectedSize(availableSizes[0]);
      }
      if (hasColors && availableColors.length === 1 && !selectedColor) {
        setSelectedColor(availableColors[0]);
      }
    }, [hasSizes, hasColors, availableSizes, availableColors]);

    const handleQuantityChange = useCallback(
      (newQuantity) => {
        if (hasSizes && !selectedSize) {
          window.alert("Please select a size first.");
          return;
        }
        if (hasColors && !selectedColor) {
          window.alert("Please select a color first.");
          return;
        }

        if (newQuantity < MIN_QUANTITY) return;
        if (newQuantity > MAX_QUANTITY) return;

        setQuantity(newQuantity);
      },
      [selectedSize, selectedColor, hasSizes, hasColors],
    );

    const handleAction = useCallback(
      async (action) => {
        if (hasSizes && !selectedSize && hasColors && !selectedColor) {
          window.alert("Please select a size and color before proceeding.");
          return;
        } else if (hasSizes && !selectedSize) {
          window.alert("Please select a size before proceeding.");
          return;
        } else if (hasColors && !selectedColor) {
          window.alert("Please select a color before proceeding.");
          return;
        }

        if (isProcessing || cartSyncing) return;

        try {
          setIsProcessing(true);
          await action({
            selectedSize: hasSizes ? selectedSize : null,
            size: hasSizes ? selectedSize : null,
            selectedColor: hasColors ? selectedColor : null,
            color: hasColors ? selectedColor : null,
            quantity,
          });
        } catch (err) {
          console.error("Action error:", err);
        } finally {
          setIsProcessing(false);
        }
      },
      [
        selectedSize,
        selectedColor,
        quantity,
        cartSyncing,
        isProcessing,
        hasSizes,
        hasColors,
      ],
    );

    if (!isValidProduct || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <>
        <div
          className="fixed inset-0 z-[500] flex items-end md:items-center justify-center bg-black/50 p-0 md:p-6 animate-in fade-in duration-200"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title">
          <div
            className="relative w-full h-[95dvh] md:h-auto md:max-h-[85dvh] md:max-w-[950px] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200 rounded-none"
            onClick={(e) => e.stopPropagation()}>
            {/* Desktop Close Button - Sharp Edges */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-0 right-0 z-50 w-12 h-12 items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors bg-white rounded-none border-b border-l border-transparent hover:border-gray-200"
              aria-label="Close modal">
              <XMarkIcon className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Mobile Close Button - Sharp Edges */}
            <button
              onClick={onClose}
              className="md:hidden absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center text-gray-600 bg-white/90 backdrop-blur-md shadow-sm rounded-none border border-gray-200"
              aria-label="Close modal">
              <XMarkIcon className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* ================= LEFT: IMAGE ================= */}
            <div className="relative w-full md:w-1/2 h-[50dvh] md:h-auto bg-gray-50 shrink-0 p-4 md:p-6 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[600px] rounded-none overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover animate-in fade-in duration-500"
                  loading="lazy"
                />

                {/* Heart Icon (Top Right of Image) */}
                <button
                  onClick={onToggleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 z-10 rounded-none border border-gray-200"
                  aria-label={
                    isLiked ? "Remove from wishlist" : "Add to wishlist"
                  }>
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-[#da127d]" />
                  ) : (
                    <HeartIcon
                      className="w-5 h-5 text-gray-900 hover:text-[#da127d] transition-colors"
                      strokeWidth={1.5}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* ================= RIGHT: DETAILS ================= */}
            <div className="flex flex-col flex-1 w-full md:w-1/2 min-h-0 bg-white relative">
              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 md:px-10 pt-6 md:pt-10 pb-36 md:pb-10 custom-scrollbar">
                {/* Header Title & Share */}
                <div className="flex items-start justify-between gap-4 mb-3 md:pr-6">
                  <h2
                    id="modal-title"
                    className="text-xl md:text-2xl font-medium text-gray-900 leading-tight">
                    {product.name}
                  </h2>
                  <button
                    onClick={async () => {
                      try {
                        // Construct the precise product URL using the origin and product slug/id
                        const productUrl = `${window.location.origin}/product/${product.slug || product.id}`;

                        if (navigator.share) {
                          await navigator.share({
                            title: product.name,
                            url: productUrl,
                          });
                        } else {
                          await navigator.clipboard.writeText(productUrl);
                          window.alert("Link copied to clipboard!");
                        }
                      } catch (err) {
                        console.error("Error sharing:", err);
                      }
                    }}
                    className="text-gray-400 hover:text-black transition-colors mt-1"
                    aria-label="Share">
                    <ShareIcon className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Fake Sold Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium border border-green-200 rounded-none uppercase tracking-wide">
                    <span className="text-[10px]">🛒</span> 100+ Sold
                  </span>
                </div>

                {/* Star Rating */}
                {(product.rating !== undefined || product.reviews) && (
                  <div className="mb-4">
                    <StarRating
                      rating={product.rating || 5}
                      reviews={product.reviews || 0}
                    />
                  </div>
                )}

                {/* Price section */}
                <div className="mb-6">
                  <div className="flex items-end gap-3">
                    <p className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
                      Rs. {formatPrice(product.price)}
                    </p>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through mb-1">
                          Rs. {formatPrice(product.originalPrice)}
                        </p>
                      )}
                  </div>
                  <p className="text-[13px] text-gray-500 mt-1">
                    Inclusive Of All Taxes
                  </p>
                </div>

                {/* Color Selector */}
                {hasColors && (
                  <div className="mb-6">
                    <label className="block text-sm text-gray-700 mb-2">
                      Color:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedColor?.name || ""}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => {
                        const active = selectedColor?.name === color.name;
                        const light = isLightColor(color.hex);
                        return (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            title={color.name}
                            className={`relative w-10 h-10 rounded-none flex items-center justify-center transition-all ${
                              active
                                ? "ring-2 ring-offset-2 ring-black"
                                : "border border-gray-300 hover:border-gray-500"
                            }`}
                            style={{ backgroundColor: color.hex || "#e5e7eb" }}>
                            {active && (
                              <CheckIcon
                                className={`w-5 h-5 ${light ? "text-black" : "text-white"}`}
                                strokeWidth={2}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {hasSizes && (
                  <div className="mb-6">
                    <label className="block text-sm text-gray-700 mb-2">
                      Size:{" "}
                      {selectedSize ? (
                        <span className="font-medium text-gray-900">
                          {selectedSize}
                        </span>
                      ) : (
                        ""
                      )}
                    </label>

                    <div className="flex flex-wrap gap-3 mb-3">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-10 px-4 text-sm transition-colors rounded-none ${
                            selectedSize === size
                              ? "border border-black text-white bg-black font-medium"
                              : "border border-gray-300 text-gray-700 hover:border-black bg-white"
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Size Chart Links */}
                    <div className="flex items-center gap-5 text-xs font-medium mt-4">
                      <button
                        onClick={() => setShowSizeChart(true)}
                        className="flex items-center gap-2 text-gray-700 hover:text-black uppercase tracking-wide transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            strokeWidth="1.5"
                            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path>
                        </svg>
                        Size Chart
                      </button>
                      <button className="flex items-center gap-2 text-[#da127d] hover:text-pink-700 uppercase tracking-wide transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            strokeWidth="1.5"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        Find Your Size
                      </button>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-8">
                  <div className="inline-flex items-center h-12 border border-gray-300 rounded-none bg-white">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          Math.max(MIN_QUANTITY, quantity - 1),
                        )
                      }
                      disabled={quantity <= MIN_QUANTITY}
                      className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-30 rounded-none">
                      <MinusIcon className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <span className="w-12 text-center font-medium text-sm text-gray-900 border-x border-gray-300 h-full flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          Math.min(MAX_QUANTITY, quantity + 1),
                        )
                      }
                      disabled={quantity >= MAX_QUANTITY}
                      className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-30 rounded-none">
                      <PlusIcon className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons (Desktop inline) */}
                <div className="hidden md:flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={() => handleAction(onAddToCart)}
                    disabled={cartSyncing || isProcessing}
                    className="flex-1 h-12 bg-white border border-[#da127d] text-[#da127d] text-sm font-medium hover:bg-[#da127d] hover:text-white transition-colors rounded-none disabled:opacity-70 tracking-wide">
                    {cartSyncing || isProcessing ? "ADDING..." : "ADD TO CART"}
                  </button>
                  <button
                    onClick={() => handleAction(onBuyNow)}
                    disabled={cartSyncing || isProcessing}
                    className="flex-1 h-12 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-none disabled:opacity-70 tracking-wide border border-black">
                    {cartSyncing || isProcessing ? "PROCESSING..." : "BUY NOW"}
                  </button>
                </div>

                {/* View Details Link */}
                <button
                  onClick={() => {
                    onViewDetails?.();
                    onClose();
                  }}
                  className="text-[13px] text-gray-600 hover:text-black underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-all">
                  View full details
                </button>
              </div>

              {/* Mobile Sticky Action Buttons (Bottom fixed on mobile) */}
              <div
                className="md:hidden absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex gap-3 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
                style={{
                  paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                }}>
                <button
                  onClick={() => handleAction(onAddToCart)}
                  disabled={cartSyncing || isProcessing}
                  className="flex-1 h-12 bg-white border border-[#da127d] text-[#da127d] text-xs font-medium hover:bg-[#da127d] hover:text-white transition-colors rounded-none disabled:opacity-70 tracking-wide">
                  ADD TO CART
                </button>
                <button
                  onClick={() => handleAction(onBuyNow)}
                  disabled={cartSyncing || isProcessing}
                  className="flex-1 h-12 bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors rounded-none disabled:opacity-70 tracking-wide border border-black">
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom scrollbar matching sleek design */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f9f9f9; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db; 
            border-radius: 0px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af; 
          }
        `,
          }}
        />

        {/* SIZE CHART MODAL */}
        {hasSizes && (
          <SizeChartModal
            isOpen={showSizeChart}
            onClose={() => setShowSizeChart(false)}
            chartUnit={chartUnit}
            onChartUnitChange={setChartUnit}
          />
        )}
      </>,
      document.body,
    );
  },
);

QuickShopModal.displayName = "QuickShopModal";

export default QuickShopModal;
