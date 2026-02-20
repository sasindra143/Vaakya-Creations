import { useState, useEffect } from "react";
import "./Testimonials.css";
import testimonialsData from "./testimonialsData";

function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  // Autoplay every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentData = testimonialsData[current];

  return (
    <section className="testimonials">
      <div className="testimonial-header">
        <h2>What Our Customers Say</h2>
        <p>
          Real experiences from women who trust our ladies clothing showroom
          for quality, elegance, and style.
        </p>
      </div>

      <div className="testimonial-slider">
        <button className="nav-btn left" onClick={prevSlide}>
          ‹
        </button>

        <div className="testimonial-card">
          <div className="profile">
            <img src={currentData.image} alt={currentData.name} />
            <div>
              <h4>{currentData.name}</h4>
              <div className="stars">
                {"★".repeat(currentData.rating)}
                {"☆".repeat(5 - currentData.rating)}
              </div>
            </div>
          </div>

          <p className="review">“{currentData.review}”</p>
        </div>

        <button className="nav-btn right" onClick={nextSlide}>
          ›
        </button>
      </div>
    </section>
  );
}

export default Testimonials;