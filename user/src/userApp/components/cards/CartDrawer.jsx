// CartDrawer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../features/cart/context/CartContext";
import { OrderPricingService } from "../../features/orders/services/core/orderPricing.service";
import { useShippingServiceability } from "../../features/orders/hooks/useShippingServiceability";
import { PRICING_DEFAULTS } from "../../features/orders/services/schema";

import CartView from "./CartView";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, updateQuantity, remove } = useCart();
  const pricing = OrderPricingService.calculatePricing(cart);

  // Same delivery-check service the checkout page uses, so a pincode
  // marked deliverable/COD-blocked here will behave identically there.
  const {
    shippingInfo,
    shippingLoading,
    shippingError,
    checkPincode,
    reset: resetShipping,
  } = useShippingServiceability();

  const [pincode, setPincode] = useState("");
  const codCharge = PRICING_DEFAULTS?.COD_CHARGE ?? 50;

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Clear the pincode check whenever the drawer closes, so reopening it
  // later doesn't show a stale "deliverable to 400001" from last time.
  useEffect(() => {
    if (!isOpen) {
      setPincode("");
      resetShipping();
    }
  }, [isOpen, resetShipping]);

  const handlePincodeChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setPincode(digitsOnly);
    if (digitsOnly.length === 6) {
      checkPincode(digitsOnly);
    } else {
      resetShipping();
    }
  };

  const handleProceedToCheckout = () => {
    onClose();
    navigate("/checkout/buy-now", {
      state: { items: cart, type: "cart" },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-[-8px_0_32px_-8px_rgba(219,39,119,0.2)] flex flex-col transform transition-transform duration-300 ease-out pb-[env(safe-area-inset-bottom)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <CartView
          cart={cart}
          pricing={pricing}
          isLoading={false}
          onUpdateQuantity={updateQuantity}
          onRemove={remove}
          onProceedToAddress={handleProceedToCheckout}
          onClose={onClose}
          pincode={pincode}
          onPincodeChange={handlePincodeChange}
          shippingInfo={shippingInfo}
          shippingLoading={shippingLoading}
          shippingError={shippingError}
          codCharge={codCharge}
          // Optional — wire up whenever ready; safe to leave as-is.
          // onMoveToWishlist={moveToWishlist}
          // onApplyCoupon={applyCoupon}
          // appliedCoupon={pricing?.couponCode}
          // onClearCart={clearCart}
        />
      </div>
    </>
  );
};

export default CartDrawer;
