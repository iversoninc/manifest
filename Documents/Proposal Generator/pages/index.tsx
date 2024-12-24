import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProposalList from '../components/ProposalList';
import type { Proposal } from '../components/ProposalList';
import Head from 'next/head';

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
    backgroundColor: '#000',
    color: '#fff',
    padding: '0'
  }
};

export default function Home() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
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
  }, []); // Only run on mount

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

  return (
    <>
      <Head>
        <title>Proposal Generator</title>
      </Head>
      <div style={styles.container}>
        <ProposalList
          proposals={proposals}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onCreateNew={handleCreateNew}
        />
      </div>
    </>
  );
}
