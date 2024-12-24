import React, { useRef, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { styles } from '../styles/proposalPreview';
import { DeliverableTable } from './proposal/DeliverableTable';
import { ProposalSection } from './proposal/ProposalSection';
import { ProposalPage } from './proposal/ProposalPage';
import { SignatureSection } from './proposal/SignatureSection';

const PAGE_HEIGHT = 1056; // US Letter height (11 inches * 96 DPI)
const CONTENT_HEIGHT = PAGE_HEIGHT - 80; // Accounting for padding

interface Props {
  data: any;
}

const ProposalPreview: React.FC<Props> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const [isClient, setIsClient] = useState(false);

  const {
    title,
    client,
    date,
    context,
    timeline,
    process,
    deliverables = [],
    deliverablesPreface,
    deliverablesConclusion,
    includeTermination,
    termination,
    includeCopyright,
    copyright
  } = data;

  const calculateTotal = () => {
    return deliverables
      .reduce((sum: number, item: any) => sum + (parseFloat(item.cost) || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatCost = (cost: string | number) => {
    const value = typeof cost === 'string' ? parseFloat(cost) : cost;
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + ' / MO';
  };

  const renderHeader = () => (
    <>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.headerInfo}>
        <span style={styles.headerItem}>PREPARED BY IVERSON FOR {client?.toUpperCase()}  |  {date}</span>
      </div>
    </>
  );

  const sections = [
    {
      id: 'header',
      content: renderHeader(),
      breakable: false
    },
    {
      id: 'context',
      content: (
        <ProposalSection title="CONTEXT">
          {context && <p style={styles.text}>{context}</p>}
        </ProposalSection>
      ),
      breakable: true
    },
    {
      id: 'timeline',
      content: (
        <ProposalSection title="TIMELINE">
          {timeline && <p style={styles.text}>{timeline}</p>}
        </ProposalSection>
      ),
      breakable: true
    },
    {
      id: 'deliverables',
      content: (
        <ProposalSection title="DELIVERABLES & PRICING">
          {deliverablesPreface && <p style={styles.text}>{deliverablesPreface}</p>}
          <DeliverableTable 
            deliverables={deliverables}
            calculateTotal={calculateTotal}
            formatCost={formatCost}
          />
          {deliverablesConclusion && <p style={styles.text}>{deliverablesConclusion}</p>}
        </ProposalSection>
      ),
      breakable: false
    },
    {
      id: 'process',
      content: (
        <ProposalSection title="PROCESS">
          {process && <p style={styles.text}>{process}</p>}
        </ProposalSection>
      ),
      breakable: true
    },
    {
      id: 'termination',
      content: includeTermination && (
        <ProposalSection title="TERMINATION">
          {termination && <p style={styles.text}>{termination}</p>}
        </ProposalSection>
      ),
      breakable: true
    },
    {
      id: 'copyright',
      content: includeCopyright && (
        <ProposalSection title="COPYRIGHT" noDivider>
          {copyright && <p style={styles.text}>{copyright}</p>}
        </ProposalSection>
      ),
      breakable: true
    },
    {
      id: 'signatures',
      content: <SignatureSection client={client} />,
      breakable: false
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !contentRef.current) return;

    const measureHeight = (content: React.ReactNode): number => {
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${contentRef.current!.offsetWidth}px;
        visibility: hidden;
      `;
      document.body.appendChild(tempContainer);

      const element = React.createElement('div', {}, content);
      tempContainer.innerHTML = ReactDOMServer.renderToString(element);
      const height = tempContainer.offsetHeight;
      document.body.removeChild(tempContainer);
      return height;
    };

    const measureAndCreatePages = () => {
      const pageContents: React.ReactNode[][] = [[]];
      let currentPage = 0;
      let currentHeight = 0;

      sections.forEach((section) => {
        if (!section.content) return;

        const sectionHeight = measureHeight(section.content);

        if (!section.breakable || sectionHeight <= CONTENT_HEIGHT) {
          if (currentHeight + sectionHeight > CONTENT_HEIGHT) {
            currentPage++;
            pageContents[currentPage] = [];
            currentHeight = 0;
          }
          pageContents[currentPage].push(section.content);
          currentHeight += sectionHeight;
        } else {
          if (currentHeight > 0) {
            currentPage++;
            pageContents[currentPage] = [];
          }
          pageContents[currentPage].push(section.content);
          currentHeight = sectionHeight;
          if (currentHeight > CONTENT_HEIGHT) {
            currentPage++;
            pageContents[currentPage] = [];
            currentHeight = 0;
          }
        }
      });

      setPages(pageContents);
    };

    measureAndCreatePages();
    window.addEventListener('resize', measureAndCreatePages);
    return () => window.removeEventListener('resize', measureAndCreatePages);
  }, [sections, isClient]);

  if (!isClient) {
    return <div style={styles.previewContainer} ref={contentRef}>{sections[0].content}</div>;
  }

  return (
    <div style={styles.previewContainer} ref={contentRef}>
      {pages.map((content, index) => (
        <ProposalPage
          key={index}
          content={content}
          pageNumber={index + 1}
          totalPages={pages.length}
          client={client}
        />
      ))}
    </div>
  );
};

export default ProposalPreview;