import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const token = localStorage.getItem('user_token');

  useEffect(() => {
    if (!token) {
      setShowModal(true);
    }
  }, [token]);

  if (!token && shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  if (!token) {
    return (
      <>
        {showModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
              fontFamily: '"Inter Tight", sans-serif'
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "#b9252f",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "24px",
                color: "white"
              }}>
                !
              </div>
              <h3 style={{ margin: "0 0 15px 0", color: "#333", letterSpacing: '0.5px' }}>Login Required</h3>
              <p style={{ margin: "0 0 25px 0", color: "#666", lineHeight: "1.5", fontSize: '16px', letterSpacing: '0.5px' }}>
                Please login to access business registration.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  onClick={() => setShouldRedirect(true)}
                  style={{
                    background: "linear-gradient(180deg, #b9252f 0%, #6a2c2d 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => window.history.back()}
                  style={{
                    background: "transparent",
                    color: "#b9252f",
                    border: "2px solid #b9252f",
                    padding: "10px 25px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;