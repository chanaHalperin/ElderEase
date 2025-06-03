import { Typography, Row, Col, Card, Divider, Carousel, Avatar, Button } from "antd";
import "../styles/Home.css";

const { Title, Paragraph, Text } = Typography;

const features = [
  {
    title: "Modern Gym",
    desc: "Fully equipped gym, fitness classes, professional guidance, and a supportive atmosphere.",
    img: "Home/sport.webp"
  },
  {
    title: "Heated Swimming Pool",
    desc: "Indoor pool, water activities, quiet hours, and special events.",
    img: "Home/pool.webp"
  },
  {
    title: "Green and Well-Kept Environment",
    desc: "Gardens, seating areas, open spaces – perfect for relaxation and socializing.",
    img: "Home/garden.jpg"
  },
  {
    title: "Family Lounge Areas",
    desc: "Designed seating corners, spacious areas for hosting family and grandchildren.",
    img: "Home/levahim-lobby.webp"
  },
];

const activities = [
  {
    title: "Art & Creativity Classes",
    desc: "Painting, sculpture, photography, crafts – for all levels.",
    img: "Home/creation.jpg"
  },
  {
    title: "Lectures & Enrichment",
    desc: "Fascinating lectures, workshops, cultural events, computer classes.",
    img: "Home/lerning.jpg"
  },
  {
    title: "Personalized Fitness",
    desc: "Yoga, Pilates, water aerobics, group walks.",
    img: "Home/yoga.jpg"
  },
  {
    title: "Community Events",
    desc: "Celebrations, trips, music nights, parties, Shabbat gatherings.",
    img: "Home/community.jpg"
  },
];

const staff = [
  {
    name: "Shimon Peretz",
    role: "General Manager",
    img: "Home/manager22.jpg"
  },
  {
    name: "Yossi Levi",
    role: "Activities & Sports Manager",
    img: "Home/manager.jpg"
  },
  {
    name: "Avigdor Cohen",
    role: "Culture Coordinator",
    img: "Home/caltureMen.jpg"
  }
];

const testimonials = [
  {
    name: "Yehuda Levi",
    text: "At ElderEase, I found a true home. The staff is amazing, the atmosphere is calm, and life here is full of interest.",
    avatar: "Home/elderly1.jpg"
  },
  {
    name: "Moshe Cohen",
    text: "The pool and gym have upgraded my quality of life. Highly recommended!",
    avatar: "Home/elderly2.jpg"
  },
  {
    name: "Nahum Dagan",
    text: "The community here is supportive, there are plenty of activities, and I feel safe and surrounded by friends.",
    avatar: "Home/elderly3.jpg"
  }
];

// Big gallery (senior images only)
const bigGallery = [
  "Home/pool.webp",
  "Home/sofas.webp",
];

