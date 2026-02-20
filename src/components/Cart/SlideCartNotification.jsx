import "./SlideCartNotification.css";

function SlideCartNotification({ product }) {

  return (
    <div className="slide-cart">
      ✓ {product.name} added to cart
    </div>
  );
}

export default SlideCartNotification;