
const GlobalCTA = ({
  title,
  buttonText,
  buttonLink,
  backgroundImage,
  className = ""
}) => {
  return (
    <section
      className={`global-cta ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="global-cta-overlay"></div>

      <div className="container global-cta-content">
        <h2>{title}</h2>

        <a href={buttonLink} className="read-more-btn">
         <span>{buttonText}</span>  
        </a>
      </div>
    </section>
  );
};

export default GlobalCTA;
