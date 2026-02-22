import { Outlet, NavLink } from "react-router-dom";

function AdminLayout() {

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">

        <h2 className="text-xl font-bold mb-8">
          Vaakya Admin
        </h2>

        <nav className="flex flex-col gap-4">

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-black p-2 rounded"
                : "p-2 hover:bg-gray-800 rounded"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "bg-white text-black p-2 rounded"
                : "p-2 hover:bg-gray-800 rounded"
            }
          >
            Products
          </NavLink>

        </nav>

      </aside>

      {/* Content Area */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;