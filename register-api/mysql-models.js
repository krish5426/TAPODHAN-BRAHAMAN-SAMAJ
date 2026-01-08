const { getPool } = require('./mysql-config');

class User {
  static async create(userData) {
    const pool = getPool();
    const { firstName, lastName, email, mobile, password, registerForProfile, acceptTerms } = userData;

    const [result] = await pool.execute(
      'INSERT INTO users (firstName, lastName, email, mobile, password, registerForProfile, acceptTerms) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, mobile, password, registerForProfile, acceptTerms]
    );

    return { id: result.insertId, ...userData };
  }

  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findByMobile(mobile) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE mobile = ?', [mobile]);
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll() {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY createdAt DESC');
    return rows;
  }
}

class Admin {
  static async create(adminData) {
    const pool = getPool();
    const { firstName, lastName, email, mobile, password, isMainAdmin, role, status } = adminData;

    const [result] = await pool.execute(
      'INSERT INTO admins (firstName, lastName, email, mobile, password, isMainAdmin, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, mobile, password, isMainAdmin, role, status]
    );

    return { id: result.insertId, ...adminData };
  }

  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async updateStatus(id, status, approvedBy = null) {
    const pool = getPool();
    const approvedAt = status === 'approved' ? new Date() : null;

    await pool.execute(
      'UPDATE admins SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?',
      [status, approvedBy, approvedAt, id]
    );
  }
}

class Profile {
  static async create(profileData) {
    const pool = getPool();
    const fields = Object.keys(profileData).join(', ');
    const placeholders = Object.keys(profileData).map(() => '?').join(', ');
    const values = Object.values(profileData);

    const [result] = await pool.execute(
      `INSERT INTO profiles (${fields}) VALUES (${placeholders})`,
      values
    );

    return { id: result.insertId, ...profileData };
  }

  static async findByUserId(userId) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM profiles WHERE userId = ?', [userId]);
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM profiles WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM profiles WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.gender) {
      query += ' AND gender = ?';
      params.push(filters.gender);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async updateStatus(id, status, approvedBy = null) {
    const pool = getPool();
    const approvedAt = status === 'approved' ? new Date() : null;

    await pool.execute(
      'UPDATE profiles SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?',
      [status, approvedBy, approvedAt, id]
    );
  }
}

class Business {
  static async create(businessData) {
    const pool = getPool();
    const {
      userId, businessName, ownerName, email, contactNumber, address, posterPhoto, status = 'pending',
      category, businessType, description, website, city, state
    } = businessData;

    const [result] = await pool.execute(
      `INSERT INTO businesses (
        userId, businessName, ownerName, email, contactNumber, address, posterPhoto, status,
        category, businessType, description, website, city, state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, businessName, ownerName, email, contactNumber, address, posterPhoto, status,
        category, businessType, description, website, city, state
      ]
    );

    return { id: result.insertId, ...businessData };
  }

  static async findByUserId(userId) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM businesses WHERE userId = ?', [userId]);
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM businesses WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM businesses WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.businessName) {
      query += ' AND businessName LIKE ?';
      params.push(`%${filters.businessName}%`);
    }

    if (filters.location) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async updateStatus(id, status, approvedBy = null) {
    const pool = getPool();
    const approvedAt = status === 'approved' ? new Date() : null;

    await pool.execute(
      'UPDATE businesses SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?',
      [status, approvedBy, approvedAt, id]
    );
  }

  static async update(id, businessData) {
    const pool = getPool();
    const {
      businessName, ownerName, email, contactNumber, address, posterPhoto, status,
      category, businessType, description, website, city, state
    } = businessData;

    const fields = [];
    const values = [];

    if (businessName) { fields.push('businessName = ?'); values.push(businessName); }
    if (ownerName) { fields.push('ownerName = ?'); values.push(ownerName); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (contactNumber) { fields.push('contactNumber = ?'); values.push(contactNumber); }
    if (address) { fields.push('address = ?'); values.push(address); }
    if (posterPhoto) { fields.push('posterPhoto = ?'); values.push(posterPhoto); }
    if (status) { fields.push('status = ?'); values.push(status); }
    if (category) { fields.push('category = ?'); values.push(category); }
    if (businessType) { fields.push('businessType = ?'); values.push(businessType); }
    if (description) { fields.push('description = ?'); values.push(description); }
    if (website) { fields.push('website = ?'); values.push(website); }
    if (city) { fields.push('city = ?'); values.push(city); }
    if (state) { fields.push('state = ?'); values.push(state); }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE businesses SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) return null;

    return { id, ...businessData };
  }
}

class Event {
  static async create(eventData) {
    const pool = getPool();
    const { title, description, date, images = [] } = eventData;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        'INSERT INTO events (title, description, date) VALUES (?, ?, ?)',
        [title, description, date]
      );

      const eventId = result.insertId;

      // Insert images
      for (const imagePath of images) {
        await connection.execute(
          'INSERT INTO event_images (eventId, imagePath) VALUES (?, ?)',
          [eventId, imagePath]
        );
      }

      await connection.commit();
      return { id: eventId, title, description, date, images };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll() {
    const pool = getPool();
    const [events] = await pool.execute('SELECT * FROM events ORDER BY date DESC');

    // Get images for each event
    for (const event of events) {
      const [images] = await pool.execute(
        'SELECT imagePath FROM event_images WHERE eventId = ?',
        [event.id]
      );
      event.images = images.map(img => img.imagePath);
    }

    return events;
  }

  static async findById(id) {
    const pool = getPool();
    const [events] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);

    if (events.length === 0) return null;

    const event = events[0];
    const [images] = await pool.execute(
      'SELECT imagePath FROM event_images WHERE eventId = ?',
      [id]
    );
    event.images = images.map(img => img.imagePath);

    return event;
  }
}

class ProfileRequest {
  static async create(requestData) {
    const pool = getPool();
    const { profileId, userId, status = 'pending' } = requestData;

    const [result] = await pool.execute(
      'INSERT INTO profile_requests (profileId, userId, status) VALUES (?, ?, ?)',
      [profileId, userId, status]
    );

    return { id: result.insertId, ...requestData };
  }

  static async findAll(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM profile_requests WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async updateStatus(id, status, approvedBy = null) {
    const pool = getPool();
    const approvedAt = status === 'approved' ? new Date() : null;

    await pool.execute(
      'UPDATE profile_requests SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?',
      [status, approvedBy, approvedAt, id]
    );
  }
}

module.exports = { User, Admin, Profile, ProfileRequest, Business, Event };