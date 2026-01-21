import React from "react";


const Contactmap = () => {
  return (
    <section className="contact-section-two">
      <div className="container">

        {/* Map Section */}
        <div className="map-wrapper">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Ramji+Pura,+Near+Achalapura,+Siddhpur-384141+Dist+-+Patan+Gujarat&output=embed"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default Contactmap;