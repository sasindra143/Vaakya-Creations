import "./Highlights.css";
import highlightsData from "./highlightsData";
import HighlightCard from "./HighlightCard";
import { Truck, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";

function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-header">
        <h2>Our Highlights</h2>
        <p>Know More About Us</p>
      </div>

      <div className="highlights-grid">
        {highlightsData.map((item) => (
          <HighlightCard key={item.id} data={item} />
        ))}
      </div>

      <div className="highlight-features">
        <div className="feature-item">
          <Truck size={28} />
          <div>
            <h4>FREE SHIPPING</h4>
            <p>From all orders above Rs.1000</p>
          </div>
        </div>

        <div className="feature-item">
          <RefreshCcw size={28} />
          <div>
            <h4>Free Returns</h4>
            <p>Return money within 07 days</p>
          </div>
        </div>

        <div className="feature-item">
          <ShieldCheck size={28} />
          <div>
            <h4>Secure Shopping</h4>
            <p>You're in safe hands</p>
          </div>
        </div>

        <div className="feature-item">
          <Sparkles size={28} />
          <div>
            <h4>Trendy Styles</h4>
            <p>We have everything you need</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Highlights;  // 🔥 THIS LINE FIXES YOUR ERROR