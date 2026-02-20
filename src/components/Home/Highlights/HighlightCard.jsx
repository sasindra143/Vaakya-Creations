import { useNavigate } from "react-router-dom";

function HighlightCard({ data }) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(data.link);
  };

  return (
    <div className="highlight-card">
      <div className="highlight-image">
        <img src={data.image} alt={data.title} loading="lazy" />
      </div>

      <div className="highlight-content">
        <span className="highlight-category">{data.category}</span>
        <h3>{data.title}</h3>
        <p>{data.description}</p>

        <button className="read-btn" onClick={handleClick}>
          Read More
        </button>
      </div>
    </div>
  );
}

export default HighlightCard;