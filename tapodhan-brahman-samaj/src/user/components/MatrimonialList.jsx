import React from "react";
import profileImg from "../../assets/images/profileimg.png";

const profiles = [
  {
    id: 1,
    name: "Jyoti Mishra",
    profileId: "F-25-008",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 2,
    name: "Jyoti Mishra",
    profileId: "F-25-009",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 3,
    name: "Jyoti Mishra",
    profileId: "F-25-010",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 4,
    name: "Jyoti Mishra",
    profileId: "F-25-011",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 5,
    name: "Jyoti Mishra",
    profileId: "F-25-012",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 6,
    name: "Jyoti Mishra",
    profileId: "F-25-013",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 7,
    name: "Jyoti Mishra",
    profileId: "F-25-014",
    dob: "12 Apr 2001",
    image: profileImg,
  },
  {
    id: 8,
    name: "Jyoti Mishra",
    profileId: "F-25-015",
    dob: "12 Apr 2001",
    image: profileImg,
  },
];


const MatrimonialList = () => {
  return (
    <>

      <section className="list-section">
        <div className="container">
          <div className="header-section">
            <span className="header-label">Listing</span>
            <h2 className="header-title">
              <strong>
                <span>Turning </span>
                profiles <span>into <br />lifelong </span>partnerships.
              </strong>
            </h2>
          </div>
        </div>
      </section>


      <section className="profile-section">
        <div className="container">
          <div className="profile-grid">
            {profiles.map((item) => (
              <div className="profile-card" key={item.id}>
                <div className="profile-img">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="profile-content">
                  <span className="profile-id">
                    Profile ID: {item.profileId}
                  </span>
                  <h4 className="profile-name">{item.name}</h4>
                  <p className="profile-dob">
                    Birth Date: {item.dob}
                  </p>
                </div>

                </div>
            ))}
          </div>

          <div className="pagination">
            <button>«</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <button>10</button>
            <button>»</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MatrimonialList;