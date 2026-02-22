import "./MobileDrawer.css";

const MobileDrawer = ({ open, onClose }) => {
  return (
    <div className={`vc-mobile-drawer ${open ? "open" : ""}`}>

      <button
        className="vc-close-mobile"
        onClick={onClose}
      >
        ✕
      </button>

      <nav className="vc-mobile-nav">
        <a href="/">Home</a>
        <a href="#">Sarees</a>
        <a href="#">Kurtis</a>
        <a href="#">Frocks</a>
        <a href="#">Jewellery</a>
        <a href="#">Contact</a>
      </nav>

    </div>
  );
};

export default MobileDrawer;