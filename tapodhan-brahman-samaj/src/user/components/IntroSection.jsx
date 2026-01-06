const IntroSection = ({
    tag,
    title,
     title2,
    highlightedText,
    description,
    image,
    className = ""
}) => {
  return (
    <section className={`intro-section ${className}`}>
      <div className="container about-intro-grid">

        <div className="about-intro-image">
          <img src={image} alt={title} />
        </div>

        <div className="about-intro-content">
          <span className="about-tag">{tag}</span>

          <h2>
            {title} <span>{highlightedText}</span>
          </h2>
        <h2>
            {title2} <span>{highlightedText}</span>
        </h2>
          <p>{description}</p>
        </div>

      </div>
    </section>
  );
};

export default IntroSection;