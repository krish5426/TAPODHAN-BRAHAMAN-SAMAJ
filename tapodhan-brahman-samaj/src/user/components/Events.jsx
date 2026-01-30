import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import shivaImage from '../assets/images/about-image.jpg';
import team from '../assets/images/team.jpg'
import grid from '../assets/images/grid-image.png'
import qr from '../assets/images/Location.jpeg'
import '../css/style.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const eventImageRef = useRef(null);
  const eventDetailRef = useRef(null);

  // Static event data with multiple events
  const staticEvents = [
    {
      id: 1,
      day: '25',
      month: 'MAR',
      category: 'Organized by Tapodhan Brahmin Samaj Charitable Trust',
      title: 'Recitation of the Shiva Mahapuran for the salvation of the ancestors',
      description: 'Vyas Peeth ',
      details: 'Date : Chaitra Sud Satam, Wednesday',
      address: 'Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015',
      posterImage: shivaImage,
      featured: true
    },
    {
      id: 2,
      day: '15',
      month: 'APR',
      category: 'Organized by Tapodhan Brahmin Samaj Charitable Trust',
      title: 'Annual Brahmin Community Gathering and Cultural Program',
      description: 'Vyas Peeth : Shri Girdharidas Shastri Shri Rami Patan',
      details: 'Date : April 15, 2025',
      address: 'Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015',
      posterImage: team,
      featured: true
    },
    {
      id: 3,
      day: '05',
      month: 'MAY',
      category: 'Organized by Tapodhan Brahmin Samaj Charitable Trust',
      title: 'Religious Discourse and Meditation Session',
      description: 'Vyas Peeth : Shri Girdharidas Shastri Shri Rami Patan',
      details: 'Date : May 5-7, 2025',
      address: 'Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015',
      posterImage: grid,
      featured: true
    },
    {
      id: 4,
      day: '20',
      month: 'JUN',
      category: 'Organized by Tapodhan Brahmin Samaj Charitable Trust',
      title: 'Youth Empowerment and Skill Development Workshop',
      description: 'Vyas Peeth : Shri Girdharidas Shastri Shri Rami Patan',
      details: 'Date : June 20-22, 2025',
      address: 'Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015',
      posterImage: qr,
      featured: true
    }
  ];

  useEffect(() => {
    // Set static events
    setEvents(staticEvents);
    setLoading(false);
  }, []);

  const handleEventChange = (newIndex) => {
    if (newIndex !== currentEventIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentEventIndex(newIndex);

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Match this with CSS transition duration
    }
  };

  const handlePrevious = () => {
    const newIndex = currentEventIndex === 0 ? events.length - 1 : currentEventIndex - 1;
    handleEventChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentEventIndex === events.length - 1 ? 0 : currentEventIndex + 1;
    handleEventChange(newIndex);
  };

  if (loading || events.length === 0) {
    return (
      <section className="events-section">
        <div className="container">
          <p>Loading events...</p>
        </div>
      </section>
    );
  }

  const currentEvent = events[currentEventIndex];

  return (
    <section className="events-section">
      <div className="container">
        <div className="header-section">
          <span className="header-label">Upcoming Events</span>
          <h2 className="header-title-center"><strong>Get Ready <span>for What's</span> Next!</strong></h2>
        </div>

        <div className="events-carousel-container">
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentEventIndex * 100}%)`, transition: isTransitioning ? 'transform 600ms ease' : 'transform 600ms ease' }}
            >
              {events.map((ev, idx) => (
                <div className="carousel-item" key={ev.id}>
                  <div className={`event-card ${ev.featured ? 'featured' : 'regular'}`}>
                    <div className="event-date">
                      <span className="date">{ev.day}</span>
                      <span className="month">{ev.month}</span>
                    </div>

                    <div className="event-content">
                      <div className="event-image">
                        <img src={ev.posterImage} alt={ev.title} className="carousel-image" />
                      </div>
                      <div className="event-detail">
                        <span className="event-category">{ev.category}</span>
                        <h3 className="event-title">{ev.title}</h3>

                        {ev.description && <p className="event-description event-cont-row">{ev.description}</p>}
                        {ev.details && <p className="event-details event-cont-row">{ev.details}</p>}
                        {ev.address && <p className="event-address event-cont-row">{ev.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls below-viewport">
            <div className="carousel-indicators">
              {events.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentEventIndex ? 'active' : ''}`}
                  onClick={() => handleEventChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;