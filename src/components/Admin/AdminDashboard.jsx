/**
 * src/components/Admin/AdminDashboard.jsx
 * Live stats — reads only admin-added products from ProductContext
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import "./AdminDashboard.css";

const CATEGORIES = [
  { key: "pattu-sarees",        label: "Pattu Sarees"        },
  { key: "fancy-sarees",        label: "Fancy Sarees"        },
  { key: "silk-sarees",         label: "Silk Sarees"         },
  { key: "kurtis",              label: "Kurtis"              },
  { key: "dresses",             label: "Dresses"             },
  { key: "tops",                label: "Tops"                },
  { key: "blouses",             label: "Blouses"             },
  { key: "handmade-jewellery",  label: "Handmade Jewellery"  },
  { key: "lehengas",            label: "Lehengas"            },
  { key: "anarkali-suits",      label: "Anarkali Suits"      },
];

export default function AdminDashboard() {
  const navigate      = useNavigate();
  const { products }  = useProducts();

  const stats = useMemo(() => {
    const totalValue   = products.reduce((s, p) => s + Number(p.price  || 0), 0);
    const totalStock   = products.reduce((s, p) => s + Number(p.stock  || 0), 0);
    const avgRating    = products.length
      ? (products.reduce((s, p) => s + Number(p.rating || 0), 0) / products.length).toFixed(1)
      : "—";
    const outOfStock   = products.filter((p) => Number(p.stock) === 0).length;
    const lowStock     = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length;

    const byCategory   = CATEGORIES
      .map((c) => ({ ...c, count: products.filter((p) => p.category === c.key).length }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    const recent = [...products]
      .sort((a, b) => (String(b.id) > String(a.id) ? 1 : -1))
      .slice(0, 6);

    return { totalValue, totalStock, avgRating, outOfStock, lowStock, byCategory, recent };
  }, [products]);

  const CARDS = [
    {
      label: "Total Products",
      value: products.length,
      sub:   `${stats.totalStock} units in stock`,
      color: "#c9a96e",
      bg:    "#fdf5e4",
      icon:  "📦",
    },
    {
      label: "Catalogue Value",
      value: `₹${(stats.totalValue / 1000).toFixed(1)}K`,
      sub:   "Combined listed price",
      color: "#4caf50",
      bg:    "#e8f5e9",
      icon:  "💰",
    },
    {
      label: "Avg Rating",
      value: products.length ? `${stats.avgRating} ★` : "—",
      sub:   "Across all products",
      color: "#ff9800",
      bg:    "#fff3e0",
      icon:  "⭐",
    },
    {
      label: "Stock Alerts",
      value: stats.outOfStock + stats.lowStock,
      sub:   `${stats.outOfStock} out · ${stats.lowStock} low`,
      color: stats.outOfStock + stats.lowStock > 0 ? "#e53935" : "#4caf50",
      bg:    stats.outOfStock + stats.lowStock > 0 ? "#fce4ec" : "#e8f5e9",
      icon:  stats.outOfStock + stats.lowStock > 0 ? "⚠️" : "✅",
    },
  ];

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <div className="ad-root">
        <div className="ad-page-header">
          <div>
            <h1 className="ad-title">Dashboard</h1>
            <p className="ad-subtitle">Welcome to Vaakya Admin Panel</p>
          </div>
          <button className="ad-primary-btn" onClick={() => navigate("/admin/products")}>
            + Add First Product
          </button>
        </div>

        <div className="ad-zero-state">
          <div className="ad-zero-icon">🏪</div>
          <h2 className="ad-zero-title">No products yet</h2>
          <p className="ad-zero-desc">
            Start building your catalogue. Products you add will appear here and
            instantly on the storefront.
          </p>
          <button className="ad-primary-btn" onClick={() => navigate("/admin/products")}>
            Add Your First Product →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-root">

      {/* Header */}
      <div className="ad-page-header">
        <div>
          <h1 className="ad-title">Dashboard</h1>
          <p className="ad-subtitle">
            {products.length} product{products.length !== 1 ? "s" : ""} live on your store
          </p>
        </div>
        <button className="ad-primary-btn" onClick={() => navigate("/admin/products")}>
          + Add Product
        </button>
      </div>

      {/* Stat cards */}
      <div className="ad-cards">
        {CARDS.map((card) => (
          <div key={card.label} className="ad-card" style={{ "--c": card.color, "--bg": card.bg }}>
            <div className="ad-card-icon">{card.icon}</div>
            <div className="ad-card-body">
              <div className="ad-card-value">{card.value}</div>
              <div className="ad-card-label">{card.label}</div>
              <div className="ad-card-sub">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column: category chart + recent products */}
      <div className="ad-two-col">

        {/* Category breakdown */}
        <div className="ad-panel">
          <div className="ad-panel-head">
            <h2 className="ad-panel-title">Products by Category</h2>
            <button className="ad-panel-link" onClick={() => navigate("/admin/products")}>
              Manage →
            </button>
          </div>
          <div className="ad-cat-list">
            {stats.byCategory.length === 0 ? (
              <p className="ad-empty-note">No categorised products yet.</p>
            ) : (
              stats.byCategory.map((cat) => {
                const pct = Math.round((cat.count / products.length) * 100);
                return (
                  <div key={cat.key} className="ad-cat-row">
                    <div className="ad-cat-meta">
                      <span className="ad-cat-name">{cat.label}</span>
                      <span className="ad-cat-count">{cat.count}</span>
                    </div>
                    <div className="ad-cat-track">
                      <div className="ad-cat-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent products */}
        <div className="ad-panel">
          <div className="ad-panel-head">
            <h2 className="ad-panel-title">Recently Added</h2>
            <button className="ad-panel-link" onClick={() => navigate("/admin/products")}>
              View All →
            </button>
          </div>
          <div className="ad-recent-list">
            {stats.recent.map((p) => (
              <div key={p.id} className="ad-recent-row">
                <div className="ad-recent-thumb">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => { e.target.src = "https://placehold.co/40x50/f5ead8/7a4f20?text=?"; }}
                  />
                </div>
                <div className="ad-recent-info">
                  <span className="ad-recent-name">{p.name}</span>
                  <span className="ad-recent-cat">
                    {CATEGORIES.find((c) => c.key === p.category)?.label || p.category}
                  </span>
                </div>
                <div className="ad-recent-right">
                  <span className="ad-recent-price">₹{Number(p.price).toLocaleString()}</span>
                  <span className={`ad-recent-stock${Number(p.stock) === 0 ? " s-out" : Number(p.stock) <= 5 ? " s-low" : " s-ok"}`}>
                    {Number(p.stock) === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick-action shortcuts */}
      <div className="ad-shortcuts">
        <button className="ad-shortcut" onClick={() => navigate("/admin/products")}>
          <span className="ad-sh-icon">📦</span>
          <span className="ad-sh-label">Manage Products</span>
          <span className="ad-sh-arrow">→</span>
        </button>
        <button className="ad-shortcut" onClick={() => navigate("/admin/orders")}>
          <span className="ad-sh-icon">🧾</span>
          <span className="ad-sh-label">View Orders</span>
          <span className="ad-sh-arrow">→</span>
        </button>
        <button className="ad-shortcut" onClick={() => navigate("/")}>
          <span className="ad-sh-icon">🏪</span>
          <span className="ad-sh-label">Visit Storefront</span>
          <span className="ad-sh-arrow">→</span>
        </button>
      </div>

    </div>
  );
}