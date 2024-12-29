import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProposalPreview } from '../components/ProposalPreview';
import html2pdf from 'html2pdf.js';

const STORAGE_KEY = 'proposals';

const Preview: NextPage = () => {
  const router = useRouter();
  const [proposal, setProposal] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const { id } = router.query;
    if (id && typeof id === 'string') {
      const savedProposals = localStorage.getItem(STORAGE_KEY);
      if (savedProposals) {
        try {
          const proposals = JSON.parse(savedProposals);
          const foundProposal = proposals.find((p: any) => p.id === id);
          if (foundProposal) {
            console.log('Found proposal:', foundProposal);
            setProposal(foundProposal);
          } else {
            console.error('Proposal not found:', id);
            router.push('/');
          }
        } catch (error) {
          console.error('Error parsing proposals:', error);
          router.push('/');
        }
      } else {
        console.error('No proposals found in storage');
        router.push('/');
      }
    }
  }, [router.query]);

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const element = document.getElementById('proposal-content');
      if (!element) {
        throw new Error('Proposal content not found');
      }

      // Fix image paths
      const images = element.getElementsByTagName('img');
      for (let img of Array.from(images)) {
        if (img.src.startsWith('/')) {
          img.src = window.location.origin + img.src;
        }
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${proposal.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#0C0C0D'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          putTotalPages: true,
          compress: true,
          precision: 16
        }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const validateProposal = (data: any) => {
    const requiredFields = ['title', 'client', 'date', 'context', 'timeline', 'process'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return false;
    }
    return true;
  };

  if (!validateProposal(proposal)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-red-500">Error: Invalid proposal data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
        <div id="proposal-content">
          <ProposalPreview proposal={proposal} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
