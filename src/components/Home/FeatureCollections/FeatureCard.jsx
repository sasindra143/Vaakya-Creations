function FeatureCard({ data }) {
  return (
    <div className="feature-card">
      <div className="feature-image-wrapper">
        <img src={data.image} alt={data.title} loading="lazy" />
      </div>

      <div className="feature-content">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;