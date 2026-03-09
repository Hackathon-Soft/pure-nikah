import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Footer = () => (
  <footer className="footer">
    <div className="app-container">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <FaHeart className="text-accent" style={{ fontSize: "var(--size-icon-lg)" }} />
            <span className="footer-brand-text">PureNikah</span>
          </div>
          <p className="footer-description">
            A trusted Islamic marriage platform helping Muslims find their life partner with dignity, respect, and adherence to Islamic values.
          </p>
        </div>
        <div>
          <h4 className="footer-heading">Platform</h4>
          <div className="footer-links">
            <Link to="/search" className="link-footer">Search Profiles</Link>
            <Link to="/pricing" className="link-footer">Pricing</Link>
            <Link to="/about" className="link-footer">About Us</Link>
          </div>
        </div>
        <div>
          <h4 className="footer-heading">Support</h4>
          <div className="footer-links">
            <Link to="/help" className="link-footer">Help Center</Link>
            <Link to="/privacy-policy" className="link-footer">Privacy Policy</Link>
            <Link to="/terms-of-service" className="link-footer">Terms of Service</Link>
          </div>
        </div>
        <div>
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-links">
            <span>support@purenikah.com</span>
            <span>Available 24/7</span>
          </div>
        </div>
      </div>
      <div className="footer-divider">
        © {new Date().getFullYear()} PureNikah. All rights reserved. Built with faith and love.
      </div>
    </div>
  </footer>
);

export default Footer;
