import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Cart = () => {
  const [loading, setLoading] = useState(false);

  const totalAmount = 500; // Replace with real cart total
  const userEmail = "user@test.com"; // Replace with logged-in user email

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Order
      const orderRes = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            userEmail,
          }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Order creation failed");
      }

      const order = await orderRes.json();

      console.log("Order Created:", order);

      // 2️⃣ Simulate Payment Success (Mock)
      const verifyRes = await fetch(
        `${API_URL}/api/payment/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order.id,
          }),
        }
      );

      if (!verifyRes.ok) {
        throw new Error("Payment verification failed");
      }

      const result = await verifyRes.json();

      if (result.success) {
        alert("Payment Successful ✅");

        // 3️⃣ Clear Cart
        localStorage.removeItem("cart");

        // If using state:
        // setCart([]);

        // Optional redirect
        window.location.href = "/success";

      } else {
        alert("Payment Failed ❌");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Total: ₹{totalAmount}</h2>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "12px 25px",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default Cart;