import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";

function WishlistPage() {

  const {
    wishlistItems,
    removeFromWishlist
  } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your Wishlist is Empty</h2>
        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <h2>My Wishlist</h2>

      <div className="wishlist-grid">

        {wishlistItems.map((item) => (

          <div key={item.id} className="wishlist-card">

            <img
              src={item.image}
              alt={item.name}
              onClick={() =>
                navigate(`/product/${item.id}`)
              }
            />

            <div className="wishlist-info">

              <h3>{item.name}</h3>

              <p className="wishlist-price">
                ₹{item.price}
              </p>

              <div className="wishlist-actions">

                <button
                  className="wishlist-cart-btn"
                  onClick={() => {

                    addToCart({
                      ...item,
                      size: item.size || null
                    });

                    removeFromWishlist(item.id);
                  }}
                >
                  Move To Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromWishlist(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default WishlistPage;