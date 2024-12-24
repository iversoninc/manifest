import React from 'react';
import { styles } from '../../styles/proposalPreview';
import { ProposalSection } from './ProposalSection';
import { DeliverableTable } from './DeliverableTable';

interface Props {
  content: React.ReactNode[];
  pageNumber: number;
  totalPages: number;
  client?: string;
}

export const ProposalPage: React.FC<Props> = ({ 
  content, 
  pageNumber, 
  totalPages, 
  client 
}) => (
  <div style={styles.page}>
    <div style={styles.contentContainer}>
      {content}
    </div>
    <div style={styles.pageNumber}>
      <img src="/assets/images/logo.png" alt="Logo" style={styles.footerLogo} />
      <span style={styles.pageCount}>{pageNumber} OF {totalPages}</span>
      <span>PREPARED FOR {client?.toUpperCase()}</span>
    </div>
  </div>
);
