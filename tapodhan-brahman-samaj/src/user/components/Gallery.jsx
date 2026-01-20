import gallery01 from '../assets/images/gallery01.jpg';
import gallery02 from '../assets/images/gallery02.jpg';
import gallery03 from '../assets/images/gallery03.jpg';
import gallery04 from '../assets/images/gallery04.jpg';
import gallery06 from '../assets/images/gallery06.jpg';
import gallery07 from '../assets/images/gallery07.jpg';
import gallery08 from '../assets/images/gallery08.jpg';

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
      alt: "Community Meeting"
    },
    {
      id: 5,
      src: gallery06,
      alt: "Innovation Awards"
    },
    {
      id: 6,
      src: gallery07,
      alt: "Education Awards"
    },
    {
      id: 7,
      src: gallery08,
      alt: "Community Event"
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