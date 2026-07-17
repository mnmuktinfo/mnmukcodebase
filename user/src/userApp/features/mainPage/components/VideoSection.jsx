// features/.../components/VideoSection.jsx
import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Heart, Check, Volume2, VolumeX } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "../../wishList/context/WishlistContext";
import { useCart } from "../../cart/context/CartContext";
import { useNavigate } from "react-router-dom";
import NotificationProduct from "../../../components/cards/NotificationProduct";
import QuickShopModal from "../../../components/cards/QuickShopModal";
import { videos } from "../config/productCollection";

const priceFormatter = new Intl.NumberFormat("en-IN");
const formatPrice = (price) => priceFormatter.format(price || 0);

/* =========================================================
   SHOPPABLE VIDEO CARD
========================================================= */
const ShoppableVideoCard = ({ item }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const {
    isWishlisted,
    toggleWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { addToCart, syncing: cartSyncing } = useCart();
  const navigate = useNavigate();

  const validatedProduct = useMemo(() => {
    const product = item?.product;
    if (!product?.id) return null;

    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];

    return {
      id: product.id,
      name: product.name || "Unnamed Product",
      slug: product.slug || product.id,
      price: product.price ?? 0,
      originalPrice: product.originalPrice ?? product.price ?? 0,
      category: product.category || "General",
      sku: product.sku || `SKU-${product.id}`,
      banner: product.banner || product.image || product.images?.[0],
      images: product.images || [],
      badge: product.badge || null,
      colors,
      sizes,
      hasColors: colors.length > 0,
      hasSizes: sizes.length > 0,
    };
  }, [item]);

  const isLiked = useMemo(
    () => (validatedProduct ? isWishlisted(validatedProduct.id) : false),
    [isWishlisted, validatedProduct],
  );

  const discount =
    validatedProduct && validatedProduct.originalPrice > validatedProduct.price
      ? Math.round(
          ((validatedProduct.originalPrice - validatedProduct.price) /
            validatedProduct.originalPrice) *
            100,
        )
      : 0;

  const buildVariantId = (size, color) => {
    const parts = [];
    if (validatedProduct.hasSizes) parts.push(size || "onesize");
    if (validatedProduct.hasColors) parts.push(color?.name || "default");
    return parts.length ? parts.join("-") : "standard";
  };

  // Mobile: Play video automatically when it scrolls into view (60% visibility)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger intersection logic on touch/mobile devices
        if (window.innerWidth <= 768) {
          if (entry.isIntersecting) {
            vid
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            vid.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(vid);
    return () => observer.disconnect();
  }, []);

  // Desktop: Play video on hover
  const handleEnter = useCallback(() => {
    if (window.innerWidth > 768) {
      videoRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (window.innerWidth > 768) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, []);

  const handleWishlist = useCallback(
    (e) => {
      e.stopPropagation();
      if (wishlistLoading || !validatedProduct) return;
      toggleWishlist(validatedProduct.id);
    },
    [wishlistLoading, toggleWishlist, validatedProduct],
  );

  const handleNavigate = useCallback(() => {
    if (!validatedProduct) return;
    navigate(`/product/${validatedProduct.slug}`);
  }, [navigate, validatedProduct]);

  const executeAddToCart = async (selectedData) => {
    try {
      const selectedSize = validatedProduct.hasSizes
        ? selectedData.size || "onesize"
        : "onesize";
      const selectedColor = validatedProduct.hasColors
        ? selectedData.color || null
        : null;

      if (validatedProduct.hasColors && !selectedColor) {
        setNotification({
          show: true,
          message: "Please select a color",
          type: "error",
        });
        return;
      }
      if (validatedProduct.hasSizes && !selectedData.size) {
        setNotification({
          show: true,
          message: "Please select a size",
          type: "error",
        });
        return;
      }

      const cartItem = {
        productId: validatedProduct.id,
        name: validatedProduct.name,
        price: validatedProduct.price,
        originalPrice: validatedProduct.originalPrice,
        image: validatedProduct.banner,
        category: validatedProduct.category,
        slug: validatedProduct.slug,
        sku: validatedProduct.sku,
        selectedSize,
        selectedColor,
        variantId: buildVariantId(selectedSize, selectedColor),
        quantity: selectedData.quantity || 1,
      };

      await addToCart(cartItem);

      setIsQuickShopOpen(false);
      setIsAdded(true);
      setNotification({
        show: true,
        message: validatedProduct.name,
        type: "cart",
      });
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      setNotification({
        show: true,
        message: "Could not add to bag",
        type: "error",
      });
    }
  };

  const executeBuyNow = (selectedData) => {
    try {
      const selectedSize = validatedProduct.hasSizes
        ? selectedData.size || "onesize"
        : "onesize";
      const selectedColor = validatedProduct.hasColors
        ? selectedData.color || null
        : null;

      if (validatedProduct.hasColors && !selectedColor) {
        setNotification({
          show: true,
          message: "Please select a color",
          type: "error",
        });
        return;
      }
      if (validatedProduct.hasSizes && !selectedData.size) {
        setNotification({
          show: true,
          message: "Please select a size",
          type: "error",
        });
        return;
      }

      setIsQuickShopOpen(false);
      navigate("/checkout/buy-now", {
        state: {
          items: [
            {
              productId: validatedProduct.id,
              name: validatedProduct.name,
              price: validatedProduct.price,
              originalPrice: validatedProduct.originalPrice,
              image: validatedProduct.banner,
              category: validatedProduct.category,
              slug: validatedProduct.slug,
              sku: validatedProduct.sku,
              quantity: selectedData.quantity || 1,
              selectedSize,
              selectedColor,
              variantId: buildVariantId(selectedSize, selectedColor),
            },
          ],
        },
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Could not proceed to checkout",
        type: "error",
      });
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!validatedProduct || cartSyncing || isAdded) return;
    if (validatedProduct.hasColors || validatedProduct.hasSizes) {
      setIsQuickShopOpen(true);
    } else {
      executeAddToCart({ quantity: 1 });
    }
  };

  if (!validatedProduct) return null;

  return (
    <>
      {isQuickShopOpen && (
        <QuickShopModal
          product={validatedProduct}
          image={validatedProduct.banner}
          formatPrice={formatPrice}
          onClose={() => setIsQuickShopOpen(false)}
          onAddToCart={(data) => executeAddToCart(data)}
          onBuyNow={(data) => executeBuyNow(data)}
          cartSyncing={cartSyncing}
          isLiked={isLiked}
          onToggleWishlist={handleWishlist}
          onViewDetails={() => {
            setIsQuickShopOpen(false);
            handleNavigate();
          }}
        />
      )}

      {notification.show && (
        <NotificationProduct
          message={notification.message}
          type={notification.type}
          product={{
            img: validatedProduct.banner,
            name: validatedProduct.name,
            price: formatPrice(validatedProduct.price),
          }}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div
        className="relative w-full flex flex-col cursor-pointer group"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleNavigate}>
        {/* Progress bar syncs to actual play state now */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/10 z-20 overflow-hidden">
          <div
            className={`h-full bg-[#da127d] transition-transform duration-[6000ms] ease-linear ${
              isPlaying ? "translate-x-0" : "-translate-x-full"
            }`}
          />
        </div>

        <div className="relative w-full aspect-[3/4] bg-[#F9F5F6] overflow-hidden rounded-sm md:rounded-none">
          <video
            ref={videoRef}
            src={item.url}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />

          {validatedProduct.badge && (
            <div className="absolute top-3 left-3 text-[9px] font-bold text-white bg-[#da127d] uppercase tracking-[0.15em] px-2.5 py-1.5 shadow-sm z-10">
              {validatedProduct.badge}
            </div>
          )}

          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 w-9 h-9 md:w-8 md:h-8 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#da127d] transition-colors duration-300 z-10 shadow-sm group/heart rounded-full md:rounded-none">
            <Heart
              size={16}
              strokeWidth={isLiked ? 0 : 1.5}
              className={`transition-colors duration-300 ${
                isLiked
                  ? "fill-[#da127d] text-[#da127d] group-hover/heart:fill-white group-hover/heart:text-white"
                  : "text-gray-900 group-hover/heart:text-white fill-transparent"
              }`}
            />
          </button>

          {/* Mute button: Always visible on mobile, reveal on hover for desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((m) => !m);
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full shadow-sm z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Refined responsive spacing for bottom details */}
        <div className="flex flex-row items-center justify-between gap-2 md:gap-2.5 pt-3 px-1">
          <div className="flex items-center gap-2 md:gap-2.5 min-w-0 flex-1">
            <img
              src={validatedProduct.banner}
              alt={validatedProduct.name}
              className="w-9 h-9 md:w-10 md:h-10 object-cover shrink-0 bg-[#F9F5F6]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-gray-900 uppercase tracking-wide truncate">
                {validatedProduct.name}
              </p>

              <div className="flex items-center gap-1.5 mt-[1px] md:mt-0.5">
                <span className="text-[11px] md:text-[12px] font-semibold text-gray-900">
                  ₹{formatPrice(validatedProduct.price)}
                </span>
                {discount > 0 && (
                  <span className="text-[9px] md:text-[10px] text-gray-400 line-through truncate">
                    ₹{formatPrice(validatedProduct.originalPrice)}
                  </span>
                )}
              </div>

              {validatedProduct.hasColors && (
                <div className="flex items-center gap-1 mt-1">
                  {validatedProduct.colors.slice(0, 4).map((c, i) => (
                    <span
                      key={c.name || i}
                      title={c.name}
                      className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {validatedProduct.colors.length > 4 && (
                    <span className="text-[8px] md:text-[9px] text-gray-400">
                      +{validatedProduct.colors.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddClick}
            disabled={cartSyncing || isAdded}
            className={`shrink-0 text-[9px] md:text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 md:px-3 md:py-2 transition-colors duration-300 ${
              isAdded
                ? "bg-[#da127d] text-white"
                : "bg-[#fbe3ee] text-[#da127d] hover:bg-[#da127d] hover:text-white"
            }`}>
            {isAdded ? (
              <Check size={12} strokeWidth={2.5} />
            ) : validatedProduct.hasColors || validatedProduct.hasSizes ? (
              "Select"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

/* =========================================================
   VIDEO SECTION
========================================================= */
const VideoSection = ({
  title = "Season's Spotlight",
  subtitle = "Shop the looks straight off the reel",
}) => {
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(null);

  const videoList = useMemo(() => videos || [], []);

  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    setIsScrolling(direction);
    const scrollAmount = window.innerWidth <= 768 ? 240 : 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(() => setIsScrolling(null), 300);
  }, []);

  if (!videoList.length) return null;

  return (
    <section className="w-full bg-linear-to-b from-white via-[#fff7fa] to-white py-5 md:py-10">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-6 md:mb-12">
          <span className="text-[#da127d] uppercase tracking-[0.2em] text-[10px] md:text-[11px] font-medium mb-2">
            Watch & Shop
          </span>
          <h2 className="text-[18px] sm:text-[20px] md:text-[26px] font-medium text-[#1a1a1a] tracking-[0.01em]">
            {title}
          </h2>
          <p className="mt-1.5 md:mt-2 text-[12px] sm:text-[13px] md:text-[14px] text-[#6b6b6b] max-w-[420px]">
            {subtitle}
          </p>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className={`hidden md:flex absolute top-[38%] -left-5 -translate-y-1/2 w-10 h-10 items-center justify-center z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              isScrolling === "left" ? "scale-90" : "hover:scale-110"
            }`}>
            <span className="absolute inset-0 bg-white border border-[#e5e5e5] rounded-full shadow-sm" />
            <ChevronLeftIcon className="relative w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={() => scroll("right")}
            className={`hidden md:flex absolute top-[38%] -right-5 -translate-y-1/2 w-10 h-10 items-center justify-center z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              isScrolling === "right" ? "scale-90" : "hover:scale-110"
            }`}>
            <span className="absolute inset-0 bg-white border border-[#e5e5e5] rounded-full shadow-sm" />
            <ChevronRightIcon className="relative w-4 h-4 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {videoList.map((item, index) => (
              <div
                key={item.product?.id ?? index}
                /* Use viewport width for mobile scaling, capping at desktop sizes */
                className="snap-start shrink-0 w-[70vw] max-w-[240px] sm:w-[260px] md:w-[280px] transition-transform duration-300 md:hover:-translate-y-1">
                <ShoppableVideoCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(VideoSection);
