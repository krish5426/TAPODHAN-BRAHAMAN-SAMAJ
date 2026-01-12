import React from 'react';

const ComingSoon = ({ title = "Coming Soon" }) => {
  console.log('ComingSoon component rendered:', title);
  
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '50px 20px'
    }}>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '20px',
        background: 'linear-gradient(180deg, rgba(185, 37, 47, 1) 0%, rgba(106, 44, 45, 1) 69%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#525252',
        marginBottom: '30px',
        maxWidth: '500px'
      }}>
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div style={{
        width: '100px',
        height: '4px',
        background: 'linear-gradient(180deg, rgba(247, 141, 34, 1) 0%, rgba(189, 64, 6, 1) 69%)',
        margin: '20px 0'
      }}></div>
    </div>
  );
};

export default ComingSoon;