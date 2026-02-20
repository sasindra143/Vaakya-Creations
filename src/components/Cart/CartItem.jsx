import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    addToCart,
    decreaseQty,
    removeFromCart,
  } = useContext(CartContext);

  return (
    <div className="cart-item">

      <img src={item.image} alt={item.name} />

      <div className="cart-info">
        <h4>{item.name}</h4>
        <p>₹{item.price}</p>

        <div className="qty-controls">
          <button
            onClick={() => decreaseQty(item.id)}
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => addToCart(item)}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-total">
        ₹{item.price * item.quantity}
      </div>

      <button
        className="remove-btn"
        onClick={() => removeFromCart(item.id)}
      >
        ✕
      </button>

    </div>
  );
}

export default CartItem;