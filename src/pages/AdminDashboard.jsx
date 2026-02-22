function AdminDashboard() {

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-6 shadow rounded">
          <h3>Total Orders</h3>
          <p className="text-2xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">
            ₹{totalRevenue}
          </p>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;