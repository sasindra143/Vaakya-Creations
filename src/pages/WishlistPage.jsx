import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

function WishlistPage() {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div style={{ padding: "60px" }}>
      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items saved.</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id}>
            {item.name} - ₹{item.price}
          </div>
        ))
      )}
    </div>
  );
}

export default WishlistPage;