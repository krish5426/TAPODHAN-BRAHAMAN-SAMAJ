import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.EVENTS);
      const data = await response.json();
      setEvents(data.slice(0, 4)); // Show only first 4 events
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="events-section">
        <div className="container">
          <p>Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="events-section">
      <div className="container">
        <div className="header-section">
          <span className="header-label">Upcoming Events</span>
          <h2 className="header-title"><strong>Get Ready <span>for What's</span> Next!</strong></h2>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className={`event-card ${event.id === events[0]?.id ? 'featured' : 'regular'}`}>
              <div className="event-date">
                <span className="date">{event.day}</span>
                <span className="month">{event.month}</span>
              </div>

              <div className="event-content">
                <div className="event-image">
                  <img src={`${API_ENDPOINTS.UPLOADS}/${event.posterImage}`} alt={event.title} />
                </div>
                <div className="event-detail">
                  <span className="event-category">{event.category}</span>
                  <h3 className="event-title">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="event-description event-cont-row">{event.description}</p>
                  )}

                  {event.details && (
                    <p className="event-details event-cont-row">{event.details}</p>
                  )}

                  {event.address && (
                    <p className="event-address event-cont-row">{event.address}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;