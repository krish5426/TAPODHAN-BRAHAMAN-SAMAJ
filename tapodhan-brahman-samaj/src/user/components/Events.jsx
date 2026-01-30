import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import '../css/style.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const eventImageRef = useRef(null);
  const eventDetailRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.EVENTS);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Transform data if needed
        // Backend returns: id, title, description, date, day, month, category, details, address, posterImage
        // We need to ensure posterImage has full URL if it's a filename
        const processedEvents = data.map(event => ({
          ...event,
          posterImage: event.posterImage ? 
            (event.posterImage.startsWith('http') ? event.posterImage : `${API_ENDPOINTS.UPLOADS}/${event.posterImage}`) 
            : null,
            featured: true 
        }));
        
        setEvents(processedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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