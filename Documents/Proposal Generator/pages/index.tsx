import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProposalList from '../components/ProposalList';
import type { Proposal } from '../components/ProposalList';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';

const STORAGE_KEY = 'proposals';

const defaultProposal = {
  title: 'New Proposal',
  client: '',
  date: new Date().toISOString().split('T')[0],
  context: '',
  timeline: '',
  process: '',
  includeTermination: false,
  termination: '',
  includeCopyright: false,
  copyright: '',
  deliverables: [],
  deliverablesPreface: ''
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0C0C0D',
    color: '#fff',
    padding: '0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #222'
  },
  title: {
    fontSize: '24px',
    fontFamily: 'var(--font-monument)',
    margin: '0'
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  button: {
    padding: '0 16px',
    height: '36px',
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative' as const
  },
  tooltip: {
    position: 'absolute' as const,
    bottom: '-42px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1A1A1A',
    color: '#fff',
    padding: '5px 5px 5px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #222',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease'
  },
  shortcutKey: {
    height: '24px',
    width: '24px',
    backgroundColor: '#1A1A1A',
    color: '#ccc',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButton: {
    padding: '0',
    width: '36px',
    minWidth: '36px',
    justifyContent: 'center'
  }
};

export default function Home() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        const newProposal: Proposal = {
          ...defaultProposal,
          id: Date.now().toString(),
        };
        const updatedProposals = [...proposals, newProposal];
        setProposals(updatedProposals);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
        router.push(`/proposal/${newProposal.id}`);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [proposals, router]);

  useEffect(() => {
    if (session) {
      const savedProposals = localStorage.getItem(STORAGE_KEY);
      if (savedProposals) {
        try {
          const parsed = JSON.parse(savedProposals);
          const validatedProposals = parsed.map((p: any) => ({
            ...defaultProposal,
            ...p,
            deliverables: Array.isArray(p.deliverables) ? p.deliverables : []
          }));
          setProposals(validatedProposals);
        } catch (error) {
          console.error('Error parsing proposals:', error);
          setProposals([]);
        }
      }
    }
  }, [session]);

  const handleEdit = (id: string) => {
    router.push(`/proposal/${id}`);
  };

  const handleDuplicate = (id: string) => {
    const proposalToDuplicate = proposals.find(p => p.id === id);
    if (proposalToDuplicate) {
      const newProposal = {
        ...proposalToDuplicate,
        id: Date.now().toString(),
        title: `${proposalToDuplicate.title} (Copy)`,
      };
      
      const updatedProposals = [...proposals, newProposal];
      setProposals(updatedProposals);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
    }
  };

  const handleCreateNew = () => {
    const newProposal: Proposal = {
      ...defaultProposal,
      id: Date.now().toString(),
    };
    
    const updatedProposals = [...proposals, newProposal];
    setProposals(updatedProposals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
    router.push(`/proposal/${newProposal.id}`);
  };

  const handleDelete = (id: string) => {
    const updatedProposals = proposals.filter(p => p.id !== id);
    setProposals(updatedProposals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Proposal Generator</title>
        <meta name="description" content="Generate professional proposals easily" />
      </Head>
      
      {!session ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h1>Welcome to Proposal Generator</h1>
          <button
            onClick={() => signIn('google')}
            style={styles.button}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              style={{ width: '20px', height: '20px' }} 
            />
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>Proposal Generator</h1>
            <div style={styles.buttonContainer}>
              <button
                onClick={handleCreateNew}
                style={styles.button}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: '#242424',
                    borderColor: '#404040'
                  });
                  const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                  if (tooltip) {
                    // Store the timeout ID on the button element
                    const timeoutId = setTimeout(() => {
                      Object.assign(tooltip.style, {
                        opacity: 1,
                        visibility: 'visible'
                      });
                    }, 500);
                    e.currentTarget.dataset.tooltipTimeout = timeoutId.toString();
                  }
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: '#1A1A1A',
                    borderColor: '#333'
                  });
                  const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
                  if (tooltip) {
                    // Clear the timeout if it exists
                    const timeoutId = e.currentTarget.dataset.tooltipTimeout;
                    if (timeoutId) {
                      clearTimeout(parseInt(timeoutId));
                      delete e.currentTarget.dataset.tooltipTimeout;
                    }
                    Object.assign(tooltip.style, {
                      opacity: 0,
                      visibility: 'hidden'
                    });
                  }
                }}
              >
                Create
                <div data-tooltip style={styles.tooltip}>
                  <span>New proposal</span>
                  <span style={styles.shortcutKey}>N</span>
                </div>
              </button>
              <button
                onClick={() => signOut()}
                style={{...styles.button, ...styles.iconButton}}
                aria-label="Sign out"
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
                <img 
                  src="/assets/images/door.svg" 
                  alt="Sign out" 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    filter: 'brightness(0) saturate(100%) invert(80%) sepia(0%) saturate(0%) hue-rotate(137deg) brightness(97%) contrast(91%)'
                  }} 
                />
              </button>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <ProposalList
              proposals={proposals}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}
    </div>
  );
}
