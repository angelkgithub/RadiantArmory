import React from 'react';

const Footer = () => {
  return (
    <footer className="v-footer">
      <div className="v-footer-content">
        <div className="v-footer-grid">
          {/* BRAND */}
          <div className="v-footer-section">
            <div className="v-tag">// DATA_MINING</div>
            <h2 className="v-footer-logo">RADIANT<span>ARMORY</span></h2>
            <div className="v-status-row">
              <span className="v-pulse-dot"></span>
              <p>STATUS: <span className="v-glow-green">ENCRYPTED</span></p>
            </div>
            <p className="v-region-text">REGION: SE_ASIA_PH</p>
          </div>

          {/* API LINK */}
          <div className="v-footer-section v-center">
            <div className="v-tag">// EXTERNAL_SOURCE</div>
            <a href="https://playvalorant.com/en-us/news/dev/dev-valorant-api-and-beyond/" className="v-api-btn">
              <div className="v-api-inner">
                <div className="v-api-icon">V</div>
                <span>VALORANT API</span>
              </div>
            </a>
          </div>

          {/* CONTACT */}
          <div className="v-footer-section v-right">
            <div className="v-tag">// INTEL_CONTACT</div>
            <p className="v-contact-email">cypher@radiantarmory.com</p>
            <div className="v-contact-loc">
              <p>PHILIPPINES</p>
              <p className="v-city">MANILA_DEPT</p>
            </div>
          </div>
        </div>

        <div className="v-footer-bottom">
          <div className="v-footer-scanline"></div>
          <p>© 2026 RADIANT_ARMORY.SYS // ALL INTEL SECURED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
