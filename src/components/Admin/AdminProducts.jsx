/**
 * src/components/Admin/AdminProducts.jsx
 * ✅ FIXED: Input loses focus after 1 char — Field moved outside component tree
 * ✅ FIXED: Removed shimmer/animation from inputs
 * ✅ All 10 categories | M/L/S/XL size selector
 * ✅ Add/Edit/Delete real-time | Search | Fully mobile responsive
 */

import { useState, useMemo, useRef, useCallback } from "react";
import { useProducts } from "../../context/ProductContext";
import "./AdminProducts.css";

/* ════════════════════════════════════════════════════════
   CONSTANTS  (module-level — never re-created)
════════════════════════════════════════════════════════ */

export const ALL_CATEGORIES = [
  { value: "pattu-sarees",       label: "Pattu Sarees"       },
  { value: "fancy-sarees",       label: "Fancy Sarees"       },
  { value: "silk-sarees",        label: "Silk Sarees"        },
  { value: "kurtis",             label: "Kurtis"             },
  { value: "dresses",            label: "Dresses"            },
  { value: "tops",               label: "Tops"               },
  { value: "blouses",            label: "Blouses"            },
  { value: "handmade-jewellery", label: "Handmade Jewellery" },
  { value: "lehengas",           label: "Lehengas"           },
  { value: "anarkali-suits",     label: "Anarkali Suits"     },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const EMPTY_FORM = {
  name: "", category: "", price: "", oldPrice: "",
  stock: "", rating: "", description: "", image: "", sizes: [],
};

/* ════════════════════════════════════════════════════════
   FIELD — defined at MODULE LEVEL so it is NEVER
   re-created on parent re-render → no focus loss
════════════════════════════════════════════════════════ */

/**
 * @param {{ label:string, name:string, type?:string, placeholder?:string,
 *           required?:boolean, value:string, error:string,
 *           onChange:(val:string)=>void, step?:string }} props
 */
function FormField({ label, name, type = "text", placeholder, required, value, error, onChange, step }) {
  return (
    <div className="ap-field">
      <label className="ap-label" htmlFor={`apf-${name}`}>
        {label}{required && <span className="ap-req"> *</span>}
      </label>
      <input
        id={`apf-${name}`}
        className={`ap-input${error ? " err" : ""}`}
        type={type}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={step}
        autoComplete="off"
      />
      {error && <span className="ap-err-msg">⚠ {error}</span>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DELETE MODAL  (module-level)
════════════════════════════════════════════════════════ */

function DeleteModal({ productName, onConfirm, onCancel }) {
  return (
    <div className="ap-overlay" onClick={onCancel}>
      <div className="ap-modal ap-del-modal" onClick={e => e.stopPropagation()}>
        <div className="ap-del-icon">🗑️</div>
        <h3 className="ap-del-title">Delete Product?</h3>
        <p className="ap-del-msg">
          "<strong>{productName}</strong>" will be permanently removed. This cannot be undone.
        </p>
        <div className="ap-del-actions">
          <button className="ap-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="ap-btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PRODUCT FORM MODAL  (module-level — CRITICAL)
   Field is NOT defined here — it lives at module scope
   above, so React always sees it as the same component
   type and NEVER unmounts/remounts it on state change.
════════════════════════════════════════════════════════ */

function ProductFormModal({ initial, onSave, onClose }) {
  const isEdit = !!initial?.id;

  const [form, setForm] = useState(() =>
    initial ? { ...EMPTY_FORM, ...initial, sizes: initial.sizes || [] } : { ...EMPTY_FORM }
  );
  const [errs,    setErrs]    = useState({});
  const [busy,    setBusy]    = useState(false);
  const [imgPrev, setImgPrev] = useState(initial?.image || "");
  const fileRef = useRef(null);

  /* ── Generic field setter — clears that field's error ── */
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrs(prev => ({ ...prev, [name]: "" }));
  }, []);

  /* ── Size toggle ── */
  const toggleSize = useCallback((size) => {
    setForm(prev => {
      const sizes = prev.sizes || [];
      return {
        ...prev,
        sizes: sizes.includes(size)
          ? sizes.filter(s => s !== size)
          : [...sizes, size],
      };
    });
  }, []);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name?.trim())
      e.name = "Product name is required";
    if (!form.category)
      e.category = "Select a category";
    if (!form.price || isNaN(+form.price) || +form.price <= 0)
      e.price = "Enter a valid price";
    if (form.stock === "" || isNaN(+form.stock) || +form.stock < 0)
      e.stock = "Enter valid stock (0 or more)";
    if (form.rating && (isNaN(+form.rating) || +form.rating < 1 || +form.rating > 5))
      e.rating = "Rating must be 1–5";
    return e;
  };

  /* ── File upload ── */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target.result;
      setImgPrev(result);
      setField("image", result);
    };
    reader.readAsDataURL(file);
  };

  /* ── Image URL change ── */
  const handleImageUrl = (v) => {
    setField("image", v);
    setImgPrev(v);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 280));
    onSave({
      ...form,
      price:    Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock:    Number(form.stock),
      rating:   form.rating ? Number(form.rating) : 4.5,
      sizes:    form.sizes || [],
      image:    form.image || "https://placehold.co/400x500/f5ead8/7a4f20?text=No+Image",
    });
    setBusy(false);
  };

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-form-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="ap-form-head">
          <div className="ap-form-head-left">
            <div className="ap-form-head-icon">{isEdit ? "✏️" : "✨"}</div>
            <div>
              <h2 className="ap-form-title">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="ap-form-subtitle">
                {isEdit ? "Update product details below" : "Fill in the details to add to your store"}
              </p>
            </div>
          </div>
          <button className="ap-form-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Body ── */}
        <div className="ap-form-body">

          {/* BASIC INFO */}
          <div className="ap-section-label">Basic Information</div>

          <div className="ap-row-2">
            {/* ✅ FormField at module level — no unmount on re-render */}
            <FormField
              label="Product Name"
              name="name"
              placeholder="e.g. Royal Kanchipuram Silk Saree"
              required
              value={form.name}
              error={errs.name || ""}
              onChange={v => setField("name", v)}
            />

            {/* Category — inline since it's a <select> */}
            <div className="ap-field">
              <label className="ap-label" htmlFor="apf-category">
                Category<span className="ap-req"> *</span>
              </label>
              <select
                id="apf-category"
                className={`ap-select${errs.category ? " err" : ""}`}
                value={form.category}
                onChange={e => setField("category", e.target.value)}
              >
                <option value="">Select category...</option>
                {ALL_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errs.category && <span className="ap-err-msg">⚠ {errs.category}</span>}
            </div>
          </div>

          {/* Description — inline textarea */}
          <div className="ap-field">
            <label className="ap-label" htmlFor="apf-description">Description</label>
            <textarea
              id="apf-description"
              className="ap-textarea"
              rows={4}
              value={form.description ?? ""}
              onChange={e => setField("description", e.target.value)}
              placeholder="Describe the product — fabric, occasion, design details, wash care..."
            />
            <span className="ap-char-hint">{(form.description || "").length} chars</span>
          </div>

          {/* PRICING */}
          <div className="ap-section-label">Pricing &amp; Inventory</div>

          <div className="ap-row-4">
            <FormField
              label="Selling Price (₹)"
              name="price"
              type="number"
              placeholder="4999"
              required
              value={form.price}
              error={errs.price || ""}
              onChange={v => setField("price", v)}
            />
            <FormField
              label="Original Price (₹)"
              name="oldPrice"
              type="number"
              placeholder="7999"
              value={form.oldPrice}
              error={errs.oldPrice || ""}
              onChange={v => setField("oldPrice", v)}
            />
            <FormField
              label="Stock Qty"
              name="stock"
              type="number"
              placeholder="25"
              required
              value={form.stock}
              error={errs.stock || ""}
              onChange={v => setField("stock", v)}
            />
            <FormField
              label="Rating (1–5)"
              name="rating"
              type="number"
              placeholder="4.5"
              step="0.1"
              value={form.rating}
              error={errs.rating || ""}
              onChange={v => setField("rating", v)}
            />
          </div>

          {/* SIZES */}
          <div className="ap-section-label">Available Sizes</div>
          <div className="ap-size-picker">
            {ALL_SIZES.map(size => (
              <button
                key={size}
                type="button"
                className={`ap-size-chip${(form.sizes || []).includes(size) ? " selected" : ""}`}
                onClick={() => toggleSize(size)}
              >
                {size}
                {(form.sizes || []).includes(size) && <span className="ap-size-check">✓</span>}
              </button>
            ))}
          </div>
          {(form.sizes || []).length > 0 && (
            <p className="ap-size-selected-note">
              Selected: <strong>{(form.sizes || []).join(", ")}</strong>
            </p>
          )}

          {/* IMAGE */}
          <div className="ap-section-label">Product Image</div>

          <div className="ap-field">
            <label className="ap-label" htmlFor="apf-image">Image URL</label>
            <input
              id="apf-image"
              className="ap-input"
              type="text"
              value={form.image?.startsWith("data:") ? "" : (form.image || "")}
              onChange={e => handleImageUrl(e.target.value)}
              placeholder="Paste image URL — https://..."
              autoComplete="off"
            />
          </div>

          <div className="ap-img-row">
            <button
              type="button"
              className="ap-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              📁 Upload from Device
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            {imgPrev && (
              <div className="ap-img-preview">
                <img
                  src={imgPrev}
                  alt="Preview"
                  onError={e => { e.target.src = "https://placehold.co/80x100?text=?"; }}
                />
                <button
                  type="button"
                  className="ap-img-remove"
                  onClick={() => { setImgPrev(""); setField("image", ""); }}
                >
                  ✕
                </button>
                <span className="ap-img-label">Preview</span>
              </div>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="ap-form-foot">
          <button className="ap-btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className={`ap-btn-primary${busy ? " busy" : ""}`}
            onClick={handleSubmit}
            disabled={busy}
          >
            {busy
              ? <><span className="ap-spinner" /> Saving…</>
              : isEdit ? "✓ Update Product" : "✨ Add Product"
            }
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════════════ */

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [sortKey,    setSortKey]    = useState("newest");
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [toast,      setToast]      = useState(null);

  const flash = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter(p => {
      const matchQ   = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      const matchCat = !catFilter || p.category === catFilter;
      return matchQ && matchCat;
    });
    switch (sortKey) {
      case "oldest":     list.sort((a, b) => String(a.id) > String(b.id) ? 1 : -1); break;
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "stock-low":  list.sort((a, b) => a.stock - b.stock); break;
      default:           list.sort((a, b) => String(b.id) > String(a.id) ? 1 : -1);
    }
    return list;
  }, [products, search, catFilter, sortKey]);

  const handleSave = useCallback(data => {
    if (editTarget) {
      updateProduct(editTarget.id, data);
      flash("✅ Product updated successfully!");
    } else {
      addProduct(data);
      flash("✨ Product added to your store!");
    }
    setShowForm(false);
    setEditTarget(null);
  }, [editTarget, addProduct, updateProduct, flash]);

  const openAdd  = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = p  => { setEditTarget(p);    setShowForm(true); };

  const confirmDelete = useCallback(() => {
    if (!delTarget) return;
    deleteProduct(delTarget.id);
    flash(`🗑️ "${delTarget.name}" has been deleted.`, "error");
    setDelTarget(null);
  }, [delTarget, deleteProduct, flash]);

  const disc     = p => p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const catLabel = k => ALL_CATEGORIES.find(c => c.value === k)?.label || k || "—";

  const totalValue = products.reduce((s, p) => s + (p.price * p.stock || 0), 0);
  const outOfStock = products.filter(p => !p.stock || p.stock === 0).length;

  return (
    <div className="ap-root">

      {/* Toast */}
      {toast && (
        <div className={`ap-toast ap-toast-${toast.type}`}>{toast.msg}</div>
      )}

      {/* Page header */}
      <div className="ap-page-header">
        <div className="ap-header-left">
          <h1 className="ap-page-title">Products</h1>
          <p className="ap-page-sub">
            {products.length} product{products.length !== 1 ? "s" : ""} in your store
          </p>
        </div>
        <button className="ap-btn-primary ap-add-btn" onClick={openAdd}>
          <span>+</span> Add Product
        </button>
      </div>

      {/* Stats strip */}
      {products.length > 0 && (
        <div className="ap-stats">
          <div className="ap-stat">
            <span className="ap-stat-val">{products.length}</span>
            <span className="ap-stat-lbl">Total Products</span>
          </div>
          <div className="ap-stat-div" />
          <div className="ap-stat">
            <span className="ap-stat-val">₹{totalValue.toLocaleString()}</span>
            <span className="ap-stat-lbl">Inventory Value</span>
          </div>
          <div className="ap-stat-div" />
          <div className="ap-stat">
            <span className={`ap-stat-val${outOfStock > 0 ? " warn" : ""}`}>{outOfStock}</span>
            <span className="ap-stat-lbl">Out of Stock</span>
          </div>
          <div className="ap-stat-div" />
          <div className="ap-stat">
            <span className="ap-stat-val">{displayed.length}</span>
            <span className="ap-stat-lbl">Showing</span>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="ap-filters">
        <div className="ap-search-box">
          <span className="ap-search-ico">🔍</span>
          <input
            className="ap-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or category…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <select
          className="ap-filter-sel"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          className="ap-filter-sel"
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="stock-low">Low Stock First</option>
        </select>
        {(search || catFilter) && (
          <button
            className="ap-clear-btn"
            onClick={() => { setSearch(""); setCatFilter(""); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Empty states */}
      {products.length === 0 ? (
        <div className="ap-zero">
          <div className="ap-zero-icon">📦</div>
          <h3 className="ap-zero-title">No products yet</h3>
          <p className="ap-zero-sub">
            Add your first product and it will instantly appear on your store.
          </p>
          <button className="ap-btn-primary" onClick={openAdd}>✨ Add First Product</button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="ap-zero">
          <div className="ap-zero-icon">🔍</div>
          <h3 className="ap-zero-title">No matches found</h3>
          <p className="ap-zero-sub">Try a different search term or category.</p>
          <button
            className="ap-btn-ghost"
            onClick={() => { setSearch(""); setCatFilter(""); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Old Price</th>
                <th>Discount</th>
                <th>Sizes</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(p => {
                const d        = disc(p);
                const stock    = Number(p.stock);
                const stockOut = stock === 0;
                const stockLow = stock > 0 && stock <= 5;
                return (
                  <tr key={p.id} className="ap-row">
                    <td className="ap-td-product">
                      <div className="ap-product-cell">
                        <div className="ap-thumb">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={e => { e.target.src = "https://placehold.co/44x54/f5ead8/7a4f20?text=?"; }}
                          />
                        </div>
                        <div className="ap-product-text">
                          <span className="ap-product-name">{p.name}</span>
                          <span className="ap-product-id">#{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="ap-cat-tag">{catLabel(p.category)}</span></td>
                    <td className="ap-td-price">₹{Number(p.price).toLocaleString()}</td>
                    <td>
                      {p.oldPrice
                        ? <span className="ap-old-price">₹{Number(p.oldPrice).toLocaleString()}</span>
                        : <span className="ap-dash">—</span>}
                    </td>
                    <td>
                      {d > 0
                        ? <span className="ap-disc-tag">−{d}%</span>
                        : <span className="ap-dash">—</span>}
                    </td>
                    <td>
                      {p.sizes?.length > 0
                        ? <div className="ap-sizes-cell">
                            {p.sizes.map(s => <span key={s} className="ap-size-dot">{s}</span>)}
                          </div>
                        : <span className="ap-dash">—</span>}
                    </td>
                    <td>
                      <span className={`ap-stock-tag${stockOut ? " s-out" : stockLow ? " s-low" : " s-ok"}`}>
                        {stockOut ? "Out of Stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td>
                      {p.rating
                        ? <span className="ap-rating-cell">⭐ {Number(p.rating).toFixed(1)}</span>
                        : <span className="ap-dash">—</span>}
                    </td>
                    <td className="ap-td-actions">
                      <button className="ap-act-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="ap-act-del"  onClick={() => setDelTarget(p)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ProductFormModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
      {delTarget && (
        <DeleteModal
          productName={delTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}

    </div>
  );
}