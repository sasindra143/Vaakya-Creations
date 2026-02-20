function BrandingGallery() {

  const images = [
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
    "https://images.unsplash.com/photo-1520975918318-4b1c4b6b7d9f",
    "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"
  ];

  return (
    <section className="branding-gallery reveal">
      <h2>Our Work</h2>

      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-item">
            <img src={img} alt="Branding Work" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandingGallery;