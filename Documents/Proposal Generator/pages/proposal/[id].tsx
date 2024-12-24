import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProposalForm from '../../components/ProposalForm';
import ProposalPreview from '../../components/ProposalPreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from '../../components/PdfDocument';

const STORAGE_KEY = 'proposals';

const defaultProposal = {
  id: '',
  title: '',
  client: '',
  date: '',
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
  main: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column' as const
  },
  container: {
    display: 'flex',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000'
  },
  formContainer: {
    flex: 'none',
    width: '50vw',
    overflowY: 'auto' as const,
    padding: '64px',
    paddingBottom: '104px'
  },
  previewContainer: {
    flex: 'none',
    width: '50vw',
    backgroundColor: '#111',
    overflowY: 'auto' as const,
    padding: '40px'
  }
};

export default function EditProposal() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(defaultProposal);

  useEffect(() => {
    if (id) {
      const savedProposals = localStorage.getItem(STORAGE_KEY);
      if (savedProposals) {
        try {
          const proposals = JSON.parse(savedProposals);
          const proposal = proposals.find((p: any) => p.id === id);
          if (proposal) {
            setFormData({
              ...defaultProposal,
              ...proposal,
              deliverables: Array.isArray(proposal.deliverables) ? proposal.deliverables : []
            });
          } else {
            // If proposal not found, redirect to home
            router.replace('/');
          }
        } catch (error) {
          console.error('Error loading proposal:', error);
          router.replace('/');
        }
      }
    }
  }, [id, router]);

  const handleChange = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // Save changes to localStorage
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const addDeliverable = () => {
    const updatedData = {
      ...formData,
      deliverables: [...(formData.deliverables || []), { title: '', description: '', cost: '' }]
    };
    setFormData(updatedData);
    
    // Save changes to localStorage
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const removeDeliverable = (index: number) => {
    const updatedData = {
      ...formData,
      deliverables: formData.deliverables.filter((_: any, i: number) => i !== index)
    };
    setFormData(updatedData);
    
    // Save changes to localStorage
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const doc = <PdfDocument data={formData} />;
    return (
      <PDFDownloadLink 
        document={doc}
        fileName={`${formData.client}_proposal.pdf`}
      >
        {({ blob, url, loading, error }) => {
          if (loading) return 'Loading document...';
          if (error) return 'Error generating PDF!';
          if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${formData.client}_proposal.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          return null;
        }}
      </PDFDownloadLink>
    );
  };

  const handleBack = () => {
    // Save current state
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? formData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving proposal:', error);
      }
    }
    
    // Use direct window location change instead of Next.js router
    window.location.href = '/';
  };

  return (
    <div style={styles.main}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <ProposalForm
            formData={formData}
            onChange={handleChange}
            addDeliverable={addDeliverable}
            removeDeliverable={removeDeliverable}
            handleSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
        <div style={styles.previewContainer}>
          <ProposalPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
