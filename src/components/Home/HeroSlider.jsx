/**
 * HeroSlider.jsx
 * @description Enterprise-grade hero carousel with:
 *   - Auto-play with progress bar
 *   - Keyboard navigation (←  → Home End Space)
 *   - Touch / swipe support
 *   - Pause on hover / focus
 *   - Slide counter
 *   - Decorative SVG motif
 *   - Dual CTA per slide
 *   - Badge / eyebrow label
 *   - Split title with italic accent
 *   - Full ARIA accessibility
 *   - Image preloading for adjacent slides
 * @version 3.0.0
 */

import { useEffect, useState, useCallback, useRef, memo } from "react";
import heroSlides from "./heroData";
import "./HeroSlider.css";

/* ── Inline SVG: Arrow icon ─────────────────────────────────── */
const IconArrow = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 8h10M8 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Inline SVG: Rotating paisley-inspired motif ────────────── */
const DecorativeMotif = () => (
  <svg
    className="hero-motif"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    {/* Outer ring */}
    <circle cx="50" cy="50" r="47" stroke="#c9a84c" strokeWidth="0.9" />
    {/* Dashed middle ring */}
    <circle
      cx="50"
      cy="50"
      r="37"
      stroke="#c9a84c"
      strokeWidth="0.6"
      strokeDasharray="3.5 3"
    />
    {/* Inner fill dot */}
    <circle cx="50" cy="50" r="7" fill="#c9a84c" opacity="0.55" />
    {/* Vertical petal */}
    <path
      d="M50 4 C64 20 68 38 58 50 C68 62 64 80 50 96 C36 80 32 62 42 50 C32 38 36 20 50 4Z"
      stroke="#c9a84c"
      strokeWidth="0.75"
      fill="none"
      opacity="0.45"
    />
    {/* Horizontal petal */}
    <path
      d="M4 50 C20 36 38 32 50 42 C62 32 80 36 96 50 C80 64 62 68 50 58 C38 68 20 64 4 50Z"
      stroke="#c9a84c"
      strokeWidth="0.75"
      fill="none"
      opacity="0.45"
    />
    {/* Cardinal dots */}
    <circle cx="50" cy="4"  r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="50" cy="96" r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="4"  cy="50" r="2" fill="#c9a84c" opacity="0.6" />
    <circle cx="96" cy="50" r="2" fill="#c9a84c" opacity="0.6" />
  </svg>
);

/* ════════════════════════════════════════════════════════════
   Main HeroSlider Component
   ════════════════════════════════════════════════════════════ */
