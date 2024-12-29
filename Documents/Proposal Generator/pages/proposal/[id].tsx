import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProposalForm from '../../components/ProposalForm';
import { ProposalPreview } from '../../components/ProposalPreview';
import html2pdf from 'html2pdf.js';

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
    backgroundColor: '#0C0C0D',
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
    backgroundColor: '#0C0C0D'
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

const EditProposal = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(defaultProposal);
  const [isGenerating, setIsGenerating] = useState(false);

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
    
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving proposal:', error);
      }
    }
  };

  const addDeliverable = () => {
    const newDeliverable = {
      title: '',
      description: '',
      cost: ''
    };
    const updatedData = {
      ...formData,
      deliverables: [...formData.deliverables, newDeliverable]
    };
    setFormData(updatedData);
    
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving proposal:', error);
      }
    }
  };

  const removeDeliverable = (index: number) => {
    const updatedDeliverables = [...formData.deliverables];
    updatedDeliverables.splice(index, 1);
    const updatedData = {
      ...formData,
      deliverables: updatedDeliverables
    };
    setFormData(updatedData);
    
    const savedProposals = localStorage.getItem(STORAGE_KEY);
    if (savedProposals) {
      try {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === id ? updatedData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      } catch (error) {
        console.error('Error saving proposal:', error);
      }
    }
  };

  const generatePDF = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Save current state
      const savedProposals = localStorage.getItem(STORAGE_KEY);
      if (savedProposals) {
        const proposals = JSON.parse(savedProposals);
        const updatedProposals = proposals.map((p: any) => 
          p.id === formData.id ? formData : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
      }

      // Create a temporary div for the PDF content
      const element = document.createElement('div');
      element.style.backgroundColor = '#111';
      element.style.padding = '40px';
      element.style.color = '#fff';

      // Render the proposal preview into the temporary div
      const previewElement = document.createElement('div');
      element.appendChild(previewElement);
      
      // Use ReactDOM to render the preview
      const ReactDOM = (await import('react-dom')).default;
      ReactDOM.render(<ProposalPreview proposal={formData} />, previewElement);

      // Generate and download the PDF
      const opt = {
        margin: 0,
        filename: `${formData.title || 'proposal'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          backgroundColor: '#111',
          windowWidth: 1200
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true,
          floatPrecision: 16
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
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
    router.push('/');
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
            handleSubmit={generatePDF}
            onBack={handleBack}
          />
        </div>
        <div style={styles.previewContainer}>
          <ProposalPreview proposal={formData} />
        </div>
      </div>
    </div>
  );
};

export default EditProposal;
