import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {

  const navigate = useNavigate();

  return (
    <div
      className="blog-card reveal"
      onClick={() => navigate(`/blog/${blog.slug}`)}
    >
      <div className="blog-image">
        <img src={blog.image} alt={blog.title} />
      </div>

      <div className="blog-content">
        <span className="blog-category">{blog.category}</span>
        <h3>{blog.title}</h3>
        <div className="blog-meta">
          <span>{blog.date}</span>
          <span>{blog.readTime}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;