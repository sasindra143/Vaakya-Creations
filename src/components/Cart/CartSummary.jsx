import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function CartSummary() {
  const { subtotal } = useContext(CartContext);

  const shipping = subtotal > 2000 ? 0 : 150;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-summary">

      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>
          {shipping === 0 ? "Free" : `₹${shipping}`}
        </span>
      </div>

      <div className="summary-row">
        <span>Tax (5%)</span>
        <span>₹{tax.toFixed(0)}</span>
      </div>

      <div className="summary-total">
        <span>Total</span>
        <span>₹{total.toFixed(0)}</span>
      </div>

      <button className="checkout-btn">
        Proceed To Checkout
      </button>

    </div>
  );
}

export default CartSummary;