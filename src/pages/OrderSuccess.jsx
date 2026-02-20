import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {

  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="order-success">
        <h2>No Order Found</h2>
      </div>
    );
  }

  const {
    paymentId,
    address,
    items,
    subtotal,
    delivery,
    totalAmount
  } = orderData;

  return (
    <div className="order-success">

      <div className="success-box">

        <h2>🎉 Order Confirmed</h2>

        <p><strong>Payment ID:</strong> {paymentId}</p>

        <h3>Ordered Items</h3>

        {items.map(item => (
          <div
            key={item.id}
            className="success-item"
          >
            <img src={item.image} alt="" />
            <div>
              <p>{item.name}</p>
              <p>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}

        <h3>Price Summary</h3>

        <p>Subtotal: ₹{subtotal}</p>
        <p>Delivery: ₹{delivery}</p>
        <p><strong>Total: ₹{totalAmount}</strong></p>

        <h3>Delivery Address</h3>

        <p>{address.fullName}</p>
        <p>{address.house}</p>
        <p>{address.area}</p>
        <p>{address.landmark}</p>
        <p>{address.city}, {address.state}</p>
        <p>{address.pincode}</p>
        <p>Mobile: {address.mobile}</p>

        <button
          onClick={() => navigate("/")}
          className="home-btn"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;