import { useEffect } from "react";
import BrandingHero from "../../components/Branding/BrandingHero";
import BrandingServices from "../../components/Branding/BrandingServices";
import BrandingProcess from "../../components/Branding/BrandingProcess";
import BrandingGallery from "../../components/Branding/BrandingGallery";
import BrandingCTA from "../../components/Branding/BrandingCTA";
import "./CustomizedBranding.css";

function CustomizedBranding() {

  /* Scroll Reveal Animation */
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="branding-wrapper">
      <BrandingHero />
      <BrandingServices />
      <BrandingProcess />
      <BrandingGallery />
      <BrandingCTA />
    </div>
  );
}

export default CustomizedBranding;