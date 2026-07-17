import React, { useState, useCallback, memo } from "react";

/**
 * SeoLinksSection
 * ----------------
 * Bottom-of-homepage SEO/backlink block: brand blurb + internal link
 * clusters (top categories, popular searches, shop-by-occasion).
 */

const toSlug = (label) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

// NOTE: You can modify this to handle standard routes for the main links
// e.g., if label is "Contact Us", return "/contact-us"
const buildHref = (label) => {
  const customRoutes = {
    "Contact Us": "/pages/contact",
    "New Arrivals": "/collections/new-arrivals",
    "About Us": "/about",
    "Track Order": "/track-order",
    FAQs: "/faqs",
  };
  return customRoutes[label] || `/search?q=${encodeURIComponent(label)}`;
};

const INTRO_TEXT = `Discover the finest ethnic and contemporary women's wear with Mnmukt. From handcrafted kurta sets and elegant suits to statement dresses, lehengas and sarees, every piece is chosen for quality, comfort and design. After building trust with customers across categories, we've made it effortless to shop online — browse curated collections, enjoy secure checkout, and take advantage of seasonal offers on your favourite styles. Whether you're dressing for everyday wear, office, or a special occasion, Mnmukt brings you fashion that fits every moment.`;

// Added Main Sitelinks here
const MAIN_SITELINKS = [
  "New Arrivals",
  "Contact Us",
  "About Us",
  "Track Order",
  "Shipping & Returns",
  "FAQs",
  "Blog",
];