const Home = () => (
  <div className="home-container">

    {/* Hero section with large carousel and overlay text */}
    <section className="home-hero-carousel">
      <div className="hero-slide">
        <img src="Home/true.jpg" alt="Welcome to ElderEase" className="hero-img" />
        <div className="hero-overlay" />
        <div className="hero-caption">
          <Title level={1}>Welcome to ElderEase</Title>
          <Paragraph>
            Premium assisted living in Jerusalem – community, quality of life, tranquility, and security.<br />
            A unique living experience with advanced facilities, professional staff, and green surroundings.
          </Paragraph>
          <Button type="primary" size="large" className="hero-cta">Schedule a Personal Tour</Button>
        </div>
      </div>
    </section>

    <Divider />

    {/* About section */}
    <section className="home-about" style={{ padding: "4rem 2rem", background: "#f0f4f7" }}>
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={14} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Title
            level={2}
            style={{
              fontSize: "2.2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "left",
              color: "#2c3e50"
            }}
          >
            About ElderEase
          </Title>
          <Paragraph style={{ textAlign: "left", color: "#555", lineHeight: "1.9", fontSize: "1.1rem" }}>
            <strong>ElderEase</strong> is a premium assisted living community in the heart of Jerusalem, combining warmth, a strong sense of community, and security.
          </Paragraph>
          <Paragraph style={{ textAlign: "left", color: "#555", lineHeight: "1.9", fontSize: "1.1rem" }}>
            We offer a peaceful green environment alongside advanced services, a dedicated staff, and a rich variety of programs for every resident.
          </Paragraph>
          <Paragraph style={{ textAlign: "left", color: "#555", lineHeight: "1.9", fontSize: "1.1rem" }}>
            ElderEase blends leisure, culture, sports, health, and personal support – all in a pleasant, respectful, and caring atmosphere.
          </Paragraph>
          <Paragraph style={{ textAlign: "left", color: "#3a5ca8", fontWeight: "bold", lineHeight: "1.9", fontSize: "1.15rem" }}>
            Feel at home – join a community that supports, cares, and fills your heart.
          </Paragraph>
          <div style={{ textAlign: "left", marginTop: "1.5rem" }}>
            <button
              style={{
                background: "#3a5ca8",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "background 0.3s"
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#2b4d8c")}
              onMouseOut={e => (e.currentTarget.style.background = "#3a5ca8")}
            >
              Book a Tour and Experience for Yourself →
            </button>
          </div>
        </Col>

        <Col xs={0} md={10}>
          <img src="Home/green.jpg" alt="Green Area" className="about-img animate-fadein" />
        </Col>
      </Row>
    </section>

    {/* Features section */}
    <section className="home-features">
      <Row gutter={[32, 32]} justify="center">
        {features.map((feature, idx) => (
          <Col xs={24} sm={12} md={12} lg={6} key={idx}>
            <Card
              hoverable
              cover={
                <img
                  alt={feature.title}
                  src={feature.img}
                  className="home-feature-img-contain"
                />
              }
              className="home-feature-card"
            >
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </section>

    {/* Activities section */}
    <section className="home-activities">
      <Title level={3}>Culture, Classes & Activities</Title>
      <Row gutter={[32, 32]} justify="center">
        {activities.map((a, idx) => (
          <Col xs={24} sm={12} md={6} key={idx}>
            <Card className="activity-card" bordered={false}>
              <img src={a.img} alt={a.title} className="activity-img" />
              <Title level={5}>{a.title}</Title>
              <Paragraph>{a.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </section>

    {/* Staff section */}
    <section className="home-staff">
      <Title level={3}>Our Team</Title>
      <Row gutter={[24, 24]} justify="center">
        {staff.map((member, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card className="staff-card" bordered={false}>
              <Avatar src={member.img} size={90} style={{ marginBottom: 16 }} />
              <Title level={5}>{member.name}</Title>
              <Text type="secondary">{member.role}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>

    {/* Testimonials section */}
    <section className="home-testimonials">
      <Title level={3}>What Our Residents Say</Title>
      <Row gutter={[24, 24]} justify="center">
        {testimonials.map((t, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card className="testimonial-card">
              <Avatar src={t.avatar} size={64} style={{ marginBottom: 16 }} />
              <Paragraph className="testimonial-text">"{t.text}"</Paragraph>
              <Text strong>{t.name}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>

    {/* Video section */}
    {/* <section className="home-video-section">
      <div className="video-wrapper">
        <video
          src="Home/IMG_7314.MOV"
          controls
          autoPlay
          muted
          style={{ width: "100%", maxWidth: "800px", borderRadius: "24px", display: "block", margin: "0 auto" }}
          poster="Home/video-poster.jpg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <Paragraph className="video-caption">
        A glimpse into life at premium assisted living – quality, community, tranquility.
      </Paragraph>
    </section> */}

    {/* Big gallery section */}
    <section className="home-big-gallery">
      <Title level={3}>Moments from ElderEase</Title>
      <Carousel autoplay effect="fade" className="big-gallery-carousel" dots>
        {bigGallery.map((img, idx) => (
          <div key={idx} className="big-gallery-slide">
            <img src={img} alt={`gallery${idx}`} className="big-gallery-img" />
          </div>
        ))}
      </Carousel>
    </section>

    {/* CTA section */}
    <section className="home-cta-section">
      <div className="cta-content">
        <Title level={2}>Want to Get to Know Us?</Title>
        <Paragraph>Leave your details and we’ll get back to you to schedule a personal tour and an unforgettable experience.</Paragraph>
        <Button type="primary" size="large" className="hero-cta">Schedule a Tour</Button>
      </div>
    </section>

    <footer className="home-footer">
      <Divider />
      <Text type="secondary">
        &copy; {new Date().getFullYear()} ElderEase | All rights reserved
      </Text>
    </footer>
  </div>
);

export default Home;