// CartView.jsx
import React, { useState } from "react";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  TruckIcon,
  HeartIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  TagIcon,
  ShoppingBagIcon,
  GiftIcon,
  CheckCircleIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import Disclosure from "../common/Disclosure";
import OrderUpdatesOptIn from "../../features/notifications/components/OrderUpdatesOptIn";

// ---------- Design tokens (pink theme) ----------
const C = {
  pink: "#EC4899",
  pinkDark: "#DB2777",
  pinkSoft: "#FDF2F8",
  pinkBorder: "#FBCFE8",
  ink: "#1F2937",
  green: "#16A34A",
  amber: "#D97706",
};

// Poppins for headings/buttons (friendly, , retail-app feel),
// Inter for body/data so numbers stay crisp at small sizes.
const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .cart-display { font-family: 'Poppins', sans-serif; }
    .cart-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

// ---------- Helpers ----------
const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const FREE_SHIPPING_THRESHOLD = 1000;

const getDiscount = (original, current) => {
  const orig = Number(original) || 0;
  const curr = Number(current) || 0;
  if (orig <= curr || orig === 0) return 0;
  return Math.round(((orig - curr) / orig) * 100);
};

const calculateTotalMrp = (cart = []) =>
  cart.reduce((acc, item) => {
    const unitPrice = Number(item.originalPrice || item.price);
    return acc + unitPrice * item.quantity;
  }, 0);

const handleImageError = (e) => {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = "true";
    e.target.src = "/placeholder-image.jpg";
  }
};

