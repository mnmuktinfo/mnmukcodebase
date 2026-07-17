import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// Adjust this import path to point to your actual config file location
import { CONFIG, BRAND_PINK } from "../../config/AppConfig";

const CookiePolicy = () => {
  return (
    <>
      {/* ── SEO TAGS ── */}
      <Helmet>
        <title>Cookie Policy | {CONFIG.BRAND_NAME}</title>
        <meta
          name="description"
          content={`Read the Cookie Policy for ${CONFIG.BRAND_NAME}. Learn how we use cookies and similar technologies to enhance your shopping experience.`}
        />
        <meta name="robots" content="index, follow" />
        {/* Replace with your actual live domain later */}
        <link rel="canonical" href="https://yourdomain.com/cookie-policy" />

        {/* Open Graph Tags for Social Sharing */}
        <meta
          property="og:title"
          content={`Cookie Policy | ${CONFIG.BRAND_NAME}`}
        />
        <meta
          property="og:description"
          content={`Understand how ${CONFIG.BRAND_NAME} uses cookies to improve your experience.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={CONFIG.BRAND_NAME} />
      </Helmet>

      {/* ── PAGE CONTENT ── */}
      <main className="w-full bg-white min-h-screen pb-16">
        {/* Header Banner */}
        <header className="bg-gray-50 py-12 md:py-16 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-500 text-sm">Last Updated: July 2026</p>
          </div>
        </header>

        {/* Policy Content */}
        <article className="max-w-3xl mx-auto px-4 md:px-6 mt-10 md:mt-16 text-gray-700 font-sans">
          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-8">
              This Cookie Policy explains how{" "}
              <strong>{CONFIG.BRAND_NAME}</strong> uses cookies and similar
              technologies to recognize you when you visit our website. It
              explains what these technologies are and why we use them, as well
              as your rights to control our use of them.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
              1. What are cookies?
            </h2>
            <p className="text-base leading-relaxed mb-6">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
              2. Why do we use cookies?
            </h2>
            <p className="text-base leading-relaxed mb-4">
              We use first-party and third-party cookies for several reasons.
              Some cookies are required for technical reasons in order for our
              website to operate, and we refer to these as "essential" or
              "strictly necessary" cookies. Other cookies enable us to track and
              target the interests of our users to enhance the experience on our
              online properties.
            </p>
            <ul className="list-disc pl-5 space-y-3 mb-6 text-base leading-relaxed">
              <li>
                <strong className="text-gray-900">Essential Cookies:</strong>{" "}
                These are strictly necessary to provide you with services
                available through our website and to use some of its features,
                such as access to secure areas (like your shopping cart or
                account).
              </li>
              <li>
                <strong className="text-gray-900">
                  Performance and Functionality Cookies:
                </strong>{" "}
                These are used to enhance the performance and functionality of
                our website but are non-essential to their use. However, without
                these cookies, certain functionality may become unavailable.
              </li>
              <li>
                <strong className="text-gray-900">
                  Analytics and Customization Cookies:
                </strong>{" "}
                These cookies collect information that is used either in
                aggregate form to help us understand how our website is being
                used or how effective our marketing campaigns are, or to help us
                customize our website for you.
              </li>
              <li>
                <strong className="text-gray-900">Advertising Cookies:</strong>{" "}
                These cookies are used to make advertising messages more
                relevant to you. They perform functions like preventing the same
                ad from continuously reappearing, ensuring that ads are properly
                displayed for advertisers, and in some cases selecting
                advertisements that are based on your interests.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
              3. How can I control cookies?
            </h2>
            <p className="text-base leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies.
              You can set or amend your web browser controls to accept or refuse
              cookies. If you choose to reject cookies, you may still use our
              website though your access to some functionality and areas of our
              website may be restricted.
            </p>
            <p className="text-base leading-relaxed mb-6">
              To learn how to manage cookies on popular browsers, please visit
              the browser's developer documentation (e.g., Google Chrome,
              Mozilla Firefox, Apple Safari, Microsoft Edge).
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
              4. Changes to this Cookie Policy
            </h2>
            <p className="text-base leading-relaxed mb-6">
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal, or regulatory reasons. Please therefore
              re-visit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
              5. Contact Us
            </h2>
            <p className="text-base leading-relaxed mb-6">
              If you have any questions about our use of cookies or other
              technologies, please contact us at:
            </p>

            {/* Dynamic Contact Box Using CONFIG */}
            <address className="bg-gray-50 p-6 rounded-lg border border-gray-100 not-italic">
              <p className="text-base text-gray-800 space-y-1">
                <span className="block">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${CONFIG.contact.email}`}
                    style={{ color: BRAND_PINK }}
                    className="hover:underline transition-all">
                    {CONFIG.contact.email}
                  </a>
                </span>
                <span className="block">
                  <strong>Phone:</strong> {CONFIG.contact.phoneDisplay}{" "}
                  <span className="text-sm text-gray-500">
                    {CONFIG.contact.phoneNote}
                  </span>
                </span>
                <span className="block">
                  <strong>Address:</strong> {CONFIG.siteInfo.address}
                </span>
                <span className="block mt-2 pt-2 border-t border-gray-200 text-sm text-gray-500">
                  Support Hours: {CONFIG.contact.supportHours}
                </span>
              </p>
            </address>

            <div className="mt-12 text-center">
              <Link
                to="/"
                style={{ backgroundColor: BRAND_PINK }}
                className="inline-flex items-center justify-center text-white text-sm font-medium py-3 px-8 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]">
                Return to Homepage
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default CookiePolicy;
