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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${API_URL}/businesses?status=approved`);
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

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
            <input type="text" placeholder="Search By Location" />
            <input type="text" placeholder="Search By Industry" />
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
                <th>Type</th>
                <th>Location</th>
                <th>Owner</th>
                <th>Phone</th>
            
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Loading businesses...</td>
                </tr>
              ) : businesses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No businesses found.</td>
                </tr>
              ) : (
                currentBusinesses.map((business, index) => (
                  <tr key={business.id} className={index === 1 ? "creative" : ""}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{business.businessName}</td>
                    <td>Business</td>
                    <td>{business.address}</td>
                    <td>{business.ownerName}</td>
                    <td>{business.contactNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
    </section>
  );
}