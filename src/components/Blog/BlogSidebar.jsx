function BlogSidebar({ categories, selectedCategory, setSelectedCategory }) {

  return (
    <div className="blog-sidebar">
      <h3>Categories</h3>

      {categories.map(cat => (
        <button
          key={cat}
          className={
            selectedCategory === cat
              ? "active"
              : ""
          }
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default BlogSidebar;