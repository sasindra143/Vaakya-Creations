import { useNavigate } from "react-router-dom";
import "./NewCollections.css";

const CollectionCard = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${data.slug}`);
  };

  return (
    <div className="collection-card" onClick={handleClick}>

      <div className="collection-image-wrapper">
        <img src={data.image} alt={data.title} />

        <div className="collection-overlay">
          <span>Explore Collection</span>
        </div>
      </div>

      <div className="collection-footer">
        <span>{data.title}</span>
        <span className="arrow">↗</span>
      </div>

    </div>
  );
};

export default CollectionCard;