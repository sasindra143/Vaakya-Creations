import { useParams } from "react-router-dom";
import products from "../data/products";
import "../styles/products.css";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details">
      <img src={product.image} />
      <div>
        <h2>{product.name}</h2>
        <p>₹{product.price}</p>
        <p>Premium quality ethnic wear.</p>
      </div>
    </div>
  );
}

export default ProductDetails;