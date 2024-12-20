import React from 'react';
import styles from '../styles/footer.module.css';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>{t('aboutUs')}</h3>
            <p>{t('learnMore')}</p>
          </div>
          <div className={styles.column}>
            <h3>{t('customerService')}</h3>
            <ul>
              <li><a href="/contact">{t('contactUs')}</a></li>
              <li><a href="/faq">{t('faq')}</a></li>
              <li><a href="/returns">{t('returns')}</a></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>{t('followUs')}</h3>
            <ul className={styles.socialMedia}>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">{t('facebook')}</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">{t('twitter')}</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">{t('instagram')}</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <p>&copy; {new Date().getFullYear()} VESO. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;