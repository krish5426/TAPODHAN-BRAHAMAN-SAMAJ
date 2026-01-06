import gallery1 from '../assets/images/gallery1.jpg';
import gallery2 from '../assets/images/gallery2.jpg';
import gallery3 from '../assets/images/gallery3.jpg';
import gallery4 from '../assets/images/gallery4.jpg';
import gallery5 from '../assets/images/gallery5.jpg';
import gallery6 from '../assets/images/gallery6.jpg';

const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      src: gallery1,
      alt: "Cultural Performance"
    },
    {
      id: 2,
      src: gallery2,
      alt: "Community Gathering"
    },
    {
      id: 3,
      src: gallery3,
      alt: "Unity and Friendship"
    },
    {
      id: 4,
      src: gallery4,
      alt: "Community Meeting"
    },
    {
      id: 5,
      src: gallery5,
      alt: "Innovation Awards"
    },
    {
      id: 6,
      src: gallery6,
      alt: "Education Awards"
    }
  ];

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="header-section">
          <span className="header-label">Gallery</span>
          <h2 className="header-title">
            <strong> Capturing <span>Our</span><br />
              <span>Community </span>Spirit</strong>
          </h2>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;