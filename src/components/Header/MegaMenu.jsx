import { Link } from "react-router-dom";
import "./MegaMenu.css";

const CATEGORIES = [
  { label: "Pattu Sarees", slug: "pattu-sarees", emoji: "🥻", desc: "Silk & zari weaves" },
  { label: "Kurtis", slug: "kurtis", emoji: "👘", desc: "Casual & festive" },
  { label: "Dresses", slug: "dresses", emoji: "👗", desc: "Ready-to-wear" },
  { label: "Blouses", slug: "blouses", emoji: "🪡", desc: "Designer crafted" },
  { label: "Jewellery", slug: "handmade-jewellery", emoji: "💎", desc: "Handmade pieces" },
];

const MegaMenu = ({ open, onCategoryClick }) => {
  return (
    <div
      className={`vc-mega-menu${open ? " open" : ""}`}
      role="dialog"
      aria-label="Collections menu"
    >
      {/* Banner */}
      <div className="vc-mega-banner">
        ✦ Explore Our Curated Collections ✦
      </div>

      {/* Grid */}
      <div className="vc-mega-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="vc-mega-card"
            role="button"
            tabIndex={open ? 0 : -1}
            onClick={() => onCategoryClick(cat.slug)}
            onKeyDown={(e) => e.key === "Enter" && onCategoryClick(cat.slug)}
          >
            <div className="vc-mega-icon">{cat.emoji}</div>
            <span className="vc-mega-label">{cat.label}</span>
            <span className="vc-mega-desc">{cat.desc}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="vc-mega-footer">
        <Link to="/collections" className="vc-mega-footer-link">
          View All Collections &rarr;
        </Link>
      </div>
    </div>
  );
};

export default MegaMenu;