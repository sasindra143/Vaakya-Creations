/**
 * CollectionCard.jsx
 * @description Individual product-category card component.
 *              Features:
 *   - Image with zoom-on-hover
 *   - Gradient overlay that deepens on hover
 *   - Animated tag badge (fade-in on hover)
 *   - Title, item count, description
 *   - Animated "Shop Now →" CTA (slides up on hover)
 *   - Full keyboard accessibility (Enter / Space triggers navigation)
 *   - Google Analytics event on click
 * @version 2.0.0
 */

import { useNavigate } from "react-router-dom";

/* ── Inline SVG: Arrow icon ─────────────────────────────────── */
const IconArrow = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 8h10M8 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Component ───────────────────────────────────────────────── */
function CollectionCard({ data }) {
  const navigate = useNavigate();

  /* Guard: return nothing when data is missing */
  if (!data) return null;

  const { id, title, slug, image, tag, itemCount, description } = data;

  /* ── Click handler ─────────────────────────────────────────── */
  const handleNavigate = () => {
    /* Fire analytics event when gtag is available */
    if (window.gtag) {
      window.gtag("event", "collection_card_click", {
        collection_id:    id,
        collection_title: title,
        collection_slug:  slug,
      });
    }
    navigate(`/category/${slug}`);
  };

  /* ── Keyboard handler ──────────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <article className="collection-card-article">
      <div
        className="collection-card"
        onClick={handleNavigate}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Browse ${title} — ${itemCount} styles available`}
      >
        {/* ── Product image ───────────────────────────────── */}
        <img
          className="collection-card__img"
          src={image}
          alt={`${title} collection preview — ${description}`}
          loading="lazy"
          decoding="async"
        />

        {/* ── Category tag — revealed on hover ────────────── */}
        {tag && (
          <span className="collection-card__tag" aria-hidden="true">
            {tag}
          </span>
        )}

        {/* ── Gradient overlay with content ───────────────── */}
        <div className="collection-card__overlay">
          <div className="collection-card__body">

            {/* Title */}
            <h3 className="collection-card__title">{title}</h3>

            {/* Item count */}
            {itemCount && (
              <span className="collection-card__count">
                {itemCount} Styles
              </span>
            )}

            {/* Description — visible on larger cards */}
            {description && (
              <p className="collection-card__desc">{description}</p>
            )}

            {/* Shop CTA — slides up on hover */}
            <span className="collection-card__cta" aria-hidden="true">
              Shop Now <IconArrow />
            </span>

          </div>
        </div>
      </div>
    </article>
  );
}

export default CollectionCard;