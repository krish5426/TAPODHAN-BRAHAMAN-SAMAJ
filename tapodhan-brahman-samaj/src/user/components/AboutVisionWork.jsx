import visionIcon from "../assets/images/vision.png";
import workIcon from "../assets/images/work.png";
import visionImg from "../assets/images/vision-image.jpg";
import workImg from "../assets/images/work-image.jpg";

const AboutVisionWork = () => {
  return (
    <section className="about-vision-work">
      <div className="container">

        <div className="vision-header">
          <h4 className="vision-tag"><span>Vision & Our Work</span></h4>
          <h2>
            To build a <strong>strong, united,</strong> and
            <br />
            <strong>progressive</strong> community rooted in values
          </h2>
        </div>

        <div className="vision-cards">

          <div className="vision-card">
            <div className="vision-card-content">
              <div className="icon">
                <img src={visionIcon} alt="Our Work Focus" />
              </div>
              <h3>Our Vision</h3>
              <p>
                Guided by the timeless vision of “वसुधैव कुटुम्बकम्” (Vasudhaiva Kuṭumbakam — the world is one family) and “लोकाः समस्ताः सुखिनो भवन्तु” (Lokāḥ samastāḥ sukhino bhavantu — may all beings be happy)
              </p>

              <p>
                we work to create a world where ancient wisdom and modern compassion walk hand in hand.
              </p>
            </div>

            <div className="vision-card-image">
              <img src={visionImg} alt="Our Vision" />
            </div>
          </div>

          <div className="vision-card">
            <div className="vision-card-content">
              <div className="icon">
                <img src={workIcon} alt="Our Work Focus" />
              </div>
              <h3>Our Work Focus</h3>

              <p>
                direct services, community partnerships, capacity-building, and advocacy.
              </p>

              <p>
                We strive to address root causes, not just symptoms of the challenges we tackle.
              </p>
              <p>What sets us apart:Community-led approach: We listen to and co-create solutions with the people we serve.</p>
            </div>

            <div className="vision-card-image">
              <img src={workImg} alt="Our Work Focus" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutVisionWork;
