import React, { useState, useEffect } from "react";
import imageIcon from "../assets/images/contactpage.png"; // fallback icon if needed
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

export default function Businesscontact() {
  const [images, setImages] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const navigate = useNavigate();

  const fetchBusinesses = async (name = "", loc = "") => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.append("status", "approved");
      if (name) p.append("businessName", name);
      if (loc) p.append("location", loc);

      const response = await fetch(`${API_URL}/businesses?${p.toString()}`);
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

  const handleImageUpload = (e, rowId) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImages((prev) => ({ ...prev, [rowId]: preview }));
  };

  return (
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
              onClick={() => navigate("/register")}
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
                        onClick={() => setSelectedBusiness(business)}
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

        {/* MODAL */}
        {selectedBusiness && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px',
              maxHeight: '90vh', overflowY: 'auto', position: 'relative'
            }}>
              <button
                onClick={() => setSelectedBusiness(null)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                &times;
              </button>
              <h2 style={{ marginBottom: '15px' }}>{selectedBusiness.businessName}</h2>
              {selectedBusiness.posterPhoto && (
                <img
                  src={`${API_URL}/uploads/${selectedBusiness.posterPhoto}`}
                  alt="Poster"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
                />
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <p><strong>Owner:</strong> {selectedBusiness.ownerName}</p>
                <p><strong>Type:</strong> {selectedBusiness.businessType}</p>
                <p><strong>Category:</strong> {selectedBusiness.category}</p>
                <p><strong>Email:</strong> {selectedBusiness.email}</p>
                <p><strong>Contact:</strong> {selectedBusiness.contactNumber}</p>
                <p><strong>Website:</strong> <a href={selectedBusiness.website} target="_blank" rel="noreferrer">{selectedBusiness.website}</a></p>
                <p><strong>City:</strong> {selectedBusiness.city}</p>
                <p><strong>State:</strong> {selectedBusiness.state}</p>
              </div>
              <p style={{ marginTop: '10px' }}><strong>Address:</strong><br />{selectedBusiness.address}</p>
              <p style={{ marginTop: '10px' }}><strong>Description:</strong><br />{selectedBusiness.description}</p>
            </div>
          </div>
        )}

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
    </section>
  );
}