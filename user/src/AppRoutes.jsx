import { Suspense, lazy, useMemo, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "./userApp/features/auth/context/UserContext";

/* ─── Eager Components (only true critical path) ───────────────────────── */
import UserLayout from "./userApp/layouts/UserLayout";
import LoadingScreen from "./userApp/components/loading/LoadingScreen";
import NotFoundPage from "./userApp/pages/NotFoundPage";
import ErrorBoundary from "./shared/components/ErrorBoundary";
// CookiePolicy is now lazy-loaded below, like every other content page.

/* ─── Code-split Lazy Imports ────────────────────────────────────────────── */

// Auth
const AuthRoutes = lazy(() => import("./userApp/routes/AuthRoutes"));

// Public Standalone (no layout)
const EmailVerificationHelp = lazy(
  () => import("./userApp/features/auth/pages/EmailHelpPage"),
);
const HtmlSitemap = lazy(() => import("./userApp/pages/SItemap"));
const SharedTrackingPage = lazy(
  () => import("./userApp/pages/SharedTrackingPage"),
);
const CheckoutPage = lazy(() => import("./userApp/pages/CheckoutPage"));

// Public Storefront (inside UserLayout)
const HomePage = lazy(() => import("./userApp/pages/HomePage"));
const ProductDetailsPage = lazy(
  () => import("./userApp/pages/ProductDetailsPage"),
);
const CollectionPage = lazy(
  () => import("./userApp/features/p/CollectionPage"),
);
const ContactUsPage = lazy(() => import("./userApp/pages/ContactUsPage"));
const AboutUsPage = lazy(() => import("./userApp/pages/AboutUsPage"));
const OrderTrackingPage = lazy(
  () => import("./userApp/pages/OrderTrackingPage"),
);
const SingleItemCheckout = lazy(
  () => import("./userApp/pages/Singleitemcheckout"),
);

const DressesPage = lazy(() => import("./userApp/pages/DressesPage"));
const CoordSetsPage = lazy(() => import("./userApp/pages/CoordSetsPage"));
const NewArrivalsPage = lazy(() => import("./userApp/pages/NewArrivalsPage"));

// Policy / info pages — adjust these import paths to wherever the actual
// files live; I've guessed conventional names since they weren't in the
// original file.
const CookiePolicy = lazy(() => import("./userApp/pages/CookiePolicy"));
// const PrivacyPolicy = lazy(() => import("./userApp/pages/"));
// const TermsAndConditionsPage = lazy(
//   () => import("./userApp/pages/TermsAndConditionsPage"),
// );
// const ShippingPolicy = lazy(() => import("./userApp/pages/ShippingPolicy"));
// const ReturnRefundPolicy = lazy(
//   () => import("./userApp/pages/ReturnRefundPolicy"),
// );

// Protected Pages
const WishlistPage = lazy(
  () => import("./userApp/features/wishList/pages/WishlistPage"),
);
const NotificationPreferencesPage = lazy(
  () => import("./userApp/pages/NotificationPreferences"),
);

// Sub-routers with own layouts (full-screen)
const AccountRoutes = lazy(() => import("./userApp/routes/AccountRoutes"));
const CheckoutRoutes = lazy(() => import("./userApp/routes/CheckoutRoutes"));

/* ════════════════════════════════════════════════════════════
   LOADERS & BOUNDARIES
════════════════════════════════════════════════════════════ */

const FullScreenLoader = () => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    role="status"
    aria-live="polite">
    <LoadingScreen text="Curating your experience..." />
  </div>
);

const InlineLoader = () => (
  <div
    className="flex items-center justify-center min-h-[60vh] w-full bg-[#f4f4f5]"
    role="status"
    aria-live="polite">
    <LoadingScreen text="Loading..." />
  </div>
);

