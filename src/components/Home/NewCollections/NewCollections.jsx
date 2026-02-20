import { useNavigate } from "react-router-dom";
import "./NewCollections.css";
import CollectionCard from "./CollectionCard";
import collectionsData from "./collectionsData";

function NewCollections() {

  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/category/all");
  };

  return (
    <section className="new-collections">

      <div className="collections-header">

        <h2>New Collections</h2>

        <p>
          New Season, New Statement. Explore Our Four Signature Collections —
          From Bold Luxe To Breezy Everyday Style That Moves With You.
        </p>

        <button
          className="view-all-btn"
          onClick={handleViewAll}
        >
          View All Collections
        </button>

      </div>

      <div className="collections-grid">
        {collectionsData.map((item) => (
          <CollectionCard
            key={item.id}
            data={item}
          />
        ))}
      </div>

    </section>
  );
}

export default NewCollections;