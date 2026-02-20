import "./Footer.css";

import Newsletter from "./Newsletter";
import InstagramFeed from "./InstagramFeed";
import WhatsAppFloat from "./WhatsAppFloat";

function Footer() {
  return (
    <>
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-col">
            <h2 className="footer-logo">Tarang Collections</h2>
            <p>
              Luxury Ladies Fashion Showroom –
              Premium Sarees, Kurtis, Dresses & Jewellery.
            </p>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>Collections</li>
              <li>Offers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Categories</h3>
            <ul>
              <li>Sarees</li>
              <li>Pattu Sarees</li>
              <li>Fancy Sarees</li>
              <li>Kurtis</li>
              <li>Dresses</li>
              <li>Jewellery</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <p>Hyderabad, Telangana</p>
            <p>+91 98765 43210</p>
            <p>support@tarangcollections.com</p>
          </div>

        </div>

        <Newsletter />
        <InstagramFeed />

        <div className="footer-bottom">
          © {new Date().getFullYear()} Tarang Collections.
          All Rights Reserved.
        </div>

      </footer>

      <WhatsAppFloat />
    </>
  );
}

export default Footer;