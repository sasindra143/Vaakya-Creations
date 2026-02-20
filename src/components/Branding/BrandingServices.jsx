function BrandingServices() {

  const services = [
    {
      title: "Private Label Manufacturing",
      desc: "Launch your own ladies clothing line with fully customized production."
    },
    {
      title: "Fabric Selection",
      desc: "Premium silk, cotton, georgette and designer fabrics curated for women."
    },
    {
      title: "Custom Packaging",
      desc: "Luxury packaging with your brand logo and identity."
    },
    {
      title: "Logo & Tag Printing",
      desc: "High-quality woven labels, printed tags & custom branding."
    }
  ];

  return (
    <section className="branding-services reveal">
      <h2>What We Offer</h2>

      <div className="branding-grid">
        {services.map((service, index) => (
          <div key={index} className="branding-card">
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandingServices;