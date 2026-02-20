import "./FeatureCollections.css";
import featureData from "./featureData";
import FeatureCard from "./FeatureCard";

function FeatureCollections() {
  return (
    <section className="feature-collections">
      <div className="feature-header">
        <h2>Explore The Vast World Of Variety Collections.</h2>
        <p>
          Luxurious pieces for every occasion — from modern minimal styles to
          timeless traditional wear. Upgrade your wardrobe with confidence.
        </p>
      </div>

      <div className="feature-grid">
        {featureData.map((item) => (
          <FeatureCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
}

export default FeatureCollections;