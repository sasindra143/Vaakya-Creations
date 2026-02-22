import "./MegaMenu.css";

const MegaMenu = ({ open, onCategoryClick }) => {
  return (
    <div className={`vc-mega-menu ${open ? "open" : ""}`}>

      {/* ================= SAREES ================= */}
      <div className="vc-mega-col">
        <h4>Sarees</h4>

        <p onClick={() => onCategoryClick("pattu-sarees")}>
          Pattu Sarees
        </p>

        <p onClick={() => onCategoryClick("fancy-sarees")}>
          Fancy Sarees
        </p>

        <p onClick={() => onCategoryClick("sarees")}>
          All Sarees
        </p>
      </div>

      {/* ================= CLOTHING ================= */}
      <div className="vc-mega-col">
        <h4>Clothing</h4>

        <p onClick={() => onCategoryClick("kurtis")}>
          Kurtis
        </p>

        <p onClick={() => onCategoryClick("dresses")}>
          Dresses
        </p>

        <p onClick={() => onCategoryClick("tops")}>
          Tops
        </p>

        <p onClick={() => onCategoryClick("blouses")}>
          Blouses
        </p>
      </div>

      {/* ================= JEWELLERY ================= */}
      <div className="vc-mega-col">
        <h4>Jewellery</h4>

        <p onClick={() => onCategoryClick("handmade-jewellery")}>
          Handmade Jewellery
        </p>
      </div>

    </div>
  );
};

export default MegaMenu;