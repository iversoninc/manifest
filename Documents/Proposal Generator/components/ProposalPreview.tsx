import React from 'react';

interface Props {
  proposal: {
    title: string;
    client: string;
    date: string;
    context: string;
    timeline: string;
    process: string;
    includeTermination: boolean;
    termination?: string;
    includeCopyright: boolean;
    copyright?: string;
    deliverables: Array<{
      title: string;
      description: string;
      cost: string;
    }>;
    deliverablesPreface: string;
    signature?: {
      name?: string;
      title?: string;
      company?: string;
      date?: string;
    };
  };
}

const styles = {
  wrapper: {
    position: 'relative' as const,
    minHeight: '100%',
    backgroundColor: '#0C0C0D',
    color: '#F2F2F2',
    fontFamily: 'var(--font-monument)',
    padding: '64px'
  },
  section: {
    marginBottom: '48px'
  },
  logo: {
    height: '32px',
    marginBottom: '32px'
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    marginBottom: '24px'
  },
  metadata: {
    display: 'flex',
    gap: '32px',
    color: '#999999',
    fontSize: '14px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '24px',
    color: '#F2F2F2'
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#CCCCCC'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '24px',
    color: '#CCCCCC'
  },
  tableHeader: {
    textAlign: 'left' as const,
    padding: '12px',
    borderBottom: '1px solid #333333',
    color: '#999999',
    fontSize: '14px'
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #333333'
  },
  totalRow: {
    backgroundColor: '#1A1A1A'
  },
  signatureSection: {
    marginTop: '64px'
  },
  signatureContainer: {
    display: 'flex',
    gap: '64px'
  },
  signatureColumn: {
    flex: 1
  },
  signatureLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#333333',
    marginBottom: '16px'
  },
  signatureInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  signatureLabel: {
    fontSize: '12px',
    color: '#999999',
    marginBottom: '4px'
  }
};

const formatCost = (cost: string) => {
  if (!cost) return '$0';
  const number = parseFloat(cost.replace(/[^0-9.-]+/g, ''));
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(number);
};

const calculateTotal = (deliverables: Array<{ cost: string }>) => {
  return deliverables.reduce((total, item) => {
    const cost = parseFloat(item.cost.replace(/[^0-9.-]+/g, '')) || 0;
    return total + cost;
  }, 0);
};

const DeliverableTable = ({ deliverables, formatCost, calculateTotal }: any) => (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>DELIVERABLE</th>
        <th style={styles.tableHeader}>DESCRIPTION</th>
        <th style={styles.tableHeader}>COST</th>
      </tr>
    </thead>
    <tbody>
      {deliverables.map((item: any, index: number) => (
        <tr key={index}>
          <td style={styles.tableCell}>{item.title}</td>
          <td style={styles.tableCell}>{item.description}</td>
          <td style={styles.tableCell}>{formatCost(item.cost)}</td>
        </tr>
      ))}
      <tr style={styles.totalRow}>
        <td style={styles.tableCell}></td>
        <td style={styles.tableCell}>TOTAL</td>
        <td style={styles.tableCell}>{formatCost(calculateTotal(deliverables).toString())}</td>
      </tr>
    </tbody>
  </table>
);

export const ProposalPreview: React.FC<Props> = ({ proposal }) => {
  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.section}>
        <img src="/assets/images/logo.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>{proposal.title}</h1>
        <div style={styles.metadata}>
          <div>CLIENT: {proposal.client}</div>
          <div>DATE: {proposal.date}</div>
        </div>
      </div>

      {/* Context */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Context</h2>
        <p style={styles.text}>{proposal.context}</p>
      </div>

      {/* Process */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Process</h2>
        <p style={styles.text}>{proposal.process}</p>
      </div>

      {/* Deliverables */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Deliverables</h2>
        <p style={styles.text}>{proposal.deliverablesPreface}</p>
        <DeliverableTable 
          deliverables={proposal.deliverables} 
          formatCost={formatCost}
          calculateTotal={calculateTotal}
        />
      </div>

      {/* Timeline */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Timeline</h2>
        <p style={styles.text}>{proposal.timeline}</p>
      </div>

      {/* Optional Sections */}
      {proposal.includeTermination && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Termination</h2>
          <p style={styles.text}>{proposal.termination}</p>
        </div>
      )}

      {proposal.includeCopyright && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Copyright</h2>
          <p style={styles.text}>{proposal.copyright}</p>
        </div>
      )}

      {/* Signature */}
      {proposal.signature && (
        <div style={{...styles.section, ...styles.signatureSection}}>
          <h2 style={styles.sectionTitle}>Signature</h2>
          <div style={styles.signatureContainer}>
            <div style={styles.signatureColumn}>
              <div style={styles.signatureLine} />
              <div style={styles.signatureInfo}>
                <div>
                  <div style={styles.signatureLabel}>Name</div>
                  <div>{proposal.signature.name || '_____________________'}</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Title</div>
                  <div>{proposal.signature.title || '_____________________'}</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Company</div>
                  <div>{proposal.signature.company || '_____________________'}</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Date</div>
                  <div>{proposal.signature.date || '_____________________'}</div>
                </div>
              </div>
            </div>
            <div style={styles.signatureColumn}>
              <div style={styles.signatureLine} />
              <div style={styles.signatureInfo}>
                <div>
                  <div style={styles.signatureLabel}>Name</div>
                  <div>_____________________</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Title</div>
                  <div>_____________________</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Company</div>
                  <div>_____________________</div>
                </div>
                <div>
                  <div style={styles.signatureLabel}>Date</div>
                  <div>_____________________</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalPreview;