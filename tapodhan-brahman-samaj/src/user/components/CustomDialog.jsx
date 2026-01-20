import React from 'react';

const CustomDialog = ({ isOpen, onClose, message, type = 'success' }) => {
    if (!isOpen) return null;

    const getDialogConfig = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: '#28a745',
                    icon: '✓',
                    title: 'Success!'
                };
            case 'error':
                return {
                    bgColor: '#dc3545',
                    icon: '✕',
                    title: 'Error!'
                };
            case 'info':
                return {
                    bgColor: '#17a2b8',
                    icon: 'ℹ',
                    title: 'Information'
                };
            default:
                return {
                    bgColor: '#28a745',
                    icon: '✓',
                    title: 'Success!'
                };
        }
    };

    const config = getDialogConfig();

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
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                fontFamily: '"Barlow", sans-serif'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: config.bgColor,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '30px',
                    color: 'white'
                }}>
                    {config.icon}
                </div>
                <h3 style={{
                    color: '#333',
                    marginBottom: '15px',
                    fontSize: '24px'
                }}>
                    {config.title}
                </h3>
                <p style={{
                    color: '#666',
                    marginBottom: '25px',
                    fontSize: '16px'
                }}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#b9252f',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CustomDialog;