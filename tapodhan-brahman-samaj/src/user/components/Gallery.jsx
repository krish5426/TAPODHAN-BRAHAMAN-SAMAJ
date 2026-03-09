import gallery01 from '../assets/images/gallery01.jpg';
import gallery02 from '../assets/images/gallery02.jpg';
import gallery03 from '../assets/images/gallery03.jpg';
import gallery04 from '../assets/images/gallery04.jpg';
import gallery05 from '../assets/images/gallery05.jpg';
import gallery06 from '../assets/images/gallery06.jpg';
import gallery07 from '../assets/images/gallery07.jpg';
import gallery08 from '../assets/images/gallery08.jpg';
import gallery09 from '../assets/images/gallery09.jpg';

const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      src: gallery01,
      alt: "Cultural Performance"
    },
    {
      id: 2,
      src: gallery02,
      alt: "Community Gathering"
    },
    {
      id: 3,
      src: gallery03,
      alt: "Unity and Friendship"
    },
    {
      id: 4,
      src: gallery04,
      alt: "Education Awards"
    },
    {
      id: 5,
      src: gallery08,
      alt: "Community Event"
    },
    {
      id: 6,
      src: gallery09,
      alt: "Innovation Awards"
    }
  ];

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="header-section">
          <span className="header-label">Gallary</span>
          <h2 className="header-title-center">
            <strong> Capturing </strong><span>Our</span><br />
            <span>Community </span><strong>Spirit</strong>
          </h2>
        </div>

        <div className="gallery-grid">
          {galleryImages.slice(0, 6).map((image) => (
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