import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export interface Proposal {
  id: string;
  title: string;
  client: string;
  date: string;
  context: string;
  timeline: string;
  process: string;
  includeTermination: boolean;
  termination: string;
  includeCopyright: boolean;
  copyright: string;
  deliverables: Array<{
    title: string;
    description: string;
    cost: string;
  }>;
  deliverablesPreface: string;
}

interface Props {
  proposals: Proposal[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px'
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    border: '1px solid #222',
    transition: 'all 0.2s ease',
    position: 'relative' as const
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  title: {
    margin: '0',
    fontSize: '24px',
    fontWeight: '400' as const,
    color: '#fff',
    paddingRight: '48px'
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    color: '#999',
    fontSize: '14px'
  },
  actions: {
    position: 'absolute' as const,
    top: '24px',
    right: '24px'
  },
  menuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  menu: {
    position: 'absolute' as const,
    right: '0',
    top: '44px',
    backgroundColor: '#242424',
    border: '1px solid #404040',
    borderRadius: '8px',
    overflow: 'hidden',
    minWidth: '120px',
    zIndex: 10,
    padding: '4px'
  },
  menuItem: {
    padding: '8px 12px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    borderRadius: '4px'
  }
};

const ProposalList: React.FC<Props> = ({ proposals, onEdit, onDuplicate, onDelete }) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n') {
        router.push('/proposal/new');
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [router]);

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (e: React.MouseEvent, action: (id: string) => void, id: string) => {
    e.stopPropagation();
    action(id);
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId && !(e.target as Element).closest('[data-menu]')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  return (
    <div style={styles.container}>
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          style={styles.card}
          onClick={() => onEdit(proposal.id)}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, {
              backgroundColor: '#242424',
              borderColor: '#404040'
            });
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              backgroundColor: '#1A1A1A',
              borderColor: '#333'
            });
          }}
        >
          <div style={styles.header}>
            <h2 style={styles.title}>{proposal.title}</h2>
            <div style={styles.metadata}>
              <span>{proposal.client}</span>
              <span>{proposal.date}</span>
            </div>
          </div>
          <div style={styles.actions} data-menu>
            <button
              style={styles.menuButton}
              onClick={(e) => handleMenuClick(e, proposal.id)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, {
                  backgroundColor: '#333333'
                });
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, {
                  backgroundColor: 'transparent'
                });
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: 'rotate(90deg)' }}>
                <circle cx="9" cy="4" r="1.5" fill="#999"/>
                <circle cx="9" cy="9" r="1.5" fill="#999"/>
                <circle cx="9" cy="14" r="1.5" fill="#999"/>
              </svg>
            </button>
            {openMenuId === proposal.id && (
              <div style={styles.menu}>
                <button
                  style={styles.menuItem}
                  onClick={(e) => handleAction(e, onDuplicate, proposal.id)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: '#333333'
                    });
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: 'transparent'
                    });
                  }}
                >
                  Duplicate
                </button>
                <button
                  style={styles.menuItem}
                  onClick={(e) => handleAction(e, onEdit, proposal.id)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: '#333333'
                    });
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: 'transparent'
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    ...styles.menuItem,
                    color: '#EA5858'
                  }}
                  onClick={(e) => handleAction(e, onDelete, proposal.id)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: '#333333'
                    });
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, {
                      backgroundColor: 'transparent'
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;
