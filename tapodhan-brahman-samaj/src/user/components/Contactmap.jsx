import React from "react";
import locationImage from '../assets/images/Location.jpeg';




const Contactmap = () => {
  return (
    <section className="contact-section-two">
      
      <div className="container-contact">

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
        <div className="qr-map">
       <img 
        src={locationImage} 
        alt="Location photo" 
        className="location-img" 
        
      />
    </div>
        </div>
    </section>
  );
};

export default Contactmap;