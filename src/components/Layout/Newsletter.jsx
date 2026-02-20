import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    console.log("Subscribed:", email);
    alert("Successfully Subscribed!");

    setEmail("");
  };

  return (
    <div className="newsletter">
      <h3>Subscribe For Exclusive Offers</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default Newsletter;