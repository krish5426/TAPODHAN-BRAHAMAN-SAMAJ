import React from "react";
import { Link } from "react-router-dom";

const InnerBanner = ({
  title,
  breadcrumb = [],
  backgroundImage
}) => {
  return (
    <section
      className="inner-banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="inner-banner-overlay"></div>

      <div className="inner-banner-content container">
        <h1>{title}</h1>

        <nav className="breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {index !== 0 && <span className="separator">›</span>}
              {item.link ? (
                <Link to={item.link}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default InnerBanner;
