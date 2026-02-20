import { useState } from "react";
import "./ContactPage.css";

function ContactPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <div className="contact-wrapper">

      {/* HERO */}
      <section className="contact-hero">
        <h1>Let’s Build Your Brand Together</h1>
        <p>
          Connect with Vaakya Creations for premium ladies clothing,
          custom branding, and wholesale inquiries.
        </p>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-section">

        {/* LEFT SIDE */}
        <div className="contact-info">

          <h2>Contact Information</h2>

          <div className="info-box">
            <h4>📍 Location</h4>
            <p>Vijayawada, Andhra Pradesh, India</p>
          </div>

          <div className="info-box">
            <h4>📞 Phone</h4>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-box">
            <h4>📧 Email</h4>
            <p>support@vaakyacreations.com</p>
          </div>

          <div className="info-box">
            <h4>🕒 Working Hours</h4>
            <p>Mon – Sat: 10AM – 7PM</p>
          </div>

          {/* WHATSAPP BUTTON */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            Chat on WhatsApp
          </a>

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="contact-form-container">

          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="contact-form">

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>

            {submitted && (
              <div className="success-msg">
                Message sent successfully!
              </div>
            )}

          </form>

        </div>

      </section>

      {/* MAP SECTION */}
      <section className="contact-map">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15310.123456789!2d80.648!3d16.506!"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>

    </div>
  );
}

export default ContactPage;