import React from 'react';
import ProposalCard from './ProposalCard';

export interface Proposal {
  id: string;
  title: string;
  client: string;
  date: string;
  [key: string]: any;
}

interface ProposalListProps {
  proposals: Proposal[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCreateNew: () => void;
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '64px 32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 500,
    color: '#fff',
    margin: 0,
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#444',
    }
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '16px',
    marginTop: '40px',
  }
};

const ProposalList: React.FC<ProposalListProps> = ({
  proposals,
  onEdit,
  onDuplicate,
  onCreateNew,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Proposals</h1>
        <button style={styles.button} onClick={onCreateNew}>
          New Proposal
        </button>
      </div>
      
      {proposals.length === 0 ? (
        <p style={styles.emptyState}>
          No proposals yet. Create your first one!
        </p>
      ) : (
        proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            title={proposal.title}
            client={proposal.client}
            date={proposal.date}
            onEdit={() => onEdit(proposal.id)}
            onDuplicate={() => onDuplicate(proposal.id)}
          />
        ))
      )}
    </div>
  );
};

export default ProposalList;
