import React from 'react';
import styles from '../styles/footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>About Us</h3>
            <p>Learn more about our company and values.</p>
          </div>
          <div className={styles.column}>
            <h3>Customer Service</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/returns">Returns</a></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Follow Us</h3>
            <ul className={styles.socialMedia}>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <p>&copy; {new Date().getFullYear()} VESO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;