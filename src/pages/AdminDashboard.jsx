import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payment/all`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===========================
     STATUS UPDATE
  =========================== */
  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/payment/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
     DELETE ONLY IF DELIVERED
  =========================== */
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/payment/delete/${id}`, {
        method: "DELETE",
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================
     SEARCH FILTER
  =========================== */
  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.mobileNumber.includes(search) ||
    order.razorpay_order_id.includes(search)
  );

  /* ===========================
     PAGINATION
  =========================== */
  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ===========================
     REVENUE CHART DATA
  =========================== */
  const revenueData = [
    {
      name: "Revenue",
      amount: orders
        .filter((o) => o.status === "Delivered")
        .reduce((sum, o) => sum + o.amount, 0),
    },
  ];

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by Name / Mobile / Order ID"
        className="border p-2 mb-6 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* REVENUE CHART */}
      <div className="mb-10" style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order._id}>
              <td className="p-2 border">
                {order.razorpay_order_id}
              </td>

              <td className="p-2 border">
                {order.customerName}
              </td>

              <td className="p-2 border">
                {order.mobileNumber}
              </td>

              <td className="p-2 border">
                {order.address}
              </td>

              <td className="p-2 border">
                ₹{order.amount}
              </td>

              <td className="p-2 border">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border p-1"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </td>

              <td className="p-2 border">
                {order.status === "Delivered" && (
                  <button
                    onClick={() =>
                      handleDelete(order._id)
                    }
                    className="bg-red-500 text-white px-3 py-1"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION CONTROLS */}
      <div className="mt-6 flex gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() =>
              setCurrentPage(index + 1)
            }
            className={`px-3 py-1 border ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;