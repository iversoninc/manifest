import React from 'react';

interface ProposalCardProps {
  title: string;
  client: string;
  date: string;
  onEdit: () => void;
  onDuplicate: () => void;
}

const styles = {
  card: {
    backgroundColor: '#111',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    ':hover': {
      transform: 'scale(1.02)'
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: '24px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#fff'
  },
  client: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '4px'
  },
  date: {
    fontSize: '14px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
    fontSize: '14px',
    transition: 'color 0.2s ease-in-out',
    ':hover': {
      color: '#fff'
    }
  }
};

const ProposalCard: React.FC<ProposalCardProps> = ({
  title,
  client,
  date,
  onEdit,
  onDuplicate,
}) => {
  return (
    <div style={styles.card} onClick={onEdit}>
      <div style={styles.header}>
        <div style={styles.content}>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.client}>{client}</p>
          <p style={styles.date}>{date}</p>
        </div>
        <div style={styles.actions} onClick={e => e.stopPropagation()}>
          <button 
            style={styles.button}
            onClick={onDuplicate}
            aria-label="Duplicate proposal"
          >
            Duplicate
          </button>
          <button 
            style={styles.button}
            onClick={onEdit}
            aria-label="Edit proposal"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
