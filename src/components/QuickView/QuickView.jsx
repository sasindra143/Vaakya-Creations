import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

function QuickView({ product }) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="quick-view-btn"
        onClick={() => setOpen(true)}
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