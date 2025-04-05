import React from "react";

const HomePage = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Section: Text Content */}
        <div className="hero-text">
          <h1 className="hero-heading">Intelligent Crawler!</h1>
          <p className="hero-subheading">Crawl crawl crawl..</p>
          <p className="hero-description">
            It never rests, it keeps its pace, Scanning the web, it’s on the
            chase. With every click, it’s sure to find, All the secrets left
            behind!
          </p>
          {/* <div className="cta-buttons">
            <button className="cta-button">Get Started</button>
            <button className="cta-button secondary">Create Your First Deck</button>
          </div> */}
        </div>

        {/* Right Section: Image */}
        <div className="hero-image">
          {/* Add an image or graphic here */}
          <img src="/intelligent-crawler.png" alt="intelligent crawler" />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
