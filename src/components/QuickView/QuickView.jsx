/**
 * src/components/QuickView/QuickView.jsx
 * Trigger button + modal wrapper for product quick view
 */

import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

function QuickView({ product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="quick-view-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Quick view ${product?.name}`}
      >
        Quick View
      </button>

      {open && (
        <QuickViewModal
          product={product}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default QuickView;