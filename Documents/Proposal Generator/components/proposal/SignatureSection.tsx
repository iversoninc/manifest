import React from 'react';
import { styles } from '../../styles/proposalPreview';

interface Props {
  client: string;
}

export const SignatureSection: React.FC<Props> = ({ client }) => {
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <div style={styles.signatureSection}>
      <div style={styles.signatureColumn}>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Company</div>
          <div style={styles.signatureValue}>IVERSON ENTERPRISES, LLC</div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Name</div>
          <div style={styles.signatureValue}>SOREN IVERSON</div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Signature</div>
          <div style={styles.signatureValue}>
            <img src="/assets/images/signature.png" alt="Signature" style={styles.signatureImage} />
          </div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Date</div>
          <div style={styles.signatureValue}>{today}</div>
        </div>
      </div>
      <div style={styles.signatureColumn}>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Company</div>
          <div style={styles.signatureValue}>{client.toUpperCase()}</div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Name</div>
          <div style={styles.signatureValue}>{client.toUpperCase()}</div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Signature</div>
          <div style={styles.signatureValue}></div>
        </div>
        <div style={styles.signatureField}>
          <div style={styles.signatureLabel}>Date</div>
          <div style={styles.signatureValue}></div>
        </div>
      </div>
    </div>
  );
};