const ItemAttributes = ({ item }) => {
  const size = item.variant?.size;
  const color = item.variant?.color;

  return (
    <div className="mt-1 space-y-1">
      {size && size !== "onesize" && (
        <div className="flex items-center gap-1.5 text-[12px] cart-body">
          <span className="text-gray-400">Size:</span>
          <span className="font-medium text-gray-700">{size}</span>
        </div>
      )}
      {color && (
        <div className="flex items-center gap-1.5 text-[12px] cart-body">
          <span className="text-gray-400">Color:</span>
          <span className="font-medium text-gray-700">
            {typeof color === "object" ? color.name : color}
          </span>
          {typeof color === "object" && color.hex && (
            <span
              className="w-3 h-3  border border-gray-200 shadow-sm ml-1"
              style={{ backgroundColor: color.hex }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ---------- Small presentational pieces ----------

const EmptyCartMessage = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
    <div className="w-16 h-16  bg-pink-50 flex items-center justify-center mb-4">
      <ShoppingBagIcon className="w-7 h-7 text-pink-500" strokeWidth={1.5} />
    </div>
    <h3 className="cart-display text-[17px] font-semibold text-gray-900 mb-1">
      Your cart is empty
    </h3>
    <p className="text-[13px] cart-body text-gray-500 mb-6 max-w-[220px]">
      Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
    </p>
    <button
      onClick={onClose}
      type="button"
      className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold cart-body  shadow-sm shadow-pink-200 transition-colors">
      Continue shopping
    </button>
  </div>
);

const FreeShippingBar = ({ totalMrp, isFreeShipping }) => {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalMrp, 0);
  const progress = isFreeShipping
    ? 100
    : Math.min((totalMrp / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="px-5 pt-4 pb-1">
      <p className="text-[13px] cart-body text-gray-600 mb-2">
        {isFreeShipping ? (
          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Free shipping unlocked
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-semibold text-pink-600">
              {fmt(remaining)}
            </span>{" "}
            more for free shipping
          </>
        )}
      </p>
      <div className="h-1.5 w-full  bg-pink-50 overflow-hidden">
        <div
          className={`h-full  transition-all duration-500 ease-out ${
            isFreeShipping ? "bg-green-500" : "bg-pink-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Mirrors the pincode check on CheckoutPage — same hook, same available /
// codAvailable fields — so a result here always agrees with checkout.
const DeliveryCheck = ({
  pincode,
  onPincodeChange,
  shippingLoading,
  shippingInfo,
  shippingError,
  codCharge,
}) => {
  const showStatus = pincode?.length === 6;

  return (
    <div className=" border border-pink-100 bg-white px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2">
        <MapPinIcon className="w-4 h-4 text-pink-500 flex-shrink-0" />
        <span className="text-[13px] font-semibold cart-display text-gray-800">
          Check delivery
        </span>
      </div>
      <input
        value={pincode}
        onChange={(e) => onPincodeChange(e.target.value)}
        placeholder="Enter pincode"
        inputMode="numeric"
        maxLength={6}
        className="w-full px-3.5 py-2.5 text-[13px] cart-body  border border-gray-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all bg-white"
      />
      {showStatus && (
        <div className="mt-2 text-[12px] cart-body">
          {shippingLoading && (
            <p className="flex items-center gap-1.5 text-gray-500">
              <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> Checking
              availability…
            </p>
          )}
          {!shippingLoading && shippingInfo?.available && (
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-green-600">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Delivers to{" "}
                {pincode}
              </p>
              {shippingInfo.codAvailable === false && (
                <p className="flex items-center gap-1.5 text-amber-600">
                  <ExclamationCircleIcon className="w-3.5 h-3.5" /> Cash on
                  delivery isn&apos;t available here
                </p>
              )}
            </div>
          )}
          {!shippingLoading && !shippingInfo?.available && (
            <p className="flex items-center gap-1.5 text-red-500 font-medium">
              <ExclamationCircleIcon className="w-3.5 h-3.5" />
              {shippingError || "Not deliverable to this pincode"}
            </p>
          )}
        </div>
      )}
      {codCharge > 0 && (
        <p className="mt-2 text-[11px] text-gray-400 cart-body">
          ₹{codCharge} extra applies for Cash on Delivery orders.
        </p>
      )}
    </div>
  );
};

const QuantitySelector = ({ item, onUpdateQuantity, isLoading }) => {
  const maxQty = Math.min(item.stock ?? 10, 10);
  return (
    <div className="flex items-center border border-gray-200  bg-white">
      <button
        type="button"
        onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
        disabled={item.quantity <= 1 || isLoading}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-pink-50 disabled:opacity-40 transition-colors "
        aria-label={`Decrease quantity of ${item.name}`}>
        <MinusIcon className="w-3.5 h-3.5" />
      </button>
      <span className="px-2 text-[13px] font-semibold cart-body text-gray-900 min-w-[1.75rem] text-center">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
        disabled={item.quantity >= maxQty || isLoading}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-pink-50 disabled:opacity-40 transition-colors "
        aria-label={`Increase quantity of ${item.name}`}>
        <PlusIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const CartItemRow = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  isLoading,
}) => {
  const discountPercentage = getDiscount(
    item.originalPrice || item.price,
    item.price,
  );
  const lowStock = item.stock != null && item.stock <= 3;

  return (
    <div className="flex gap-3 py-4">
      <div className="relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-24 object-cover  border border-gray-200 bg-white"
          onError={handleImageError}
        />
        <span className="absolute -top-2 -right-2 w-5 h-5  bg-pink-500 text-white text-[11px] font-semibold flex items-center justify-center">
          {item.quantity}
        </span>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] cart-body text-gray-900 font-medium leading-snug line-clamp-2 pr-1">
            {item.name}
          </p>
          {onMoveToWishlist && (
            <button
              onClick={() => onMoveToWishlist(item.cartKey)}
              disabled={isLoading}
              className="p-0.5 text-gray-300 hover:text-pink-500 transition-colors flex-shrink-0"
              type="button"
              aria-label={`Save ${item.name} for later`}>
              <HeartIcon className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        <ItemAttributes item={item} />

        {lowStock && (
          <p className="flex items-center gap-1 text-[11px] font-semibold cart-body text-amber-600 mt-1">
            <SparklesIcon className="w-3 h-3" /> Only {item.stock} left
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5 cart-body">
          <span className="text-[14px] font-semibold text-gray-900">
            {fmt(item.price)}
          </span>
          {discountPercentage > 0 && (
            <>
              <span className="text-[12px] text-gray-400 line-through">
                {fmt(item.originalPrice)}
              </span>
              <span className="text-[11px] font-medium px-1.5 py-0.5  bg-pink-50 text-pink-600">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>

        {item.quantity > 1 && (
          <p className="text-[11px] text-gray-400 cart-body mt-0.5">
            {item.quantity} × {fmt(item.price)} ={" "}
            {fmt(item.price * item.quantity)}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2.5">
          <QuantitySelector
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            isLoading={isLoading}
          />
          <button
            onClick={() => onRemove(item.cartKey)}
            disabled={isLoading}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-pink-500 disabled:opacity-50 transition-colors"
            type="button"
            aria-label={`Remove ${item.name} from cart`}>
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CouponField = ({ onApplyCoupon, appliedCoupon }) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim() || !onApplyCoupon) return;
    setStatus("applying");
    setError("");
    try {
      await onApplyCoupon(code.trim());
      setStatus(null);
    } catch (err) {
      setStatus("error");
      setError(err?.message || "That code didn't work. Try another.");
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between px-3.5 py-3  bg-green-50 border border-green-200">
        <span className="flex items-center gap-2 text-[13px] cart-body text-green-700 font-medium">
          <TagIcon className="w-4 h-4" /> {appliedCoupon} applied
        </span>
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-stretch gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Coupon code"
          className="flex-1 px-3.5 py-2.5 text-[13px] cart-body  border border-gray-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all bg-white placeholder:text-gray-400"
          type="text"
        />
        <button
          onClick={handleApply}
          disabled={status === "applying" || !code.trim()}
          type="button"
          className="px-4 text-[13px] font-semibold cart-body  border border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-40 transition-colors">
          {status === "applying" ? "Applying…" : "Apply"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[12px] text-red-500 cart-body mt-1.5">{error}</p>
      )}
    </div>
  );
};

const GiftWrapCard = ({ checked, onToggle, note, onNoteChange, fee = 49 }) => (
  <div className=" border border-pink-100 bg-white overflow-hidden">
    <label className="flex items-center justify-between px-3.5 py-3 cursor-pointer">
      <span className="flex items-center gap-2.5 cart-body">
        <GiftIcon className="w-4.5 h-4.5 text-pink-500" />
        <span className="text-[13px] text-gray-900">
          Add gift wrap
          <span className="text-gray-400"> · {fmt(fee)}</span>
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4 accent-pink-500  cursor-pointer"
      />
    </label>
    {checked && (
      <div className="px-3.5 pb-3.5">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value.slice(0, 120))}
          placeholder="Add a gift note (optional)"
          rows={2}
          className="w-full text-[12px] cart-body  px-2.5 py-2 outline-none resize-none bg-pink-50/40 border border-pink-100 placeholder:text-gray-400 focus:border-pink-300"
        />
        <p className="text-[10px] text-gray-400 cart-body text-right mt-0.5">
          {note.length}/120
        </p>
      </div>
    )}
  </div>
);

const DeliveryInfo = () => (
  <Disclosure title="Delivery information" icon={TruckIcon}>
    <ul className="list-disc pl-4 space-y-1">
      <li>Free shipping across India on orders above ₹1,000.</li>
      <li>₹150 shipping charge on orders below ₹1,000.</li>
      <li>₹50 extra for Cash on Delivery orders.</li>
      <li>Orders ship in 3-4 working days, delivered in 7-10 days.</li>
    </ul>
    <p>
      Need priority shipping? Contact href="mailto:support@babli.in"
      className="text-pink-600 underline underline-offset-2" support@babli.in .
    </p>
  </Disclosure>
);

const TrustStrip = () => (
  <div className="grid grid-cols-3 gap-2 px-5 pt-3 pb-1">
    {[
      { icon: ShieldCheckIcon, label: "Secure checkout" },
      { icon: ArrowPathIcon, label: "Easy 7-day returns" },
      { icon: TruckIcon, label: "COD available" },
    ].map(({ icon: Icon, label }) => (
      <div
        key={label}
        className="flex flex-col items-center text-center gap-1 py-2">
        <Icon className="w-4.5 h-4.5 text-pink-400" strokeWidth={1.5} />
        <span className="text-[10px] leading-tight text-gray-500 cart-body">
          {label}
        </span>
      </div>
    ))}
  </div>
);

const CartSummaryFooter = ({
  totalMrp,
  itemsTotal,
  discount,
  shippingFee,
  tax,
  totalAmount,
  giftWrapFee,
  isLoading,
  cartLength,
  onProceedToAddress,
}) => {
  const mrpSavings = totalMrp - (itemsTotal || totalAmount + discount);
  const grandTotal = totalAmount + giftWrapFee;

  return (
    <div className="bg-white px-5 pt-4 pb-5 border-t border-gray-100">
      <div className="space-y-2 mb-4 text-[13.5px] cart-body">
        <div className="flex justify-between text-gray-500">
          <span>Total MRP</span>
          <span className="line-through">{fmt(totalMrp)}</span>
        </div>
        {mrpSavings > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>You save</span>
            <span>{fmt(mrpSavings)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Coupon discount</span>
            <span>-{fmt(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={shippingFee > 0 ? "" : "text-green-600 font-medium"}>
            {shippingFee > 0 ? fmt(shippingFee) : "FREE"}
          </span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>{fmt(tax)}</span>
          </div>
        )}
        {giftWrapFee > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>Gift wrap</span>
            <span>{fmt(giftWrapFee)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
          <span className="text-[16px] cart-display font-semibold text-gray-900">
            Total
          </span>
          <span className="text-[20px] cart-display font-bold text-gray-900">
            {fmt(grandTotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onProceedToAddress}
        disabled={isLoading || !cartLength}
        className="w-full h-[52px] bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold cart-body text-sm  shadow-sm shadow-pink-200 transition-all duration-200"
        type="button">
        {isLoading ? "Processing…" : "Proceed to checkout"}
      </button>
    </div>
  );
};

// ---------- Main component ----------

const CartView = ({
  cart,
  pricing,
  isLoading,
  onUpdateQuantity,
  onRemove,
  onProceedToAddress,
  onClose,
  onMoveToWishlist,
  onApplyCoupon,
  appliedCoupon,
  onClearCart,
  pincode,
  onPincodeChange,
  shippingInfo,
  shippingLoading,
  shippingError,
  codCharge,
}) => {
  const {
    itemsTotal = 0,
    shippingFee = 0,
    discount = 0,
    tax = 0,
    totalAmount = 0,
  } = pricing || {};
  const totalMrp = calculateTotalMrp(cart);
  const isFreeShipping = cart?.length > 0 && shippingFee === 0;
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const giftWrapFee = giftWrap ? 49 : 0;

  return (
    <div className="flex flex-col h-full bg-white cart-body">
      <FontImports />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[18px] cart-display font-semibold text-gray-900">
          My cart{" "}
          {cart?.length > 0 && (
            <span className="text-gray-400 font-normal">({cart.length})</span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {onClearCart && cart?.length > 0 && (
            <button
              onClick={onClearCart}
              type="button"
              className="text-[12px] font-medium cart-body text-gray-400 hover:text-pink-500 transition-colors">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900  hover:bg-pink-50 transition-colors"
            type="button"
            aria-label="Close cart">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {cart?.length > 0 && (
        <FreeShippingBar totalMrp={totalMrp} isFreeShipping={isFreeShipping} />
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {!cart?.length ? (
          <EmptyCartMessage onClose={onClose} />
        ) : (
          <div className="px-5 divide-y divide-gray-100">
            {cart.map((item, index) => (
              <CartItemRow
                key={item.cartKey ?? item.id ?? index}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
                onMoveToWishlist={onMoveToWishlist}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        {cart?.length > 0 && (
          <div className="px-5 mt-3 space-y-3 pb-2">
            {onPincodeChange && (
              <DeliveryCheck
                pincode={pincode}
                onPincodeChange={onPincodeChange}
                shippingLoading={shippingLoading}
                shippingInfo={shippingInfo}
                shippingError={shippingError}
                codCharge={codCharge}
              />
            )}
            {onApplyCoupon && (
              <CouponField
                onApplyCoupon={onApplyCoupon}
                appliedCoupon={appliedCoupon}
              />
            )}
            <GiftWrapCard
              checked={giftWrap}
              onToggle={setGiftWrap}
              note={giftNote}
              onNoteChange={setGiftNote}
            />
            <DeliveryInfo />
            <OrderUpdatesOptIn />
          </div>
        )}

        {cart?.length > 0 && <TrustStrip />}
      </div>

      {cart?.length > 0 && (
        <CartSummaryFooter
          totalMrp={totalMrp}
          itemsTotal={itemsTotal}
          discount={discount}
          shippingFee={shippingFee}
          tax={tax}
          totalAmount={totalAmount}
          giftWrapFee={giftWrapFee}
          isLoading={isLoading}
          cartLength={cart?.length}
          onProceedToAddress={onProceedToAddress}
        />
      )}
    </div>
  );
};

export default CartView;
