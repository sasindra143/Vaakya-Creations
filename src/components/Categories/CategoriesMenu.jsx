import { Link } from "react-router-dom";

function CategoriesMenu() {
  return (
    <div className="categories-menu">
      <Link to="/category/pattu-sarees">Pattu Sarees</Link>
      <Link to="/category/dresses">Dresses</Link>
      <Link to="/category/kurtis">Kurtis</Link>
    </div>
  );
}

export default CategoriesMenu;