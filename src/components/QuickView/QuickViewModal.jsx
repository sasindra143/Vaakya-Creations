import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./QuickView.css";

function QuickViewModal({ product, onClose }) {

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);

  /* ======================================
     LOCK BACKGROUND SCROLL
  ====================================== */
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  /* ======================================
     HANDLERS
  ====================================== */

  const increaseQty = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQty = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      size: selectedSize,
      quantity
    });

    onClose();
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      size: selectedSize,
      quantity
    });

    navigate("/cart");
    onClose();
  };

  return (
    <div className="qv-overlay" onClick={onClose}>

      <div
        className="qv-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}
        <button className="qv-close" onClick={onClose}>
          ×
        </button>

        <div className="qv-container">

          {/* LEFT IMAGE */}
          <div className="qv-left">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="qv-right">

            <h2 className="qv-title">
              {product.name}
            </h2>

            <div className="qv-price">
              ₹{product.price}
              {product.oldPrice && (
                <span className="qv-old">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            <p className="qv-tax">
              Tax included. Shipping calculated at checkout.
            </p>

            {/* SIZE */}
            {product.sizes && (
              <>
                <div className="qv-size-label">
                  Size: <strong>{selectedSize}</strong>
                </div>

                <div className="qv-size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={
                        selectedSize === size
                          ? "qv-size active"
                          : "qv-size"
                      }
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STOCK */}
            <div className="qv-stock">
              In stock (15 units), ready to ship
              <div className="qv-stock-bar">
                <div className="qv-stock-fill" />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="qv-qty">
              <span>Quantity</span>

              <div className="qv-qty-box">
                <button onClick={decreaseQty}>−</button>
                <span>{quantity}</span>
                <button onClick={increaseQty}>+</button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="qv-buttons">
              <button
                className="qv-add"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>

              <button
                className="qv-buy"
                onClick={handleBuyNow}
              >
                Buy It Now
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="qv-description">
              {product.description ||
                "Premium handcrafted fabric with elegant design and superior comfort. Built for durability and timeless style."}
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;