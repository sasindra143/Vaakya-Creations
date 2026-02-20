import { useCart } from "../../context/CartContext";
import "./Header.css";

const MobileBottomCart = () => {
  const { cartItems } = useCart();

  if (!cartItems.length) return null;

  return (
    <div className="mobile-cart">
      View Cart ({cartItems.length})
    </div>
  );
};

export default MobileBottomCart;