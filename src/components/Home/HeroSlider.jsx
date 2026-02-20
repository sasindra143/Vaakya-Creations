/**
 * Hero Slider Component
 * @description Enterprise-grade carousel with auto-play, keyboard navigation, and accessibility
 * @author Senior Developer
 * @version 2.0.0
 */

import { useEffect, useState, useCallback, useRef, memo } from "react";
import heroSlides from "./heroData";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const AUTO_PLAY_INTERVAL = 5000;
  const MIN_SWIPE_DISTANCE = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === heroSlides.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroSlides.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < heroSlides.length) {
      setCurrentIndex(index);
    }
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, nextSlide]);

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
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide]);

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
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  const handleShopNowClick = (slide) => {
    if (window.gtag) {
      window.gtag('event', 'hero_cta_click', {
        slide_id: slide.id,
        slide_title: slide.title,
        slide_category: slide.category
      });
    }

    console.log(`Navigating to shop: ${slide.category}`);
  };

  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % heroSlides.length;
      const prevIndex = currentIndex === 0 ? heroSlides.length - 1 : currentIndex - 1;

      [nextIndex, prevIndex].forEach((index) => {
        const img = new Image();
        img.src = heroSlides[index].image;
      });
    };

    preloadImages();
  }, [currentIndex]);

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
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : "auto"}
          />

          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">
                {slide.title}
              </h1>
              <p className="hero-subtitle">
                {slide.subtitle}
              </p>
              <button
                className="hero-btn"
                onClick={() => handleShopNowClick(slide)}
                aria-label={`Shop ${slide.title} collection`}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        className="hero-arrow left"
        onClick={prevSlide}
        aria-label="Previous slide"
        type="button"
      >
        &#10094;
      </button>

      <button
        className="hero-arrow right"
        onClick={nextSlide}
        aria-label="Next slide"
        type="button"
      >
        &#10095;
      </button>

      <div className="hero-dots" role="tablist" aria-label="Slide navigation">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-controls={`slide-${slide.id}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
};

export default memo(HeroSlider);