const PageErrorBoundary = ({ children }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

/* ════════════════════════════════════════════════════════════
   SCROLL RESTORATION
════════════════════════════════════════════════════════════ */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

/* ════════════════════════════════════════════════════════════
   PROTECTED ROUTE GATEWAY
════════════════════════════════════════════════════════════ */
const ProtectedRoute = () => {
  const { isLoggedIn, user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <FullScreenLoader />;

  if (!isLoggedIn || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/* ════════════════════════════════════════════════════════════
   ROUTE COMPONENTS
════════════════════════════════════════════════════════════ */

const LazyPage = ({ Component, fallback = <InlineLoader /> }) => (
  <PageErrorBoundary>
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  </PageErrorBoundary>
);

const LazySubRouter = ({ Component }) => (
  <Suspense fallback={<FullScreenLoader />}>
    <Component />
  </Suspense>
);

const NotFoundWithMeta = () => (
  <>
    <Helmet>
      <title>Page Not Found | Mnmukt</title>
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <NotFoundPage />
  </>
);

/* ════════════════════════════════════════════════════════════
   APP ROUTES
════════════════════════════════════════════════════════════ */
const AppRoutes = () => {
  const memoizedRoutes = useMemo(
    () => (
      <Routes>
        {/* ─── 1. AUTH ──────────────────────────────────────────────── */}
        <Route
          path="/auth/*"
          element={<LazySubRouter Component={AuthRoutes} />}
        />

        {/* ─── 2. SITEMAP ───────────────────────────────────────────── */}
        <Route
          path="/sitemap"
          element={
            <Suspense fallback={<InlineLoader />}>
              <HtmlSitemap />
            </Suspense>
          }
        />

        {/* ─── 3. STANDALONE PUBLIC (No Nav/Footer) ──────────────────── */}
        <Route
          path="/help/email-verification"
          element={
            <Suspense fallback={<InlineLoader />}>
              <EmailVerificationHelp />
            </Suspense>
          }
        />
        <Route
          path="/track-shared/:shareToken"
          element={
            <Suspense fallback={<InlineLoader />}>
              <SharedTrackingPage />
            </Suspense>
          }
        />
        <Route
          path="/checkout/buy-now"
          element={
            <Suspense fallback={<InlineLoader />}>
              <CheckoutPage />
            </Suspense>
          }
        />

        {/* ─── 4. LEGACY / ALIAS REDIRECTS ────────────────────────────
            301-style client redirects so old links, bookmarks, and
            already-indexed URLs consolidate onto the one canonical
            path instead of creating duplicate-content URLs. */}
        <Route
          path="/about-us"
          element={<Navigate to="/pages/about-us" replace />}
        />
        <Route
          path="/contact-us"
          element={<Navigate to="/pages/contact-us" replace />}
        />
        <Route
          path="/dresses"
          element={<Navigate to="/collections/dresses" replace />}
        />
        <Route
          path="/co-ord-sets"
          element={<Navigate to="/collections/co-ord-sets" replace />}
        />
        <Route
          path="/new-arrivals"
          element={<Navigate to="/collections/new-arrivals" replace />}
        />

        {/* ─── 5. PUBLIC STOREFRONT (UserLayout + Navbar/Footer) ──────── */}
        <Route element={<UserLayout />}>
          <Route index element={<LazyPage Component={HomePage} />} />

          <Route
            path="/product/:slug"
            element={<LazyPage Component={ProductDetailsPage} />}
          />

          {/* Order tracking: with an order id (shared links) and without
              (a lookup page a user can land on directly) */}
          <Route
            path="/order-tracking/:orderId"
            element={<LazyPage Component={OrderTrackingPage} />}
          />
          <Route
            path="/pages/order-tracking"
            element={<LazyPage Component={OrderTrackingPage} />}
          />

          {/* Collections — generic dynamic route first, specific named
              collections after so they resolve to their own components. */}
          <Route
            path="/collections/:collectionType"
            element={<LazyPage Component={CollectionPage} />}
          />
          <Route
            path="/collections/dresses"
            element={<LazyPage Component={DressesPage} />}
          />
          <Route
            path="/collections/co-ord-sets"
            element={<LazyPage Component={CoordSetsPage} />}
          />
          <Route
            path="/collections/new-arrivals"
            element={<LazyPage Component={NewArrivalsPage} />}
          />

          {/* Info / policy pages — all canonicalized under /pages/* */}
          <Route
            path="/pages/contact-us"
            element={<LazyPage Component={ContactUsPage} />}
          />
          <Route
            path="/pages/about-us"
            element={<LazyPage Component={AboutUsPage} />}
          />
          <Route
            path="/pages/cookie-policy"
            element={<LazyPage Component={CookiePolicy} />}
          />
          {/* <Route
            path="/pages/privacy-policy"
            element={<LazyPage Component={PrivacyPolicy} />}
          /> */}
          {/* <Route
            path="/pages/terms-and-conditions"
            element={<LazyPage Component={TermsAndConditionsPage} />}
          /> */}
          {/* <Route
            path="/pages/shipping-policy"
            element={<LazyPage Component={ShippingPolicy} />}
          /> */}
          {/* <Route
            path="/pages/return-refund-policy"
            element={<LazyPage Component={ReturnRefundPolicy} />}
          /> */}
          <Route
            path="/wishlist"
            element={<LazyPage Component={WishlistPage} />}
          />
          {/* ─── 6. PROTECTED PAGES (Still inside UserLayout) ──────── */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/notifications"
              element={<LazyPage Component={NotificationPreferencesPage} />}
            />
          </Route>

          {/* 404 (Last inside UserLayout) */}
          <Route path="*" element={<NotFoundWithMeta />} />
        </Route>

        {/* ─── 7. PROTECTED SUB-ROUTERS (Own Full-Screen Layouts) ────── */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/user/*"
            element={<LazySubRouter Component={AccountRoutes} />}
          />
          <Route
            path="/checkout/*"
            element={<LazySubRouter Component={CheckoutRoutes} />}
          />
        </Route>

        {/* ─── 8. SINGLE PRODUCT CHECKOUT (Catch-all, must stay last) ─── */}
        <Route
          path="/:productSlug"
          element={
            <Suspense fallback={<InlineLoader />}>
              <SingleItemCheckout />
            </Suspense>
          }
        />
      </Routes>
    ),
    [],
  );

  return (
    <>
      <ScrollToTop />
      {memoizedRoutes}
    </>
  );
};

export default AppRoutes;
