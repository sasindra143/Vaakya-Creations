import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { loadRazorpay } from "../utils/razorpay";
import "./CartPage.css";

const allowedStates = [
  "Andhra Pradesh",
  "Telangana",
  "Chennai",
  "Bengaluru"
];

const deliveryCharges = {
  "Andhra Pradesh": 50,
  "Telangana": 40,
  "Chennai": 60,
  "Bengaluru": 70
};

function CartPage() {

  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleSelect,
    subtotal
  } = useContext(CartContext);

  const selectedItems = useMemo(
    () => cartItems.filter(i => i.selected),
    [cartItems]
  );

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [error, setError] = useState("");

  const delivery =
    deliveryCharges[formData.state] || 0;

  const totalAmount = subtotal + delivery;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* ===============================
     SAFE QUANTITY UPDATE
  =============================== */

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  /* ===============================
     VALIDATION
  =============================== */

  const validateForm = () => {

    if (selectedItems.length === 0)
      return "Select at least one item.";

    if (!formData.fullName.trim())
      return "Full name required.";

    if (!/^[6-9]\d{9}$/.test(formData.mobile))
      return "Invalid mobile number.";

    if (!formData.house.trim())
      return "House / Apartment required.";

    if (!formData.area.trim())
      return "Area / Street required.";

    if (!formData.city.trim())
      return "City required.";

    if (!allowedStates.includes(formData.state))
      return "Service available only in selected states.";

    if (!/^\d{6}$/.test(formData.pincode))
      return "Invalid pincode.";

    return "";
  };

  /* ===============================
     HANDLE PAYMENT
  =============================== */

  const handleCheckout = async () => {

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed.");
      return;
    }

    const options = {
      key: "rzp_test_YOURKEY",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Vaakya Creations",
      description: "Order Payment",
      handler: function (response) {
        navigate("/order-success", {
          state: {
            paymentId: response.razorpay_payment_id,
            address: formData,
            items: selectedItems,
            subtotal,
            delivery,
            totalAmount
          }
        });
      },
      prefill: {
        name: formData.fullName,
        contact: formData.mobile
      },
      theme: { color: "#000" }
    };

    const paymentObject =
      new window.Razorpay(options);

    paymentObject.open();
  };

  return (
    <div className="cart-page">

      {/* LEFT SECTION */}
      <div className="cart-left">
        <h2>Shopping Cart</h2>

        {cartItems.length === 0 && (
          <p className="empty-cart">
            Your cart is empty.
          </p>
        )}

        {cartItems.map(item => (
          <div key={item.id} className="cart-item">

            <input
              type="checkbox"
              checked={item.selected}
              onChange={() =>
                toggleSelect(item.id)
              }
            />

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="item-details">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              <div className="qty-controls">

                <button
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    handleDecrease(item)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    handleIncrease(item)
                  }
                >
                  +
                </button>

              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                Remove
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SECTION */}
      <div className="cart-right">

        <div className="summary-box">

          <h3>Price Details</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <h4>Delivery Address</h4>

          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input name="mobile" placeholder="Mobile Number" maxLength={10} onChange={handleChange} />
          <input name="house" placeholder="House No / Apartment" onChange={handleChange} />
          <input name="area" placeholder="Area / Street" onChange={handleChange} />
          <input name="landmark" placeholder="Landmark (Optional)" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />

          <select name="state" onChange={handleChange}>
            <option value="">Select State</option>
            {allowedStates.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <input name="pincode" placeholder="Pincode" onChange={handleChange} />

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Proceed To Payment
          </button>

        </div>
      </div>
    </div>
  );
}

export default CartPage;