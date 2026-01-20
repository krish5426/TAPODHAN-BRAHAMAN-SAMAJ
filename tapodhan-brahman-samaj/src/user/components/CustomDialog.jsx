import React from 'react';

const CustomDialog = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      case 'warning':
        return '#f39c12';
      default:
        return '#3498db';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: getIconColor(),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 auto 20px'
        }}>
          {getIcon()}
        </div>

        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          fontFamily: 'Barlow Condensed, sans-serif'
        }}>
          {title}
        </h3>

        <p style={{
          margin: '0 0 25px 0',
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.5',
          fontFamily: 'Barlow, sans-serif'
        }}>
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#b9252f',
            color: '#fff',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Barlow, sans-serif',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#a01e28'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#b9252f'}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomDialog;