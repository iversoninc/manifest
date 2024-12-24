import React from 'react';
import { styles } from '../../styles/proposalPreview';

interface Props {
  title: string;
  children: React.ReactNode;
  noDivider?: boolean;
}

export const ProposalSection: React.FC<Props> = ({ title, children, noDivider = false }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
    {children}
    {!noDivider && <div style={styles.divider} />}
  </div>
);
