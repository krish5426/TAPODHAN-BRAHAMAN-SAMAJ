import React, { useState, useEffect } from 'react';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import { API_ENDPOINTS } from '../config/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Events' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.EVENTS);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
  const pastEvents = events.filter(event => new Date(event.date) < today);
  
  const latestEvent = upcomingEvents[0]; // Next upcoming event (earliest date)

  if (loading) {
    return (
      <>
        <InnerBanner title="Events" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <section className="events-content">
          <div className="container">
            <p>Loading events...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <InnerBanner
        title="Events"
        breadcrumb={breadcrumb}
        backgroundImage={bannerImage}
      />
      
      <section className="events-section">
        <div className="container">
          {/* Latest Event Section */}
          {latestEvent && (
            <>
              <div className="header-section">
                <span className="header-label">Upcoming Event</span>
                
              </div>
              
              <div className="event-card featured" style={{ marginBottom: '60px' }}>
                <div className="event-date">
                  <span className="date">{latestEvent.day}</span>
                  <span className="month">{latestEvent.month}</span>
                </div>
                <div className="event-content">
                  <div className="event-image">
                    <img src={`${API_ENDPOINTS.UPLOADS}/${latestEvent.posterImage}`} alt={latestEvent.title} />
                  </div>
                  <div className="event-detail">
                    <span className="event-category">{latestEvent.category}</span>
                    <h3 className="event-title">{latestEvent.title}</h3>
                    {latestEvent.description && (
                      <p className="event-description event-cont-row">{latestEvent.description}</p>
                    )}
                    {latestEvent.details && (
                      <p className="event-details event-cont-row">{latestEvent.details}</p>
                    )}
                    {latestEvent.address && (
                      <p className="event-address event-cont-row">{latestEvent.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <>
              <div className="header-section">
                <span className="header-label">Past Events</span>
                
              </div>
              
              <div className="events-grid">
                {pastEvents.map((event) => (
                  <div key={event.id} className="event-card regular">
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
                        <h3 className="event-title">{event.title}</h3>
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
            </>
          )}

          {events.length === 0 && !loading && (
            <div className="header-section">
              <p>No events found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;