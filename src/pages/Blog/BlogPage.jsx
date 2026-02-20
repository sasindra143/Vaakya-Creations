import { Link } from "react-router-dom";
import blogData from "../../data/blogData";
import "./BlogPage.css";

function BlogPage() {
  return (
    <div className="blog-container">

      {/* HERO */}
      <div className="blog-hero">
        <h1>Vaakya Creations Blog</h1>
        <p>
          Fashion insights, branding strategies and style inspiration
          for modern women.
        </p>
      </div>

      {/* BLOG GRID */}
      <div className="blog-grid">

        {blogData.map((blog) => (
          <div key={blog.id} className="blog-card">

            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
            </div>

            <div className="blog-content">
              <span className="blog-date">{blog.date}</span>

              <h2>{blog.title}</h2>

              <p>{blog.excerpt}</p>

              <Link to={`/blog/${blog.slug}`} className="read-more">
                Read More →
              </Link>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default BlogPage;