const AboutFounders = ({ founders }) => {
  return (
    <section className="about-founders">
      <div className="container">

        <h3 className="founders-text">
          Our Trust was founded in the{" "}
          <strong>year 2013</strong> by following visionary, <br />
          <strong> passionate & dedicated individuals</strong> from
          Tapodhan Brahman Samaj.
        </h3>

        <div className="founders-grid">
          {founders.map((item, index) => (
            <div className="founder-card" key={index}>
              <div className="founder-image">
            <img src={item.image} alt={item.name} /></div>
              <p className="founder-name">{item.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutFounders;
