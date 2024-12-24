// components/PdfDocument.tsx
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import React from 'react';

interface Props {
  data: any;
}

// Register font
Font.register({
  family: 'ABC Monument Grotesk',
  src: '/assets/fonts/ABCMonumentGrotesk-Regular.otf'
});

Font.register({
  family: 'ABC Monument Grotesk Semi-Mono',
  src: '/assets/fonts/ABCMonumentGroteskSemi-Mono-Regular.otf'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'ABC Monument Grotesk'
  },
  section: {
    marginBottom: 30,
    breakInside: 'auto'
  },
  sectionHeader: {
    marginBottom: 16,
    breakInside: 'avoid'
  },
  sectionTitle: {
    fontSize: 15,
    lineHeight: 1.73, // 26px equivalent
    fontFamily: 'ABC Monument Grotesk',
    color: '#F2F2F2',
    marginBottom: 16
  },
  title: {
    fontSize: 52,
    lineHeight: 1.23, // 64px equivalent
    fontFamily: 'ABC Monument Grotesk',
    color: '#fff',
    marginBottom: 40,
    letterSpacing: -0.015
  },
  text: {
    fontSize: 15,
    lineHeight: 1.73, // 26px equivalent
    marginBottom: 12,
    fontFamily: 'ABC Monument Grotesk',
    whiteSpace: 'pre-wrap',
    color: '#E6E6E6'
  },
  table: {
    width: '100%',
    marginBottom: 24,
    breakInside: 'avoid'
  },
  tableHeader: {
    backgroundColor: '#000',
    color: '#727272',
    padding: 12,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  tableRow: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  tableCell: {
    padding: 15,
    flex: 1
  },
  deliverableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#F2F2F2'
  },
  deliverableCost: {
    fontSize: 12,
    color: '#E6E6E6'
  },
  bulletList: {
    marginTop: 8
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  bullet: {
    width: 10,
    color: '#E6E6E6'
  },
  bulletText: {
    flex: 1,
    color: '#E6E6E6'
  },
  total: {
    padding: 15,
    borderTopColor: '#333',
    borderTopWidth: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F2F2F2'
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    borderTop: '1px solid #1A1A1A',
    paddingTop: 24
  },
  footerLogo: {
    height: 20,
    width: 'auto'
  },
  pageNumber: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 12,
    fontFamily: 'ABC Monument Grotesk Semi-Mono',
    color: '#727272',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  clientText: {
    fontSize: 12,
    fontFamily: 'ABC Monument Grotesk Semi-Mono',
    color: '#727272',
    textTransform: 'uppercase'
  },
  headerInfo: {
    fontSize: 12,
    fontFamily: 'ABC Monument Grotesk Semi-Mono',
    color: '#BBBBBB',
    marginBottom: 40,
    textTransform: 'uppercase'
  },
  signatureSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 64,
    paddingTop: 64,
    borderTop: '1px solid #333'
  },
  signatureColumn: {
    flex: 1,
    maxWidth: 400
  },
  signatureField: {
    marginBottom: 32
  },
  signatureLabel: {
    fontSize: 12,
    lineHeight: 1.33,
    fontFamily: 'ABC Monument Grotesk Semi-Mono',
    color: '#727272',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  signatureValue: {
    fontSize: 13,
    lineHeight: 1.69,
    fontFamily: 'ABC Monument Grotesk',
    color: '#F2F2F2',
    borderBottom: '1px solid #333',
    minHeight: 32,
    paddingBottom: 8
  },
  signatureImage: {
    width: 200,
    marginBottom: -10
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 24
  },
  th: {
    padding: 12,
    flex: 1
  },
  thText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  tr: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  td: {
    padding: 15,
    flex: 1
  }
});

const PageFooter = ({ pageNumber, totalPages, client }: { pageNumber: number; totalPages: number; client: string }) => (
  <View style={styles.footer}>
    <Image src="/assets/images/logo.png" style={styles.footerLogo} />
    <Text style={styles.pageNumber}>{pageNumber} OF {totalPages}</Text>
    <Text style={styles.clientText}>PREPARED FOR {client.toUpperCase()}</Text>
  </View>
);

