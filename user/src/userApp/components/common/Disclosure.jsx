import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * Generic collapsible section — click the header to expand/collapse.
 * Reusable anywhere a "tap to reveal details" pattern is needed
 * (delivery info, size guide, returns policy, FAQs, etc).
 *
 * Usage:
 *   <Disclosure title="Delivery information" icon={TruckIcon}>
 *     ...content...
 *   </Disclosure>
 */
const Disclosure = ({ title, icon: Icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {Icon && <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          {title}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 text-xs text-gray-600 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default Disclosure;
