function FilterSidebar({ setMaxPrice }) {
  return (
    <div className="filter-sidebar">
      <h3>Filter</h3>

      <label>Max Price</label>
      <input
        type="range"
        min="0"
        max="10000"
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>
  );
}

export default FilterSidebar;