const PdfDocument: React.FC<Props> = ({ data }) => {
  const {
    title,
    client,
    date,
    context,
    timeline,
    process,
    termination,
    includeTermination,
    deliverables,
    includeCopyright,
    copyright,
    deliverablesPreface,
    deliverablesConclusion
  } = data;

  const calculateTotal = () => {
    return deliverables
      .reduce((sum: number, item: any) => sum + (parseFloat(item.cost) || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatCost = (cost: string) => {
    const amount = parseFloat(cost) || 0;
    return `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / MO`;
  };

  const renderBulletPoints = (text: string) => {
    return text.split('\n').map((line, index) => (
      <Text key={index} style={styles.text}>
        {line}
      </Text>
    ));
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header Section */}
        <View style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.headerInfo}>
              PREPARED BY IVERSON FOR {client.toUpperCase()} | {date.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Context Section */}
        {context && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Context</Text>
            </View>
            <Text style={styles.text}>{context}</Text>
            {(timeline || process || deliverables.length > 0) && <View style={styles.divider} />}
          </View>
        )}

        {/* Timeline Section */}
        {timeline && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Timeline</Text>
            </View>
            <Text style={styles.text}>{timeline}</Text>
            {(process || deliverables.length > 0) && <View style={styles.divider} />}
          </View>
        )}

        {/* Process Section */}
        {process && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Process</Text>
            </View>
            <Text style={styles.text}>{process}</Text>
            {deliverables.length > 0 && <View style={styles.divider} />}
          </View>
        )}

        {/* Deliverables Section */}
        {deliverables.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Deliverables & Pricing</Text>
            </View>
            {deliverablesPreface && (
              <Text style={styles.text}>{deliverablesPreface}</Text>
            )}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.th}>
                  <Text style={styles.thText}>DELIVERABLE</Text>
                </View>
                <View style={styles.th}>
                  <Text style={styles.thText}>DESCRIPTION</Text>
                </View>
              </View>
              {deliverables.map((deliverable: any, index: number) => (
                <View key={index} style={styles.tr}>
                  <View style={styles.td}>
                    <Text style={styles.deliverableTitle}>{deliverable.title}</Text>
                    <Text style={styles.deliverableCost}>{formatCost(deliverable.cost)}</Text>
                  </View>
                  <View style={styles.td}>
                    <Text style={styles.text}>
                      {deliverable.description}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.tr}>
                <View style={styles.total}>
                  <Text style={styles.totalText}>TOTAL COST: {calculateTotal()} / MO</Text>
                </View>
              </View>
            </View>
            {deliverablesConclusion && (
              <Text style={styles.text}>{deliverablesConclusion}</Text>
            )}
            {(includeTermination || includeCopyright) && <View style={styles.divider} />}
          </View>
        )}

        {/* Termination Section */}
        {includeTermination && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Termination</Text>
            </View>
            <Text style={styles.text}>{termination}</Text>
            {includeCopyright && <View style={styles.divider} />}
          </View>
        )}

        {/* Copyright Section */}
        {includeCopyright && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Copyright</Text>
            </View>
            <Text style={styles.text}>{copyright}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection} wrap={false}>
          <View style={styles.signatureColumn}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Company</Text>
              <Text style={styles.signatureValue}>IVERSON ENTERPRISES, LLC</Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name</Text>
              <Text style={styles.signatureValue}>SOREN IVERSON</Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature</Text>
              <Text style={styles.signatureValue}></Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Date</Text>
              <Text style={styles.signatureValue}>{date}</Text>
            </View>
          </View>
          <View style={styles.signatureColumn}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Company</Text>
              <Text style={styles.signatureValue}>{client.toUpperCase()}</Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name</Text>
              <Text style={styles.signatureValue}></Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature</Text>
              <Text style={styles.signatureValue}></Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Date</Text>
              <Text style={styles.signatureValue}></Text>
            </View>
          </View>
        </View>

        <PageFooter pageNumber={1} totalPages={1} client={data.client || ''} />
      </Page>
    </Document>
  );
};

export default PdfDocument;
