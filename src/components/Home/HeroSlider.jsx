/**
 * HeroSlider.jsx  —  Vaakya Creations
 * @description  Enterprise-grade hero carousel with 10 category slides.
 *   - Auto-play (5 s) with animated progress bar
 *   - Keyboard navigation: ← → Home End Space
 *   - Touch / swipe (mobile)
 *   - Pause on hover & focus
 *   - react-router-dom navigate() on "Shop Now"  → /category/:slug
 *   - Slide counter + dot nav
 *   - Dynamic per-slide accent colour
 *   - ARIA fully accessible
 *   - Adjacent-image preloading
 * @version 4.0.0
 */

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import heroSlides from "./heroData";
import "./HeroSlider.css";

/* ─────────────────────────────────────────────
   Inline SVG icons (zero external deps)
───────────────────────────────────────────── */

const IconChevronRight = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconChevronLeft = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconArrow = () => (
  <svg
    width="14" height="14" viewBox="0 0 16 16"
    fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
  >
    <line x1="2" y1="8" x2="13" y2="8" />
    <polyline points="8 3 13 8 8 13" />
  </svg>
);

/* Decorative rotating mandala */
const DecorativeMotif = () => (
  <svg
    className="hero-motif"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="50" cy="50" r="47" stroke="#c9a84c" strokeWidth="0.9" />
    <circle cx="50" cy="50" r="37" stroke="#c9a84c" strokeWidth="0.6" strokeDasharray="3.5 3" />
    <circle cx="50" cy="50" r="7" fill="#c9a84c" opacity="0.55" />
    <path
      d="M50 4 C64 20 68 38 58 50 C68 62 64 80 50 96 C36 80 32 62 42 50 C32 38 36 20 50 4Z"
      stroke="#c9a84c" strokeWidth="0.75" fill="none" opacity="0.45"
    />
    <path
      d="M4 50 C20 36 38 32 50 42 C62 32 80 36 96 50 C80 64 62 68 50 58 C38 68 20 64 4 50Z"
      stroke="#c9a84c" strokeWidth="0.75" fill="none" opacity="0.45"
    />
    <circle cx="50" cy="4"  r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="50" cy="96" r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="4"  cy="50" r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="96" cy="50" r="2" fill="#c9a84c" opacity="0.6" />
  </svg>
);

