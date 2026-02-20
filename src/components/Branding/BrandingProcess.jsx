function BrandingProcess() {

  const steps = [
    "Consultation & Design Discussion",
    "Fabric & Sample Approval",
    "Bulk Production",
    "Quality Check",
    "Packaging & Dispatch"
  ];

  return (
    <section className="branding-process reveal">
      <h2>Our Branding Process</h2>

      <div className="process-timeline">
        {steps.map((step, index) => (
          <div key={index} className="process-step">
            <div className="circle">{index + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandingProcess;