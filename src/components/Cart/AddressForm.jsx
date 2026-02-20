import { loadRazorpay } from "../../utils/razorpay";
import { useNavigate } from "react-router-dom";

function AddressForm({ total }) {
  const navigate = useNavigate();

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) return alert("Razorpay failed to load");

    const options = {
      key: "rzp_test_YourTestKey",
      amount: total * 100,
      currency: "INR",
      name: "Vaakya Creations",
      description: "Order Payment",
      handler: function () {
        navigate("/order-success");
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="address-form">
      <input placeholder="Full Name" />
      <input placeholder="Phone Number" />
      <textarea placeholder="Full Address" />
      <button onClick={handlePayment}>
        Pay ₹{total}
      </button>
    </div>
  );
}

export default AddressForm;