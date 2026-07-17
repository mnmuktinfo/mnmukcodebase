import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../product/services/ProductService";

const useURLFilters = () => {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      if (!filters[key]) filters[key] = [];
      filters[key].push(value);
    }
    return filters;
  }, [searchParams]);
};

export const filterProducts = (products, filters = {}) => {
  const minVal = filters.priceMin?.length ? Number(filters.priceMin[0]) : null;
  const maxVal = filters.priceMax?.length ? Number(filters.priceMax[0]) : null;

  return products.filter((p) => {
    if (filters.sizes?.length && !filters.sizes.some((s) => p.sizes?.includes(s))) return false;
    if (filters.colors?.length && !filters.colors.some((c) => p.colors?.some((pc) => String(pc).toLowerCase() === String(c).toLowerCase()))) return false;
    
    const SKIP = ["sizes", "colors", "priceMin", "priceMax", "inStock", "search", "sort"];
    for (const key in filters) {
      if (SKIP.includes(key) || !(key in p)) continue;
      if (!filters[key]?.length) continue;
      const productVal = p[key];
      if (productVal == null || !filters[key].some((v) => String(productVal).toLowerCase() === String(v).toLowerCase())) return false;
    }

    if (minVal != null && !isNaN(minVal) && p.price < minVal) return false;
    if (maxVal != null && !isNaN(maxVal) && p.price > maxVal) return false;
    if (filters.inStock?.[0] === "true" && (p.inStock === false || (p.inStock == null && p.stock === 0))) return false;
    if (filters.search?.length) {
      const q = filters.search[0].toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q) && !p.tags?.some((t) => t.toLowerCase().includes(q))) return false;
    }
    return true;
  });
};

export const sortProducts = (products, sort) => {
  const arr = [...products];
  switch (sort) {
    case "price_asc": return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "price_desc": return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "name_asc": return arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    case "name_desc": return arr.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    default: return arr.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  }
};

export const useCollection = ({ collectionType = "all", categoryId = null, sort = "newest", pageSize = 20 }) => {
  const urlFilters = useURLFilters();

  const infiniteQuery = useInfiniteQuery({
    // FIX: Include price filters in queryKey so it refetches on URL change
    queryKey: ["collection", collectionType, categoryId, pageSize, urlFilters.priceMin, urlFilters.priceMax],
    queryFn: ({ pageParam = null }) =>
      productService.getProducts({
        collectionType,
        category: categoryId ?? "all",
        lastDoc: pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastDoc : undefined),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allProducts = useMemo(() => (infiniteQuery.data?.pages ?? []).flatMap((p) => p.products), [infiniteQuery.data?.pages]);
  const displayProducts = useMemo(() => sortProducts(filterProducts(allProducts, urlFilters), sort), [allProducts, urlFilters, sort]);

  const facets = useMemo(() => {
    const sizes = new Map();
    const colors = new Map();
    allProducts.forEach((p) => {
      p.sizes?.forEach((s) => s && sizes.set(s, (sizes.get(s) ?? 0) + 1));
      p.colors?.forEach((c) => c && colors.set(String(c).toLowerCase(), (colors.get(String(c).toLowerCase()) ?? 0) + 1));
    });
    return { sizes, colors };
  }, [allProducts]);

  return { displayProducts, facets, totalFetched: allProducts.length, fetchNextPage: infiniteQuery.fetchNextPage, hasNextPage: infiniteQuery.hasNextPage ?? false, isFetchingNextPage: infiniteQuery.isFetchingNextPage, isLoading: infiniteQuery.isLoading, isError: infiniteQuery.isError };
};