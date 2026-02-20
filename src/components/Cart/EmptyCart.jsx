import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <div className="empty-cart">
      <h2>Your cart is empty</h2>
      <p>
        Looks like you haven't added anything yet.
      </p>
      <Link to="/" className="shop-btn">
        Continue Shopping
      </Link>
    </div>
  );
}

export default EmptyCart;