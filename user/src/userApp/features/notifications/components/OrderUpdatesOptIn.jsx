import React, { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { useAuth } from "../../auth/context/UserContext"; // adjust to match your project's actual path
import { auth } from "../../../../config/firebaseConfig"; // adjust depth to your actual firebaseConfig location
import { CustomerContactService } from "../../orders/services/api/customerContact.service"; // adjust if your path differs

// Collects a customer's mobile number so order updates (confirmation,
// dispatch, delivery) can be sent over WhatsApp/SMS. Skips asking if the
// user is logged in and already has a valid number on their profile.
// On save:
//   - logged-in users: sends a Firebase ID token so the backend can link
//     the preference to their account, and syncs the number to their
//     profile (Firestore doc + AuthContext state) via updateUserProfile.
//   - guests: sends the device's guestId so the backend can trace the
//     opt-in without an account.
const OrderUpdatesOptIn = () => {
  const { isLoggedIn, user, guestId, updateUserProfile } = useAuth();

  const [phone, setPhone] = useState(
    isLoggedIn ? user?.phone || "" : CustomerContactService.getSavedPhone(),
  );
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [error, setError] = useState("");

  // If the logged-in user already has a valid number on file, there's
  // nothing to ask — just confirm it. Also re-syncs if the profile's
  // phone changes elsewhere while this is mounted.
  useEffect(() => {
    if (isLoggedIn && CustomerContactService.isValidIndianMobile(user?.phone)) {
      setPhone(user.phone);
      setStatus("saved");
    }
  }, [isLoggedIn, user?.phone]);

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!CustomerContactService.isValidIndianMobile(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("saving");

    try {
      // Logged-in: fetch a fresh ID token so the backend can attach this
      // preference to the account. Non-fatal if it fails — falls back
      // to a guest-style save rather than blocking the whole action.
      let token;
      if (isLoggedIn) {
        try {
          token = await auth.currentUser?.getIdToken();
        } catch {
          token = undefined;
        }
      }

      await CustomerContactService.saveForOrderUpdates(phone, {
        token,
        guestId: !isLoggedIn ? guestId : undefined,
      });

      // Logged-in users: also sync to their profile (Firestore doc +
      // AuthContext state), so the number is remembered account-wide,
      // not just in this widget's own storage.
      if (isLoggedIn) {
        await updateUserProfile({ phone });
      }

      setStatus("saved");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "saved") {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
        <span>We&apos;ll send order updates to +91 {phone}.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border border-gray-200 rounded-lg p-4 sm:p-5">
      <label
        htmlFor="cart-contact-phone"
        className="block text-sm font-medium text-gray-800">
        Get order updates on WhatsApp
      </label>
      <p className="text-xs text-gray-500 mt-0.5 mb-3">
        We&apos;ll message you about order confirmation, dispatch, and delivery.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-rose-600">
          <span className="px-3 py-2.5 sm:py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">
            +91
          </span>
          <input
            id="cart-contact-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={handleChange}
            maxLength={10}
            aria-invalid={status === "error"}
            aria-describedby={error ? "cart-contact-phone-error" : undefined}
            className="flex-1 min-w-0 px-3 py-2.5 sm:py-2 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors">
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>

      {error && (
        <p id="cart-contact-phone-error" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
};

export default OrderUpdatesOptIn;
