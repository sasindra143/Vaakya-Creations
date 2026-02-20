import { useState } from "react";

function CouponBox() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (code === "VA20") {
      setDiscount(20);
      alert("Coupon Applied: 20% OFF");
    } else {
      alert("Invalid Coupon");
    }
  };

  return (
    <div className="coupon-box">
      <input
        type="text"
        placeholder="Enter Coupon"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={applyCoupon}>
        Apply
      </button>
    </div>
  );
}

export default CouponBox;