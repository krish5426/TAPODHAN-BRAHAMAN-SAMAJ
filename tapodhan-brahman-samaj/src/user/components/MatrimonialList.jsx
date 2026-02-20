import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileImg from "../../assets/images/profileimg.png";
import brideDefault from "../../assets/images/defaultfemale.jpg"; // Default for brides
import groomDefault from "../../assets/images/defaultmale.jpg"; // Default for grooms
import { API_ENDPOINTS } from "../../config/api";

const MatrimonialList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 8;

  useEffect(() => {
    fetchProfiles();
  }, [filter, ageMin, ageMax]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (filter !== 'all') {
        params.append('gender', filter === 'bride' ? 'Female' : 'Male');
      }
      if (ageMin) params.append('ageMin', ageMin);
      if (ageMax) params.append('ageMax', ageMax);
      if (maritalStatus) params.append('maritalStatus', maritalStatus);

      const response = await fetch(`${API_ENDPOINTS.PROFILES}?${params}`);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <section className="list-section">
        <div className="container">
          <div className="header-section">
            <span className="header-label center-top">Listing</span>
            <h2 className="header-title-center">
              <strong>
                <span>Turning </span>
                profiles <span>into <br />lifelong </span>partnerships.
              </strong>
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons" style={{ textAlign: 'center', margin: '30px 0' }}>
            <button
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              All Profiles
            </button>
            <button
              className={filter === 'bride' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('bride')}
            >
              Brides
            </button>
            <button
              className={filter === 'groom' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('groom')}
            >
              Grooms
            </button>
          </div>

          {/* Combined Filter Bar */}
          <div className="filter-bar">
            <div className="filter-bar-group">
              <label className="filter-bar-label">Age Range:</label>
              <div className="filter-bar-age-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="filter-bar-input filter-bar-age"
                />
                <span className="filter-bar-sep">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="filter-bar-input filter-bar-age"
                />
              </div>
            </div>

            <div className="filter-bar-divider"></div>

            <div className="filter-bar-group">
              <label className="filter-bar-label">Marital Status:</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="filter-bar-input filter-bar-select"
              >
                <option value="">All</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Loading profiles...</p>
            </div>
          ) : (
            <>
              <div className="profile-grid">
                {currentProfiles.map((profile) => (
                  <Link to={`/matrimonial-detail/${profile.id}`} key={profile.id} className="profile-card-link">
                    <div className="profile-card">
                      <div className="profile-img">
                        <img
                          src={profile.profilePhoto ?
                            `${API_ENDPOINTS.UPLOADS}/profile/${profile.profilePhoto}` :
                            (profile.gender === 'Female' ? brideDefault : groomDefault)
                          }
                          alt={`${profile.firstName} ${profile.lastName}`}
                        />
                      </div>
                      <div className="profile-content">
                        <span className="profile-id">
                          Profile ID: {profile.gender === 'Female' ? 'F' : 'M'}-{profile.id}
                        </span>
                        <h4 className="profile-name">{profile.firstName} {profile.lastName}</h4>
                        <p className="profile-dob">
                          Birth Date: {new Date(profile.dateOfBirth).toLocaleDateString()}
                        </p>
                        <p className="profile-info">
                          Age: {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {profiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <p>No profiles found.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MatrimonialList;