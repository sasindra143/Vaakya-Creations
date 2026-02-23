/**
 * src/components/ProductCard/ProductSkeleton.jsx
 * Animated skeleton loader that matches ProductCard layout
 */

import "./ProductSkeleton.css";

function ProductSkeleton() {
  return (
    <div className="sk-card" aria-hidden="true">

      {/* Image skeleton */}
      <div className="sk-image">
        <div className="sk-shine" />
      </div>

      {/* Info skeleton */}
      <div className="sk-info">

        {/* Category line */}
        <div className="sk-line sk-cat" />

        {/* Title — two lines */}
        <div className="sk-line sk-title-1" />
        <div className="sk-line sk-title-2" />

        {/* Rating dots */}
        <div className="sk-rating">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="sk-star" />
          ))}
          <div className="sk-line sk-rating-num" />
        </div>

        {/* Price */}
        <div className="sk-price-row">
          <div className="sk-line sk-price" />
          <div className="sk-line sk-old-price" />
        </div>

        {/* Size buttons */}
        <div className="sk-sizes">
          {[1,2,3].map(i => <div key={i} className="sk-size" />)}
        </div>

        {/* Button */}
        <div className="sk-line sk-btn" />

      </div>
    </div>
  );
}

export default ProductSkeleton;