const LINK_GROUPS = [
  {
    title: "Suits Top Categories",
    links: [
      "Pakistani Suits",
      "Alia Cut Suits",
      "Frock Suits",
      "Wedding Suits",
      "Straight Pants Suits",
      "White Suits",
      "Night Suits",
      "Designer Suits",
      "Sharara Suits for Wedding",
      "Plus Size Suits",
      "Office Wear Suits",
      "Cotton Suits with Dupatta",
      "Daily Wear Suits",
      "Velvet Suits",
      "Pink Suits",
      "Punjabi Suits",
      "Summer Suits",
      "Wedding Anarkali Suits",
      "Cotton Salwar Suits",
      "Bandhani Suits",
      "Sleeveless Suits",
      "Printed Suits",
      "Cotton Frock Suits",
      "Embroidered Suits",
      "Patiala Suits",
      "Plain Suits",
    ],
  },
  {
    title: "Kurtis Top Categories",
    links: [
      "Black Kurtis",
      "Party Wear Kurtis",
      "Formal Kurtis",
      "V-neck Kurtis",
      "Daily Wear Kurtis",
      "Simple Kurtis",
      "Collar Kurtis",
      "Summer Kurtis",
      "Pakistani Kurtis",
      "Straight Kurtis",
      "Green Kurtis",
      "Yellow Kurtis",
      "Long Sleeves Kurtis",
      "Blue Kurtis",
      "Wedding Kurtis",
      "Kurtis With Trousers",
      "White Chikankari Kurtis",
      "Full Sleeves Kurtis",
      "Mandarin Collar Kurtis",
      "Half Sleeves Kurtis",
      "Salwar Kurtis",
      "Grey Kurtis",
      "Short Frock Kurtis",
      "Peplum Kurtis",
      "Flared Kurtis",
      "Pathani Kurtis",
      "Solid Kurtis",
      "Short Sleeve Kurtis",
    ],
  },
  {
    title: "Kurta Sets Top Categories",
    links: [
      "Kurta Sets",
      "Silk Kurta Set",
      "Green Kurta Set",
      "Embroidered Kurta Set",
      "Pink Kurta Set",
      "Purple Kurta Set",
      "Blue Kurta Set",
      "Off White Kurta Sets",
      "Red Kurta Sets",
      "Velvet Kurta Sets",
      "Orange Kurta Set",
      "Floral Kurta Set",
      "Peach Kurta Set",
      "Woolen Kurta Sets",
      "Maroon Kurta Sets",
      "Bandhani Kurta Sets",
      "Chikankari Kurta Sets",
      "Brown Kurta Set",
      "Grey Kurta Set",
      "Velvet Straight Kurta Set",
      "Block Print Kurta Set",
    ],
  },
  {
    title: "Kurtas Top Categories",
    links: [
      "Office Wear Kurtas",
      "Off White Kurtas",
      "Plus Size Kurta Palazzo Set",
      "Peach Kurtas",
      "Checked Kurtas",
      "Block Print Kurtas",
      "Teal Kurtas",
      "Mustard Kurtas",
      "High Slit Kurtas",
      "Chanderi Silk Kurtas",
      "Brown Kurtas",
      "Asymmetric Kurtas",
      "Schiffli Kurtas",
      "Workwear Kurtas",
      "Festive Kurtas",
      "Red Embroidered Kurtas",
      "Geometric Print Kurtas",
      "Cream Kurtas",
      "Self Design Kurtas",
      "Abstract Print Kurtas",
      "Yoke Design Kurtas",
      "Beige Kurtas",
      "Sea Green Kurtas",
      "Plus Size Kurtas",
      "Coral Kurtas",
      "Kashmiri Kurta",
      "Summer Kurtas",
    ],
  },
  {
    title: "Dresses Top Categories",
    links: [
      "Party Wear Dresses",
      "One Piece Dresses",
      "Reception Dresses",
      "Wedding Dresses",
      "Birthday Dresses",
      "Maxi Dresses",
      "Haldi Dresses",
      "Traditional Dresses",
      "Party Wear One Piece Dresses",
      "Western Dresses",
      "Crop Top Dresses",
      "Farewell Dresses",
      "Frock Dresses",
      "Indo Western Dresses",
      "Cotton Night Dresses",
      "Everyday Dresses",
      "Floral Dresses",
      "Lavender Dresses",
      "Engagement Dresses",
      "A Line Dresses",
      "Cotton Maxi Dresses",
      "Cotton Midi Dresses",
      "Cocktail Dresses",
      "Summer Dresses",
      "Designer Dresses",
      "Sharara Dresses",
      "Casual Dresses",
      "Heavy Wedding Dresses",
      "Western Party Dresses",
      "Jacket Dresses",
      "Sleeveless Dresses",
      "White Dresses",
      "Party Wear Maxi Dresses",
      "Green Dresses",
      "Embroidered Dresses",
      "Yellow Dresses",
      "Ankle Length Dresses",
      "Georgette Dresses",
    ],
  },
  {
    title: "Lehengas Top Categories",
    links: [
      "Simple Lehenga",
      "Wedding Lehengas",
      "Lehenga for Diwali",
      "Lehenga Dresses",
      "Karwa Chauth Lehenga",
      "Georgette Lehenga",
      "Pink Lehenga",
      "Bridal Lehengas",
      "Pastel Lehenga",
      "Green Lehenga",
      "Lehenga Skirts",
      "Embroidered Lehenga",
      "Festive Lehenga",
      "Heavy Work Lehenga",
      "Lehenga Saree",
      "Indo Western Lehengas",
      "Anarkali Lehengas",
      "Lehenga Choli",
      "Sequin Lehenga",
      "Lehenga Dupatta",
      "Maroon Lehengas",
    ],
  },
  {
    title: "Saree Top Categories",
    links: [
      "Ready To Wear Sarees",
      "Silk Sarees",
      "Organza Saree",
      "Indo Western Sarees",
      "Wedding Party Wear Sarees",
      "Office Wear Sarees",
      "Georgette Sarees",
      "Daily Wear Sarees",
      "Indigo Sarees",
      "Pastel Sarees",
      "Red Sarees",
      "Yellow Sarees For Haldi",
      "Karwa Chauth Saree",
      "White Sarees",
      "Diwali Sarees",
      "Plain Silk Sarees",
      "Heavy Wedding Sarees",
      "Wedding Sarees",
      "Workwear Sarees",
      "Cocktail Sarees",
      "Blue Sarees",
      "Durga Puja Sarees",
      "Maroon Sarees",
    ],
  },
];

const POPULAR_SEARCHES = [
  "Salwar Suits",
  "Designer Kurtas",
  "Chiffon Sarees",
  "Anarkali Suits",
  "Yellow Sarees",
  "Green Sarees",
  "Short Kurtis",
  "Black Suits for Women",
  "Cotton Kurtis",
  "White Kurtis",
  "Night Dresses for Women",
  "Black Kurtis",
  "Cotton Suits",
  "Yellow Kurtis",
  "A Line Kurtis",
  "Yellow Suits",
  "Palazzo Suits",
  "Kurti with Palazzo Set",
  "Red Kurtis",
  "Green Suits",
  "Floral Sarees",
  "Georgette Suits",
  "Embroidered Kurtis",
  "Gota Patti Suits",
  "Silk Suits",
  "Pink Kurtis",
  "Jacket Dresses",
  "Silk Kurtis",
  "Chanderi Suits",
  "Plus Size Kurtis",
  "Sharara Suits",
  "Loungewear",
  "Kids Wear for Girls",
  "Dresses with Shrug",
  "Chikankari Suits",
  "Cotton Sarees",
  "Party Wear Sarees",
  "Black Sarees",
  "Crop Tops and Skirt",
  "Palazzo Pants",
  "Lehengas for Girls",
  "Kurta Set for Women",
  "Long Kurtis",
  "Party Wear Lehenga",
  "Anarkali Kurtis",
  "Party Wear Suits",
  "Co-ord Sets Women",
  "Kurtis with Jacket",
  "Party Wear Kurtis",
  "Cotton Dresses",
  "Chikankari Kurtis",
];

