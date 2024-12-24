export const styles = {
  page: {
    width: '100%',
    minHeight: '11in',
    backgroundColor: '#0D0D0D',
    color: '#fff',
    fontFamily: 'var(--font-monument)',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    border: '1px solid #1a1a1a',
    borderRadius: '6px'
  },
  contentContainer: {
    minHeight: 'calc(11in - 80px)',
    position: 'relative' as const,
    columnWidth: '100%',
    columnCount: 1,
    columnGap: 0,
    padding: '0'
  },
  section: {
    breakInside: 'avoid' as const,
    marginTop: '20px'
  },
  sectionTitle: {
    fontSize: '13px',
    lineHeight: 1.73,
    fontFamily: 'var(--font-monument)',
    color: '#F2F2F2',
    marginBottom: '2px'
  },
  text: {
    fontSize: '13px',
    lineHeight: 1.73,
    marginBottom: '20px',
    fontFamily: 'var(--font-monument)',
    color: '#ccc',
    whiteSpace: 'pre-wrap'
  },
  deliverablesTable: {
    border: '1px solid #333333',
    marginBottom: '24px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  th: {
    textAlign: 'left' as const,
    padding: '15px',
    backgroundColor: '#1a1a1a',
    color: '#727272',
    fontWeight: '500',
    fontSize: '11px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-monument-semi-mono)',
    borderBottom: '1px solid #333'
  },
  td: {
    padding: '15px',
    verticalAlign: 'top' as const,
    borderBottom: '1px solid #333'
  },
  deliverableTitle: {
    fontSize: '11px',
    fontWeight: '500',
    marginBottom: '4px',
    color: '#e6e6e6',
    fontFamily: 'var(--font-monument-semi-mono)'
  },
  deliverableCost: {
    color: '#A6A6A6',
    fontSize: '11px',
    fontFamily: 'var(--font-monument-semi-mono)'
  },
  deliverableDescription: {
    fontSize: '12px',
    lineHeight: 1.73,
    fontFamily: 'var(--font-monument)'
  },
  total: {
    textAlign: 'left' as const,
    padding: '20px 15px',
    borderTop: '1px solid #333',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'var(--font-monument-semi-mono)'
  },
  pageNumber: {
    position: 'absolute' as const,
    bottom: '24px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    color: '#727272',
    fontSize: '11px',
    fontFamily: 'var(--font-monument-semi-mono)',
    textTransform: 'uppercase' as const,
    borderTop: '1px solid #1A1A1A',
    paddingTop: '24px'
  },
  footerLogo: {
    height: '18px',
    width: 'auto'
  },
  pageCount: {
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center' as const
  },
  title: {
    fontSize: '52px',
    lineHeight: 1.23,
    fontFamily: 'var(--font-monument)',
    color: '#fff',
    marginBottom: '12px',
    letterSpacing: -0.015
  },
  headerInfo: {
    display: 'flex',
    gap: '24px',
    marginBottom: '40px'
  },
  headerItem: {
    fontSize: '13px',
    color: '#727272',
    fontFamily: 'var(--font-monument-semi-mono)',
    textTransform: 'uppercase' as const
  },
  previewContainer: {
    width: '100%',
    maxWidth: '850px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px'
  },
  divider: {
    height: '1px',
    backgroundColor: '#333333',
    margin: '24px 0 0 0'
  },
  signatureSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '64px',
    gap: '40px'
  },
  signatureColumn: {
    flex: 1
  },
  signatureField: {
    marginBottom: '32px'
  },
  signatureLabel: {
    fontSize: '11px',
    lineHeight: '16px',
    fontFamily: 'var(--font-monument-semi-mono)',
    color: '#727272',
    marginBottom: '8px',
    textTransform: 'uppercase' as const
  },
  signatureValue: {
    fontSize: '13px',
    lineHeight: '22px',
    fontFamily: 'var(--font-monument)',
    color: '#F2F2F2',
    borderBottom: '1px solid #333333',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '8px',
    position: 'relative'
  },
  signatureImage: {
    width: '150px',
    position: 'absolute',
    bottom: '-1px'
  }
} as const;
