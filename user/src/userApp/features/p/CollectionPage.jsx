import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useCollection } from "./Usecollection";

import DesktopSidebar from "./components/DesktopSidebar";
import CollectionToolbar from "./components/CollectionToolbar";
import MobileFilterSheet from "./components/MobileFilterSheet";
import MobileSortSheet from "./components/MobileSortSheet";
import MobileBottomFilterBar from "./components/MobileBottomFilterBar";

import Breadcrumb from "./components/Breadcrumb";
import ActiveChips from "./components/ActiveChips";
import CollectionSearch from "./components/CollectionSearch";
import ProductGrid from "./components/ProductGrid";

// Removed COLLECTION_LABELS import
import { parseCollectionSlug } from "./utils/collectionSlug";
import countActive from "./utils/countActive";
import { readFilters } from "./utils/filterUtils";

// Import BOTH productSections and collectionsData
import {
  productSections,
  collectionsData,
} from "../mainPage/config/productCollection";

const CollectionPage = ({ collectionType: propCollectionType }) => {
  const { collectionType: routeCollectionType = "all" } = useParams();
  const collectionType = propCollectionType || routeCollectionType;
  const [sp, setSp] = useSearchParams();

  /**
   * Price band parsing for slugs like /collections/below-1000
   */
  const {
    isPriceCollection,
    priceRange = {},
    label: priceLabel,
  } = useMemo(() => parseCollectionSlug(collectionType), [collectionType]);

  /**
   * Sync price slug bounds to actual URL search params
   */
  const prevCollectionTypeRef = useRef(collectionType);

  useLayoutEffect(() => {
    if (!isPriceCollection) {
      prevCollectionTypeRef.current = collectionType;
      return;
    }

    const navigatedToNewSlug = prevCollectionTypeRef.current !== collectionType;
    prevCollectionTypeRef.current = collectionType;

    const next = new URLSearchParams(sp);
    let changed = false;

    if (priceRange.min != null) {
      if (navigatedToNewSlug || !next.has("priceMin")) {
        next.set("priceMin", String(priceRange.min));
        changed = true;
      }
    } else if (navigatedToNewSlug && next.has("priceMin")) {
      next.delete("priceMin");
      changed = true;
    }

    if (priceRange.max != null) {
      if (navigatedToNewSlug || !next.has("priceMax")) {
        next.set("priceMax", String(priceRange.max));
        changed = true;
      }
    } else if (navigatedToNewSlug && next.has("priceMax")) {
      next.delete("priceMax");
      changed = true;
    }

    if (changed) setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPriceCollection, priceRange.min, priceRange.max, collectionType]);

  // Read active filters from URL
  const filters = useMemo(() => readFilters(sp), [sp]);

  // Sync sort state directly to the URL
  const sort = sp.get("sort") || "newest";
  const setSort = (newSort) => {
    const next = new URLSearchParams(sp);
    if (newSort === "newest") {
      next.delete("sort"); // Keep URL clean if it's the default
    } else {
      next.set("sort", newSort);
    }
    setSp(next, { replace: true });
  };

  const [gridCols, setGridCols] = useState(4);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);

  const effectiveCollectionType = isPriceCollection ? "all" : collectionType;

  const {
    displayProducts,
    facets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useCollection({ collectionType: effectiveCollectionType, sort });

  /* Infinite Scroll */
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "500px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* Body Scroll Lock */
  useEffect(() => {
    document.body.style.overflow =
      showFilterSheet || showSortSheet ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilterSheet, showSortSheet]);

  /* ─────────────────────────────────────────────────────────────
     SEO & METADATA INJECTION (Powered by collectionsData.js)
  ───────────────────────────────────────────────────────────── */

  // Look up the collection in BOTH provided arrays
  const sectionData = productSections.find((s) => s.key === collectionType);
  const categoryData = collectionsData.find((c) => c.slug === collectionType);

  // Fallback chain for the title
  const title =
    priceLabel ??
    sectionData?.title ??
    categoryData?.title ??
    collectionType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Determine SEO Title
  const seoTitle = sectionData?.seoTitle
    ? `${sectionData.seoTitle} | Mnmukt`
    : `${title} | Mnmukt`;

  // Determine SEO Description (Falls back to category subtitle if seoDescription isn't present)
  const seoDescription = isPriceCollection
    ? `Shop women's fashion ${title.toLowerCase()} at Mnmukt. Discover kurtas, suits, dresses, sarees and more, all priced to fit your budget.`
    : (sectionData?.seoDescription ??
      categoryData?.subtitle ??
      `Shop the ${title} collection at Mnmukt — premium ethnic and contemporary women's wear, curated for quality and style.`);

  // Determine optional Page Header Subtitle
  const pageSubtitle = sectionData?.subtitle ?? categoryData?.subtitle;

  const filterCnt = countActive(filters);
  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
  }[gridCols];

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link
          rel="canonical"
          href={`https://mnmukt.com/collections/${collectionType}`}
        />
      </Helmet>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-white pb-[80px] lg:pb-20 font-sans selection:bg-[#da127d] selection:text-white">
        {/* Mobile Sheets */}
        {showFilterSheet && (
          <MobileFilterSheet
            facets={facets}
            filters={filters}
            onClose={() => setShowFilterSheet(false)}
            setSp={setSp}
          />
        )}

        {showSortSheet && (
          <MobileSortSheet
            sort={sort}
            onSelect={setSort}
            onClose={() => setShowSortSheet(false)}
          />
        )}

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections/all" },
            { label: title },
          ]}
        />

        {/* Optional Page Header using dynamic subtitle */}
        {pageSubtitle && !isPriceCollection && (
          <div className="px-6 lg:px-12 mt-4 text-gray-600 text-sm md:text-base">
            {pageSubtitle}
          </div>
        )}

        <div className="flex px-6 lg:px-12 mt-6 lg:mt-10">
          {/* Desktop Sidebar */}
          <DesktopSidebar facets={facets} filters={filters} setSp={setSp} />

          {/* Products Column */}
          <div className="flex-1 min-w-0">
            {/* Desktop Search */}
            <CollectionSearch value={filters.search} sp={sp} setSp={setSp} />

            {/* Desktop Toolbar */}
            <CollectionToolbar
              title={title}
              gridCols={gridCols}
              setGridCols={setGridCols}
              sort={sort}
              setSort={setSort}
            />

            {/* Mobile Search */}
            <CollectionSearch
              mobile
              value={filters.search}
              sp={sp}
              setSp={setSp}
            />

            {/* Active Filters */}
            <ActiveChips filters={filters} />

            {/* Product Grid */}
            <ProductGrid
              isLoading={isLoading}
              isError={isError}
              displayProducts={displayProducts}
              gridClass={gridClass}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              sentinelRef={sentinelRef}
              clearFilters={() => setSp({})}
            />
          </div>
        </div>

        {/* Mobile Bottom Filter Bar */}
        <MobileBottomFilterBar
          filterCount={filterCnt}
          sort={sort}
          onOpenFilter={() => setShowFilterSheet(true)}
          onOpenSort={() => setShowSortSheet(true)}
        />
      </div>
    </>
  );
};

export default CollectionPage;