/* ═══════════════════════════════════════════════
   HeroSlider — main component
═══════════════════════════════════════════════ */
const HeroSlider = () => {
  const navigate = useNavigate();

  /* ── State ── */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused,     setIsPaused]     = useState(false);
  const [isTransiting, setIsTransiting] = useState(false);
  const [touchStart,   setTouchStart]   = useState(null);
  const [touchEnd,     setTouchEnd]     = useState(null);

  /* ── Refs ── */
  const autoPlayRef  = useRef(null);
  const sliderRef    = useRef(null);

  /* ── Constants ── */
  const INTERVAL         = 5000;
  const MIN_SWIPE        = 50;
  const TRANSITION_GUARD = 1000; // prevent rapid spam clicks

  /* ──────────────────────────────────────────
     Navigation helpers
  ────────────────────────────────────────── */
  const goTo = useCallback((index) => {
    if (isTransiting) return;
    const clamped = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
    setIsTransiting(true);
    setCurrentIndex(clamped);
    setTimeout(() => setIsTransiting(false), TRANSITION_GUARD);
  }, [isTransiting]);

  const nextSlide = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const prevSlide = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  /* ──────────────────────────────────────────
     Auto-play
  ────────────────────────────────────────── */
  useEffect(() => {
    if (isPaused) {
      clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(nextSlide, INTERVAL);
    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, nextSlide]);

  /* ──────────────────────────────────────────
     Keyboard navigation
  ────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); prevSlide();                    break;
        case "ArrowRight": e.preventDefault(); nextSlide();                    break;
        case "Home":       e.preventDefault(); goTo(0);                        break;
        case "End":        e.preventDefault(); goTo(heroSlides.length - 1);    break;
        case " ":          e.preventDefault(); setIsPaused((p) => !p);         break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, goTo]);

  /* ──────────────────────────────────────────
     Adjacent image preloading
  ────────────────────────────────────────── */
  useEffect(() => {
    const len  = heroSlides.length;
    const next = (currentIndex + 1) % len;
    const prev = (currentIndex - 1 + len) % len;
    [next, prev].forEach((i) => {
      const img = new Image();
      img.src = heroSlides[i].image;
    });
  }, [currentIndex]);

  /* ──────────────────────────────────────────
     Touch / swipe
  ────────────────────────────────────────── */
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd  = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist >  MIN_SWIPE) nextSlide();
    if (dist < -MIN_SWIPE) prevSlide();
  };

  /* ──────────────────────────────────────────
     CTA handlers — navigate to category page
  ────────────────────────────────────────── */
  const handleShopNow = (slide) => {
    navigate(`/category/${slide.slug}`);
  };

  const handleExploreLookbook = (slide) => {
    navigate(`/category/${slide.slug}`);
  };

  /* ──────────────────────────────────────────
     Current slide data
  ────────────────────────────────────────── */
  const slide = heroSlides[currentIndex];

  /* ──────────────────────────────────────────
     Render
  ────────────────────────────────────────── */
  return (
    <section
      ref={sliderRef}
      className="hero-slider"
      style={{ "--hs-slide-accent": slide.accent }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Vaakya Creations — Hero Image Carousel"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
    >

      {/* ── Decorative rotating mandala ── */}
      <DecorativeMotif />

      {/* ── Keyboard hint ── */}
      <p className="hero-pause-hint" aria-hidden="true">
        {isPaused
          ? "⏸ Paused — press Space to resume"
          : "⏵ Auto-playing — hover or press Space to pause"}
      </p>

      {/* ══════════════════════════════════════
          SLIDES
      ══════════════════════════════════════ */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          id={`hero-slide-${s.id}`}
          className={`hero-slide${index === currentIndex ? " active" : ""}`}
          aria-hidden={index !== currentIndex}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${heroSlides.length}: ${s.category}`}
        >
          {/* ── Background image (desktop) ── */}
          <img
            className="hero-slide__img hero-slide__img--desktop"
            src={s.image}
            alt={s.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : "auto"}
          />

          {/* ── Background image (mobile portrait) ── */}
          <img
            className="hero-slide__img hero-slide__img--mobile"
            src={s.mobileImage}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            aria-hidden="true"
          />

          {/* ── Gradient overlay + content ── */}
          <div className="hero-slide__overlay">
            <div className="hero-content">

              {/* Eyebrow badge */}
              {s.badge && (
                <p className="hero-badge" aria-label={`Collection: ${s.badge}`}>
                  {s.badge}
                </p>
              )}

              {/* Heading */}
              <h2 className="hero-title">
                <span className="hero-title__line1">{s.titleLine1}</span>
                {" "}
                <em className="hero-title__accent">{s.titleLine2}</em>
              </h2>

              {/* Subtitle */}
              <p className="hero-subtitle">{s.subtitle}</p>

              {/* CTA row */}
              <div className="hero-cta-group">

                {/* Primary — Shop Now → /category/:slug */}
                <button
                  className="hero-btn"
                  type="button"
                  onClick={() => handleShopNow(s)}
                  aria-label={`Shop the ${s.category} collection`}
                >
                  <span className="hero-btn__text">Shop Now</span>
                  <span className="hero-btn__icon"><IconArrow /></span>
                </button>

                {/* Secondary — Explore Lookbook */}
                <button
                  className="hero-link"
                  type="button"
                  onClick={() => handleExploreLookbook(s)}
                  aria-label={`Browse all ${s.category}`}
                >
                  Explore Collection
                </button>

              </div>
            </div>
          </div>

          {/* Per-slide category tag — bottom-right (desktop only) */}
          <div className="hero-slide__tag" aria-hidden="true">
            {s.category}
          </div>

        </div>
      ))}

      {/* ── Prev arrow ── */}
      <button
        className="hero-arrow hero-arrow--left"
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        disabled={isTransiting}
      >
        <IconChevronLeft />
      </button>

      {/* ── Next arrow ── */}
      <button
        className="hero-arrow hero-arrow--right"
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        disabled={isTransiting}
      >
        <IconChevronRight />
      </button>

      {/* ── Dot navigation ── */}
      <div
        className="hero-dots"
        role="tablist"
        aria-label="Slide navigation"
      >
        {heroSlides.map((s, index) => (
          <button
            key={s.id}
            type="button"
            className={`hero-dot${index === currentIndex ? " active" : ""}`}
            onClick={() => goTo(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}: ${s.category}`}
            aria-controls={`hero-slide-${s.id}`}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="hero-counter" aria-hidden="true">
        <span className="hero-counter__current">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="hero-counter__sep"> / </span>
        <span className="hero-counter__total">
          {String(heroSlides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Auto-play progress bar (re-mounts on slide/pause change) ── */}
      <div
        key={`progress-${currentIndex}-${isPaused}`}
        className={`hero-progress${isPaused ? " paused" : ""}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Slide auto-play progress"
        aria-hidden="true"
      />

    </section>
  );
};

export default memo(HeroSlider);