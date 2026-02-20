import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      <div className="flex gap-6 mb-8">

        <Link
          to="/admin/orders"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Orders
        </Link>

        <Link
          to="/admin/products"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Products
        </Link>

      </div>

      {/* THIS IS CRITICAL */}
      <Outlet />

    </div>
  );
}

export default AdminLayout;