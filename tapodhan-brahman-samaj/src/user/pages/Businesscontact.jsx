import React, { useState, useEffect } from "react";
import imageIcon from "../../assets/images/cz.png";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../../config/api';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';

export default function Businesscontact() {
  const [images, setImages] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Business Directory' }
  ];

  useEffect(() => {
    if (selectedBusiness) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBusiness]);

  const fetchBusinesses = async (name = "", loc = "") => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.append("status", "approved");
      if (name) p.append("businessName", name);
      if (loc) p.append("location", loc);

      const response = await fetch(`${API_ENDPOINTS.BUSINESSES}?${p.toString()}`);
      const data = await response.json();
      setBusinesses(data);
      setCurrentPage(1); // Reset to first page on search
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchBusinesses(searchName, searchLocation);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName, searchLocation]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openDrawer = (business) => {
    setSelectedBusiness(business);
    // Tiny delay to ensure React has rendered the drawer elements before adding 'active' class
    setTimeout(() => setIsDrawerOpen(true), 10);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // Wait for transition to finish before clearing data
    setTimeout(() => setSelectedBusiness(null), 500);
  };

  const handleNextBusiness = () => {
    if (!selectedBusiness) return;
    const currentIndex = businesses.findIndex(b => b.id === selectedBusiness.id);
    if (currentIndex < businesses.length - 1) {
      setSelectedBusiness(businesses[currentIndex + 1]);
    }
  };

  const handlePrevBusiness = () => {
    if (!selectedBusiness) return;
    const currentIndex = businesses.findIndex(b => b.id === selectedBusiness.id);
    if (currentIndex > 0) {
      setSelectedBusiness(businesses[currentIndex - 1]);
    }
  };

  const handleImageUpload = (e, rowId) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImages((prev) => ({ ...prev, [rowId]: preview }));
  };

  return (
    <>
      <InnerBanner
        title="Business Directory"
        breadcrumb={breadcrumb}
        backgroundImage={bannerImage}
      />
      <section className="business-directory">
        <div className="directory-container">

          {/* HERO SECTION */}
          <div className="business-hero">
            <span className="business-hero-label">BUSINESS GROW</span>
            <h1 className="business-hero-title">
              Connecting <span>Businesses</span>.<br />
              Creating <span>Growth</span>.
            </h1>
            <div className="business-hero-actions">
              <input
                type="text"
                placeholder="Search by Business Name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Search by Location (City)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
              <button
                className="business-hero-btn"
                onClick={() => navigate("/business-register")}
              >
                Add Register
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="directory-table-wrapper">
            <table className="directory-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Business Name</th>
                  <th>Owner Name</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Contact Number</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>Loading businesses...</td>
                  </tr>
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No businesses found.</td>
                  </tr>
                ) : (
                  currentBusinesses.map((business, index) => (
                    <tr key={business.id} className={index % 2 !== 0 ? "creative" : ""}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{business.businessName}</td>
                      <td>{business.ownerName}</td>
                      <td>{business.category || "-"}</td>
                      <td>{business.city || "-"}</td>
                      <td>{business.contactNumber}</td>
                      <td>
                        <button
                          className="business-hero-btn"
                          style={{ padding: "5px 10px", fontSize: "12px", minWidth: "auto" }}
                          onClick={() => openDrawer(business)}
                        >
                          More
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* SIDE DRAWER */}
          <div
            className={`business-drawer-overlay ${isDrawerOpen ? 'active' : ''}`}
            onClick={closeDrawer}
          />
          <div className={`business-drawer-content ${isDrawerOpen ? 'active' : ''}`}>
            {selectedBusiness && (
              <>
                <div className="business-drawer-header">
                  <button className="business-drawer-close" onClick={closeDrawer}>
                    &times;
                  </button>

                  <div className="business-drawer-image-container">
                    <img
                      src={selectedBusiness.posterPhoto && selectedBusiness.posterPhoto !== 'default_business.jpg'
                        ? `${API_ENDPOINTS.UPLOADS}/${selectedBusiness.posterPhoto}`
                        : imageIcon
                      }
                      alt={selectedBusiness.businessName}
                      className="business-drawer-image"
                      onError={(e) => { e.target.src = imageIcon; }}
                    />
                  </div>
                </div>

                <div className="business-drawer-body">
                  <span className="business-drawer-category">{selectedBusiness.category || "General"}</span>
                  <h2 className="business-drawer-title">{selectedBusiness.businessName}</h2>

                  <div className="business-drawer-description">
                    {selectedBusiness.city}, {selectedBusiness.state}
                  </div>

                  <div className="business-drawer-details-grid">
                    <div className="business-drawer-detail-card">
                      <span className="business-drawer-detail-label">Owner Name</span>
                      <span className="business-drawer-detail-value">{selectedBusiness.ownerName}</span>
                    </div>

                    <div className="business-drawer-detail-card">
                      <span className="business-drawer-detail-label">Business Type</span>
                      <span className="business-drawer-detail-value">{selectedBusiness.businessType}</span>
                    </div>

                    <div className="business-drawer-detail-card">
                      <span className="business-drawer-detail-label">Contact Number</span>
                      <span className="business-drawer-detail-value">{selectedBusiness.contactNumber}</span>
                    </div>

                    <div className="business-drawer-detail-card">
                      <span className="business-drawer-detail-label">Email Address</span>
                      <span className="business-drawer-detail-value">{selectedBusiness.email || "N/A"}</span>
                    </div>

                    {selectedBusiness.website && (
                      <div className="business-drawer-detail-card">
                        <span className="business-drawer-detail-label">Website</span>
                        <span className="business-drawer-detail-value">
                          <a href={selectedBusiness.website} target="_blank" rel="noreferrer">
                            {selectedBusiness.website.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      </div>
                    )}

                    {selectedBusiness.description && (
                      <div className="business-drawer-detail-card">
                        <span className="business-drawer-detail-label">Description</span>
                        <span className="business-drawer-detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedBusiness.description}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="business-address-grid">
                    <div className="business-drawer-detail-card">
                      <span className="business-drawer-detail-label">Full Address</span>
                      <span className="business-drawer-detail-value">{selectedBusiness.address}</span>
                    </div>
                  </div>
                </div>

                {/* Sticky Navigation Footer */}
                <div className="business-drawer-footer">
                  <div className="business-drawer-footer-nav">
                    <button
                      className="footer-nav-btn prev"
                      onClick={handlePrevBusiness}
                      disabled={businesses.findIndex(b => b.id === selectedBusiness.id) === 0}
                    >
                      Previous Business
                    </button>
                    <button
                      className="footer-nav-btn next"
                      onClick={handleNextBusiness}
                      disabled={businesses.findIndex(b => b.id === selectedBusiness.id) === businesses.length - 1}
                    >
                      Next Business
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGINATION */}
          <div className="directory-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>

        </div>
      </section >
    </>
  );
}