import { useNavigate } from "react-router-dom";
import "../../styles/addToCartModal.css";

function AddToCartModal({
  product,
  subtotal,
  onClose
}) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div className="atc-overlay">

      <div className="atc-modal">

        {/* HEADER */}
        <div className="atc-header">
          <div className="atc-success">
            ✔ Item successfully added to your cart
          </div>

          <button
            className="atc-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="atc-body">

          {/* LEFT */}
          <div className="atc-left">
            <img
              src={product.image}
              alt={product.name}
            />

            <h4>{product.name}</h4>

            {product.size && (
              <p>Size: {product.size}</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="atc-right">

            <p className="atc-subtotal">
              Subtotal (1): ₹{subtotal}
            </p>

            <button
              className="atc-btn primary"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              View Cart (1)
            </button>

            <button
              className="atc-btn secondary"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              Checkout
            </button>

            <p
              className="atc-continue"
              onClick={onClose}
            >
              Continue shopping
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddToCartModal;