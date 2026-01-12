const { connectDB } = require('./mysql-config');

const modifyEventsTable = async () => {
  const pool = await connectDB();
  
  try {
    // Add new columns to events table
    await pool.execute(`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS day VARCHAR(10),
      ADD COLUMN IF NOT EXISTS month VARCHAR(10),
      ADD COLUMN IF NOT EXISTS category VARCHAR(255),
      ADD COLUMN IF NOT EXISTS details TEXT,
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS type ENUM('featured', 'regular') DEFAULT 'regular',
      ADD COLUMN IF NOT EXISTS image VARCHAR(255)
    `);

    console.log('Events table modified successfully');
    
    // Insert static data
    const events = [
      {
        day: "25",
        month: "Mar",
        title: "Recitation of the Shiva Mahapuran for the salvation of the ancestors",
        description: "Vyas Peeth : Shri Girdharidas Shastri Shri Rami Patan",
        category: "Organized by Tapodhan Brahmin Samaj Charitable Trust",
        details: "Date : Chaitra Sud Satam, Wednesday to Chaitra Sud Poornima, Tuesday, March 25, Wednesday to April 2, Tuesday, 2025",
        address: "Address : Tapodhan Brahmins Community Farm, Ramji Pura, Sukhsagar - 382015",
        date: "2025-03-25",
        type: "featured",
        image: "event1.jpg"
      },
      {
        day: "25",
        month: "DEC",
        title: "Our Samaj United in Saving Lives.",
        category: "CAMP",
        date: "2024-12-25",
        type: "regular",
        image: "event2.jpg"
      },
      {
        day: "12",
        month: "JAN",
        title: "Celebrating Life, Love & Laughter",
        category: "SOCIAL ACTIVITY",
        date: "2025-01-12",
        type: "regular",
        image: "event3.jpg"
      },
      {
        day: "22",
        month: "JAN",
        title: "Where Energy Meets Excellence.",
        category: "AWARD",
        date: "2025-01-22",
        type: "regular",
        image: "event4.jpg"
      }
    ];

    // Clear existing events and insert new ones
    await pool.execute('DELETE FROM events');
    
    for (const event of events) {
      await pool.execute(`
        INSERT INTO events (day, month, title, description, category, details, address, date, type, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        event.day, event.month, event.title, event.description || null,
        event.category, event.details || null, event.address || null,
        event.date, event.type, event.image
      ]);
    }

    console.log('Static events data inserted successfully');
    
  } catch (error) {
    console.error('Error modifying events table:', error);
  } finally {
    process.exit(0);
  }
};

modifyEventsTable();