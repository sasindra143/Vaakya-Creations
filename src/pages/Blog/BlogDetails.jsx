import { useParams } from "react-router-dom";
import blogData from "../../data/blogData";
import "./BlogPage.css";

function BlogDetails() {

  const { slug } = useParams();

  const blog = blogData.find(
    (b) => b.slug === slug
  );

  if (!blog) {
    return (
      <div className="blog-not-found">
        Blog not found
      </div>
    );
  }

  return (
    <div className="blog-details">

      <div className="blog-details-hero">
        <img src={blog.image} alt={blog.title} />
      </div>

      <div className="blog-details-content">
        <h1>{blog.title}</h1>
        <span className="blog-date">{blog.date}</span>
        <p>{blog.content}</p>
      </div>

    </div>
  );
}

export default BlogDetails;