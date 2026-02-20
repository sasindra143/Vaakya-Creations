import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const userEmail = "user@test.com"; // Replace with logged-in user

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/payment/user/${userEmail}`
        );
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-3 border">
                  {order.razorpay_order_id}
                </td>
                <td className="p-3 border">
                  ₹{order.amount}
                </td>
                <td className="p-3 border">
                  {order.status}
                </td>
                <td className="p-3 border">
                  {new Date(order.createdAt)
                    .toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;