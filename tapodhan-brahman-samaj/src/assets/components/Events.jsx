import eventOne from '../images/event1.jpg';
import eventTwo from '../images/event2.jpg';
import eventThree from '../images/event3.jpg';
import eventFour from '../images/event3.jpg';

const Events = () => {
  const events = [
    {
      id: 1,
      date: "25",
      month: "Mar",
      category: "Organized by Tapodhan Brahmin Samaj Charitable Trust",
      title: "Recitation of the Shiva Mahapuran for the salvation of the ancestors",
      description: "Vyas Peeth : Shri Girdharidas Shastri Shri Rami Patan",
      details: "Date : Chaitra Sud Satam, Wednesday to Chaitra Sud Poornima, Tuesday, March 25, Wednesday to April 2, Tuesday, 2025",
      address: "Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015",
      type: "featured",
      image: eventOne
    },  
    {
      id: 2,
      date: "25",
      month: "DEC",
      category: "CAMP",
      title: "Our Samaj United in Saving Lives.",
      type: "regular",
      image: eventTwo
    },
    {
      id: 3,
      date: "12",
      month: "JAN",
      category: "SOCIAL ACTIVITY",
      title: "Celebrating Life, Love & Laughter",
      type: "regular",
      image: eventThree
    },
    {
      id: 4,
      date: "22",
      month: "JAN",
      category: "AWARD",
      title: "Where Energy Meets Excellence.",
      type: "regular",
      image: eventFour
    }
  ];

  return (
    <section className="events-section">
      <div className="container">
        <div className="header-section">
          <span className="header-label">Upcoming Events</span>
          <h2 className="header-title"><strong>Get Ready <span>for What's</span> Next!</strong></h2>
        </div>
        
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className={`event-card ${event.type}`}>
              <div className="event-date">
                <span className="date">{event.date}</span>
                <span className="month">{event.month}</span>
              </div>
              
              <div className="event-content">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                </div>
                <div className="event-detail">
                    <span className="event-category">{event.category}</span>
                    <h3 
                      className="event-title"
                      onClick={() => console.log(`Clicked event: ${event.title}`)}
                    >
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