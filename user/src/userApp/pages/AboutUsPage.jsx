import React from "react";
import { Helmet } from "react-helmet-async";

export default function OurStory() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mnmukt.com/#organization",
        name: "Mnmukt",
        url: "https://mnmukt.com/",
        logo: {
          "@type": "ImageObject",
          "@id": "https://mnmukt.com/#logo",
          url: "https://mnmukt.com/appLogo.png",
        },
        description:
          "Mnmukt is an Indian fashion brand creating premium ethnic wear and handcrafted cotton clothing for women.",
      },
      {
        "@type": "WebPage",
        "@id": "https://mnmukt.com/our-story/#webpage",
        url: "https://mnmukt.com/our-story",
        name: "Our Story | Mnmukt – Premium Ethnic Wear",
        description:
          "Discover Mnmukt's story — an Indian fashion brand crafting premium ethnic wear and handcrafted cotton clothing for women who value comfort, sustainability, and timeless style.",
        isPartOf: { "@id": "https://mnmukt.com/#website" },
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Helmet>
        {/* Primary SEO */}
        <title>Our Story | Mnmukt – Premium Ethnic Wear</title>
        <meta
          name="description"
          content="Discover Mnmukt's story — an Indian fashion brand crafting premium ethnic wear and handcrafted cotton clothing for women who value comfort, sustainability, and timeless style."
        />
        <link rel="canonical" href="https://mnmukt.com/our-story" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mnmukt.com/our-story" />
        <meta
          property="og:title"
          content="Our Story | Mnmukt – Premium Ethnic Wear"
        />
        <meta
          property="og:description"
          content="Discover Mnmukt's story — an Indian fashion brand crafting premium ethnic wear and handcrafted cotton clothing for women."
        />
        <meta property="og:image" content="https://mnmukt.com/appLogo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mnmukt.com/our-story" />
        <meta
          name="twitter:title"
          content="Our Story | Mnmukt – Premium Ethnic Wear"
        />
        <meta
          name="twitter:description"
          content="Discover Mnmukt's story — an Indian fashion brand crafting premium ethnic wear and handcrafted cotton clothing for women."
        />
        <meta name="twitter:image" content="https://mnmukt.com/appLogo.png" />

        {/* Structured Data / JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="relative w-full">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff7fa_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex mb-8">
            <ol className="flex items-center space-x-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-400">
              <li>
                <a href="/" className="hover:text-[#da127d] transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-[#da127d]" aria-current="page">
                Our Story
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <header className="text-center mb-16 md:mb-24">
            <span className="text-[#da127d] uppercase tracking-[0.25em] text-[10px] md:text-[11px] font-medium">
              Our Roots
            </span>
            <h1 className="text-[28px] md:text-[40px] font-medium text-[#1a1a1a] mt-3 tracking-[0.01em]">
              Our Story
            </h1>
            <p className="mt-4 text-[13px] md:text-[16px] text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
              The journey of Mnmukt, a premium ethnic wear brand built on
              natural fabrics, handcrafted detail, and everyday comfort.
            </p>
          </header>

          {/* Content Sections */}
          <div className="space-y-20 md:space-y-32">
            {[
              {
                title: "About Mnmukt",
                text: "At Mnmukt, fashion is more than what you wear — it's how you feel in it. We design for women who appreciate chic simplicity and curated comfort. Every piece in our collection is designed to be an extension of your everyday life, blending contemporary Indian fashion with the timeless appeal of natural cotton.",
                img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Our Journey",
                text: "From our first capsule collection to the expansive range of new arrivals we release today, our journey has been guided by one question: how can we make women feel more confident in what they wear? By bridging the gap between traditional Indian aesthetics and modern utility, we've created a wardrobe that truly breathes.",
                img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Empowering Artisans",
                text: "The soul of Mnmukt lies in the hands of our master craftsmen and weavers. By collaborating directly with local artisan communities across India, we help preserve ancient weaving, block-printing, and embroidery techniques. Every garment carries a human touch and tells a story of generations of skill.",
                img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
              },
            ].map((section, idx) => (
              <section
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div
                  className={`flex justify-center ${
                    idx % 2 === 1 ? "md:order-2" : "md:order-1"
                  }`}>
                  <img
                    src={section.img}
                    alt={section.title}
                    loading="lazy"
                    className="w-full max-w-[450px] aspect-[4/5] object-cover rounded-sm border border-gray-100/50 shadow-sm"
                  />
                </div>
                <article
                  className={`text-center md:text-left ${
                    idx % 2 === 1 ? "md:order-1" : "md:order-2"
                  }`}>
                  <h2 className="text-[20px] md:text-[28px] font-medium text-[#1a1a1a] mb-6">
                    {section.title}
                  </h2>
                  <p className="text-[13px] md:text-[15px] text-[#6b6b6b] leading-relaxed">
                    {section.text}
                  </p>
                </article>
              </section>
            ))}
          </div>

          {/* Philosophy Section */}
          <section className="mt-24 md:mt-32">
            <h2 className="text-center text-[20px] md:text-[28px] font-medium text-[#1a1a1a] mb-12">
              What We Believe In
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Handcrafted Excellence",
                  desc: "Honouring traditional craftsmanship with intricate artisanal detailing.",
                },
                {
                  title: "Everyday Elegance",
                  desc: "Versatile, breathable pieces that move effortlessly with you from morning to night.",
                },
                {
                  title: "Conscious Fashion",
                  desc: "Using natural, skin-friendly fabrics for a kinder environmental footprint.",
                },
              ].map((belief, idx) => (
                <div
                  key={idx}
                  className="bg-[#F9F5F6] p-8 text-center border border-gray-100/50 transition-transform hover:-translate-y-1 duration-300">
                  <h3 className="text-[14px] font-semibold uppercase tracking-widest text-[#da127d] mb-4">
                    {belief.title}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-[#6b6b6b] leading-relaxed">
                    {belief.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sustainability / Fabric Focus */}
          <section className="mt-20 md:mt-32 text-center max-w-3xl mx-auto px-4">
            <span className="text-[#da127d] uppercase tracking-[0.25em] text-[10px] md:text-[11px] font-medium">
              Sustainable Choice
            </span>
            <h2 className="text-[20px] md:text-[28px] font-medium text-[#1a1a1a] mt-3 mb-6">
              Rooted in Pure Cotton
            </h2>
            <p className="text-[13px] md:text-[15px] text-[#6b6b6b] leading-relaxed">
              We believe that true luxury lies in comfort and sustainability.
              That is why Mnmukt champions pure, handloom cottons and breathable
              natural fibers. Our commitment to eco-conscious fashion means
              producing small batches, minimizing waste, and celebrating fabrics
              that are gentle on both your skin and the earth.
            </p>
          </section>

          {/* CTA Footer */}
          <div className="mt-16 md:mt-24 text-center pb-10">
            <a
              href="/collections"
              className="inline-block px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] border border-[#da127d] text-[#da127d] hover:bg-[#da127d] hover:text-white transition-all duration-300">
              Explore Collections
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
