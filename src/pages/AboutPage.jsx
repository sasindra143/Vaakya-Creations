import { useEffect } from "react";
import "./AboutPage.css";

function AboutPage() {

  /* ==========================================
     SCROLL REVEAL ANIMATION
  ========================================== */
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-wrapper">

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="about-hero">

        <div className="hero-content reveal">
          <h1>
            Elegance. Tradition. Confidence.
          </h1>

          <p>
            Vaakya Creations is a women-focused fashion brand dedicated to
            premium sarees, modern ethnic wear, and elegant festive collections.
            Every design is crafted to celebrate femininity, strength,
            and timeless beauty.
          </p>
        </div>

      </section>

      {/* ==========================================
          BRAND STORY
      ========================================== */}
      <section className="about-section">

        <div className="about-text reveal">
          <span className="section-label">
            OUR STORY
          </span>

          <h2>
            Built For Women Who Define Grace
          </h2>

          <p>
            Vaakya Creations was founded with a vision to redefine
            traditional Indian wear for modern women.
          </p>

          <p>
            We specialize exclusively in ladies fashion —
            premium silk pattu sarees, bridal collections,
            festive wear, and designer ethnic outfits.
          </p>

          <p>
            Our collections blend heritage craftsmanship with
            contemporary design — creating pieces that empower
            women to feel confident, elegant, and unforgettable.
          </p>
        </div>

        <div className="about-image reveal">
          <img
            src="https://res.cloudinary.com/dvknx0hpm/image/upload/v1771217490/imana-9cWnh9nGBPI-unsplash_noahhb.jpg"
            alt="Women Fashion"
          />
        </div>

      </section>

      {/* ==========================================
          BRANDING & DESIGN PHILOSOPHY
      ========================================== */}
      <section className="about-section reverse">

        <div className="about-image reveal">
          <img
            src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"
            alt="Saree Branding"
          />
        </div>

        <div className="about-text reveal">
          <span className="section-label">
            BRAND PHILOSOPHY
          </span>

          <h2>
            Designed With Purpose
          </h2>

          <p>
            At Vaakya Creations, fashion is not just clothing —
            it is identity.
          </p>

          <p>
            Our branding represents purity, strength,
            grace, and cultural pride.
          </p>

          <p>
            Each saree is handpicked with attention to
            texture, zari detailing, color harmony,
            and fabric richness.
          </p>

          <p>
            We focus exclusively on women’s fashion —
            ensuring every collection reflects sophistication
            and modern femininity.
          </p>
        </div>

      </section>

      {/* ==========================================
          AWARD SECTION
      ========================================== */}
      <section className="award-section reveal">

        <div className="award-text">
          <h2>Recognition & Achievement</h2>

          <p>
            Vaakya Creations was honored at a prestigious
            stall competition held in Vijayawada.
          </p>

          <p>
            We are more than just a clothing brand — we represent style, confidence, and ambition. Our journey began with a simple goal: to create high-quality, fashionable clothing that blends comfort with modern design.

Every collection is crafted with precision, premium fabrics, and attention to detail. We focus on delivering trend-driven yet timeless styles that suit every occasion — from casual wear to elegant statement outfits.

Our dedication and consistent quality have earned us state-level recognition. We are honored to have received a major award from 
            <strong> Sri  N. Chandrababu Naidu, Honorable Chief Minister of Andhra Pradesh, along with his wife Nara Bhuvaneswari. </strong>
           This achievement stands as a milestone in our journey and motivates us to continue striving for excellence.

Customer satisfaction remains our top priority. We are committed to delivering exceptional quality, reliable service, and a seamless shopping experience.

We believe great fashion should be accessible, affordable, and empowering.
          </p>

          <p>
            This recognition strengthened our commitment
            to deliver world-class women’s fashion across India.
          </p>
        </div>

        <div className="award-image">
          <img
            src="https://res.cloudinary.com/dvknx0hpm/image/upload/v1771306536/WhatsApp_Image_2026-02-17_at_10.59.14_i1eizz.jpg"
            alt="Award Ceremony"
          />
        </div>

      </section>

      {/* ==========================================
          CORE VALUES
      ========================================== */}
      <section className="values-section">

        <h2 className="reveal">
          Why Women Choose Vaakya Creations
        </h2>

        <div className="values-grid">

          <div className="value-card reveal">
            <h3>Premium Silk Quality</h3>
            <p>
              Hand-selected fabrics with rich finishing and
              long-lasting durability.
            </p>
          </div>

          <div className="value-card reveal">
            <h3>Exclusive Ladies Collection</h3>
            <p>
              Designed exclusively for women —
              no compromise in elegance.
            </p>
          </div>

          <div className="value-card reveal">
            <h3>Trusted Brand</h3>
            <p>
              Award-winning recognition and customer trust.
            </p>
          </div>

          <div className="value-card reveal">
            <h3>Modern Ethnic Fusion</h3>
            <p>
              Traditional craftsmanship blended with
              contemporary styling.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default AboutPage;