const SHOP_BY_OCCASION = [
  "Mother's Day Outfit",
  "Mehendi Outfits",
  "Wedding Suits For Women",
  "Eid Dresses",
  "Haldi Dress",
  "White Anarkali",
  "Marriage Dresses",
  "Wedding Collection",
  "Durga Puja Dresses",
  "New Year Dresses",
  "Lohri Sale",
  "Makar Sankranti Offers",
  "Pongal Offers",
  "Republic Day Sale",
  "Basant Panchami Special",
  "Gudi Padwa Dress",
  "Vishu Dresses",
  "Independence Day Sale",
  "Raksha Bandhan Sale",
  "Janmashtami Sale",
  "Ganesh Chaturthi Sale",
  "Onam Offers",
  "Dussehra Sale",
  "Karwa Chauth Sale",
  "Diwali Sale",
];

/* ---------- Reusable link row ---------- */
const LinkRow = memo(({ items }) => (
  <p className="text-[13px] leading-relaxed text-[#333]">
    {items.map((label, idx) => (
      <React.Fragment key={toSlug(label)}>
        <a
          href={buildHref(label)}
          /* Updated styling to match the image: always underlined, standard text color */
          className="underline underline-offset-[3px] decoration-gray-400 hover:text-[#da127d] hover:decoration-[#da127d] transition-colors">
          {label}
        </a>
        {idx < items.length - 1 && (
          <span className="mx-1.5 text-gray-500 font-light" aria-hidden="true">
            |
          </span>
        )}
      </React.Fragment>
    ))}
  </p>
));
LinkRow.displayName = "LinkRow";

/* ---------- Collapsible group ---------- */
const LinkGroup = memo(({ title, links }) => (
  <div className="py-3">
    {/* Added a colon at the end of the title to match the design reference */}
    <h3 className="text-[14px] font-bold text-[#111] mb-1">{title}:</h3>
    <LinkRow items={links} />
  </div>
));
LinkGroup.displayName = "LinkGroup";

/* ============================================================ */
const SeoLinksSection = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <section
      aria-labelledby="seo-links-heading"
      className="w-full bg-[#fafafa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand intro */}
        <h2
          id="seo-links-heading"
          className="text-[20px] font-light text-[#111] mb-3">
          Shop The Best Women&apos;s Clothing Via Mnmukt Today!
        </h2>

        <p
          className={`text-[13px] leading-relaxed text-gray-700 ${
            expanded ? "" : "line-clamp-2"
          }`}>
          {INTRO_TEXT}
        </p>

        <button
          type="button"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-controls="seo-links-heading"
          className="mt-2 text-[13px] text-black underline underline-offset-2 hover:text-[#da127d] focus:outline-none rounded">
          {expanded ? "Read less" : "Read more"}
        </button>

        {/* Category link clusters */}
        {expanded && (
          <nav
            aria-label="Shop by category"
            className="mt-8 flex flex-col gap-3">
            {/* Added Sitelinks Section at the top */}
            <div className="py-2">
              <h3 className="text-[14px] font-bold text-[#111] mb-1">
                Quick Links:
              </h3>
              <LinkRow items={MAIN_SITELINKS} />
            </div>

            {LINK_GROUPS.map((group) => (
              <LinkGroup
                key={group.title}
                title={group.title}
                links={group.links}
              />
            ))}

            <div className="py-3">
              <h3 className="text-[14px] font-bold text-[#111] mb-1">
                Popular Searches:
              </h3>
              <LinkRow items={POPULAR_SEARCHES} />
            </div>

            <div className="py-3">
              <h3 className="text-[14px] font-bold text-[#111] mb-1">
                Shop By Occasion:
              </h3>
              <LinkRow items={SHOP_BY_OCCASION} />
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default memo(SeoLinksSection);