const HeroSlider = () => {
  /* ── State ───────────────────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused,     setIsPaused]     = useState(false);
  const [touchStart,   setTouchStart]   = useState(null);
  const [touchEnd,     setTouchEnd]     = useState(null);

  /* ── Refs ────────────────────────────────────────────────── */
  const sliderRef    = useRef(null);
  const autoPlayRef  = useRef(null);

  /* ── Constants ───────────────────────────────────────────── */
  const AUTO_PLAY_INTERVAL = 5000;   // ms
  const MIN_SWIPE_DISTANCE = 50;     // px

  /* ── Navigation helpers ──────────────────────────────────── */
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  }, []);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < heroSlides.length) {
      setCurrentIndex(index);
    }
  }, []);

  /* ── Auto-play effect ────────────────────────────────────── */
  useEffect(() => {
    if (isPaused) {
      clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, nextSlide]);

  /* ── Keyboard navigation effect ──────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextSlide();
          break;
        case "Home":
          event.preventDefault();
          goToSlide(0);
          break;
        case "End":
          event.preventDefault();
          goToSlide(heroSlides.length - 1);
          break;
        case " ":
          // Space bar toggles pause
          event.preventDefault();
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide]);

  /* ── Touch / swipe handlers ──────────────────────────────── */
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe  = distance >  MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;
    if (isLeftSwipe)  nextSlide();
    if (isRightSwipe) prevSlide();
  };

  /* ── Pause / resume handlers ─────────────────────────────── */
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus      = () => setIsPaused(true);
  const handleBlur       = () => setIsPaused(false);

  /* ── CTA analytics + navigation ─────────────────────────── */
  const handleShopNowClick = (slide) => {
    if (window.gtag) {
      window.gtag("event", "hero_cta_click", {
        slide_id:       slide.id,
        slide_title:    slide.title,
        slide_category: slide.category,
        cta_type:       "shop_now",
      });
    }
    console.log(`[HeroSlider] Navigate → /category/${slide.slug}`);
    // TODO: integrate with your router:
    //   navigate(`/category/${slide.slug}`);
  };

  const handleExploreLookbook = (slide) => {
    if (window.gtag) {
      window.gtag("event", "hero_cta_click", {
        slide_id:       slide.id,
        slide_title:    slide.title,
        slide_category: slide.category,
        cta_type:       "explore_lookbook",
      });
    }
    console.log(`[HeroSlider] Navigate → /lookbook/${slide.slug}`);
    // TODO: navigate(`/lookbook/${slide.slug}`);
  };

  /* ── Preload adjacent slide images ──────────────────────── */
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % heroSlides.length;
    const prevIdx = currentIndex === 0
      ? heroSlides.length - 1
      : currentIndex - 1;

    [nextIdx, prevIdx].forEach((i) => {
      const img = new Image();
      img.src = heroSlides[i].image;
    });
  }, [currentIndex]);

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <section
      ref={sliderRef}
      className="hero-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Image Carousel"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
    >

      {/* ── Decorative rotating mandala motif ──────────────── */}
      <DecorativeMotif />

      {/* ── Pause / play keyboard hint ─────────────────────── */}
      <p className="hero-pause-hint" aria-hidden="true">
        {isPaused
          ? "⏸ Paused — press Space to resume"
          : "⏵ Auto-playing — hover or press Space to pause"}
      </p>

      {/* ════════════════════════════════════════════════════
          SLIDES
          ════════════════════════════════════════════════════ */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          id={`hero-slide-${slide.id}`}
          className={`hero-slide${index === currentIndex ? " active" : ""}`}
          aria-hidden={index !== currentIndex}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${heroSlides.length}: ${slide.title}`}
        >
          {/* Slide image */}
          <img
            className="hero-slide__img"
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : "auto"}
          />

          {/* Gradient overlay + content */}
          <div className="hero-slide__overlay">
            <div className="hero-content">

              {/* Eyebrow badge — only render when present */}
              {slide.badge && (
                <p className="hero-badge">
                  {slide.badge}
                </p>
              )}

              {/* Heading — split into two lines with italic accent */}
              <h1 className="hero-title">
                {slide.titleLine1 ? (
                  <>
                    {slide.titleLine1}{" "}
                    <em>{slide.titleLine2}</em>
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle">{slide.subtitle}</p>

              {/* Dual CTA */}
              <div className="hero-cta-group">
                <button
                  className="hero-btn"
                  type="button"
                  onClick={() => handleShopNowClick(slide)}
                  aria-label={`Shop the ${slide.title} collection`}
                >
                  <span className="hero-btn__text">Shop Now</span>
                  <span className="hero-btn__icon">
                    <IconArrow />
                  </span>
                </button>

                <button
                  className="hero-link"
                  type="button"
                  onClick={() => handleExploreLookbook(slide)}
                  aria-label={`Explore the ${slide.title} lookbook`}
                >
                  Explore Lookbook
                </button>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* ── Previous / Next arrows ──────────────────────────── */}
      <button
        className="hero-arrow left"
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>

      <button
        className="hero-arrow right"
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* ── Dot navigation ─────────────────────────────────── */}
      <div
        className="hero-dots"
        role="tablist"
        aria-label="Slide navigation"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`hero-dot${index === currentIndex ? " active" : ""}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-controls={`hero-slide-${slide.id}`}
          />
        ))}
      </div>

      {/* ── Slide counter ──────────────────────────────────── */}
      <div className="hero-counter" aria-hidden="true">
        <span className="hero-counter__current">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="hero-counter__sep">/</span>
        <span className="hero-counter__total">
          {String(heroSlides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Auto-play progress bar — re-mounts on slide change ─ */}
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