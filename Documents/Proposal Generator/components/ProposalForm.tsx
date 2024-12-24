import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  addDeliverable: () => void;
  removeDeliverable: (index: number) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const STORAGE_KEY = 'proposals';

const styles = {
  form: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
    paddingBottom: '80px' // Add padding to account for fixed bottom bar
  },
  row: {
    display: 'flex',
    gap: '16px',
    width: '100%'
  },
  column: {
    flex: 1,
    minWidth: 0
  },
  formGroup: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '100%',
    flex: '1',
    marginBottom: '20px',
    boxSizing: 'border-box' as const
  },
  inputContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const
  },
  inputContainerSingle: {
    height: '52px'
  },
  inputContainerMulti: {
    minHeight: '120px'
  },
  label: {
    position: 'absolute' as const,
    left: '12px',
    fontSize: '13px',
    lineHeight: '22px',
    fontFamily: 'var(--font-monument)',
    color: '#F2F2F2',
    marginBottom: '8px',
    pointerEvents: 'none' as const,
    transition: 'all 0.2s ease',
    padding: '0 4px',
    backgroundColor: '#121212',
  },
  labelSingle: {
    top: '50%',
    transform: 'translateY(-50%)'
  },
  labelMulti: {
    top: '16px',
    transform: 'none'
  },
  labelFilled: {
    top: '8px',
    transform: 'translateY(0)',
    fontSize: '9px'
  },
  input: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    padding: '16px 12px 0',
    background: '#121212',
    border: '1px solid #333333',
    borderRadius: '8px',
    color: '#E0E0E0',
    fontSize: '14px',
    lineHeight: '1.6',
    fontFamily: "'ABC Monument Grotesk Regular', sans-serif",
    outline: 'none',
    resize: 'none' as const
  },
  textarea: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '120px',
    padding: '24px 12px 12px',
    background: '#121212',
    border: '1px solid #333333',
    borderRadius: '8px',
    color: '#E0E0E0',
    fontSize: '14px',
    lineHeight: '1.6',
    fontFamily: "'ABC Monument Grotesk Regular', sans-serif",
    outline: 'none',
    resize: 'none' as const,
    overflow: 'auto'
  },
  error: {
    color: '#EA5858',
    fontSize: '12px',
    marginTop: '4px'
  },
  deliverableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  deliverableContainer: {
    padding: '20px',
    border: '1px solid #333333',
    borderRadius: '8px',
    marginBottom: '16px',
    background: '#121212'
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#1A1A1A',
    color: '#F2F2F2',
    border: '1px solid #333333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'var(--font-monument)',
    transition: 'all 0.2s ease'
  },
  addButtonHover: {
    backgroundColor: '#242424',
    border: '1px solid #404040'
  },
  addButtonActive: {
    backgroundColor: '#2A2A2A',
    transform: 'translateY(1px)'
  },
  removeButton: {
    padding: '4px 8px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    width: '50%', // Take up left half of the screen
    height: '64px',
    backgroundColor: '#000',
    borderTop: '1px solid #333333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: '14px',
    transition: 'color 0.2s ease-in-out',
    ':hover': {
      color: '#fff'
    }
  },
  submitButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#444'
    }
  },
  generateButton: {
    padding: '8px 12px',
    backgroundColor: '#F2F2F2',
    color: '#1A1A1A',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'var(--font-monument)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '20px'
  },
  toggle: {
    width: '44px',
    height: '24px',
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      border: '1px solid #333'
    }
  },
  toggleCircle: {
    width: '18px',
    height: '18px',
    backgroundColor: '#333333',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    transition: 'all 0.2s ease'
  },
  toggleCircleHover: {
    backgroundColor: '#404040'
  },
  toggleActive: {
    backgroundColor: '#FFFFFF'
  },
  toggleCircleActive: {
    backgroundColor: '#000000',
    transform: 'translateX(20px)'
  },
  toggleCircleActiveHover: {
    backgroundColor: '#262626'
  },
  toggleLabel: {
    fontSize: '14px',
    fontFamily: 'var(--font-monument)',
    color: '#F2F2F2'
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    width: '100%'
  },
  logo: {
    height: '24px',
    width: 'auto'
  },
  pageTitle: {
    fontSize: '13px',
    fontFamily: 'var(--font-monument-semi-mono)',
    color: '#727272',
    letterSpacing: '0.5px'
  }
};

const FormField = ({
  label, 
  value, 
  onChange, 
  multiline = false,
  error = false,
  errorMessage = ''
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  error?: boolean;
  errorMessage?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isActive = isFocused || value;

  const adjustHeight = () => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
    if (multiline) {
      adjustHeight();
    }
  };

  return (
    <div style={styles.formGroup}>
      <div style={{
        ...styles.inputContainer,
        ...(multiline ? styles.inputContainerMulti : styles.inputContainerSingle)
      }}>
        <label 
          style={{
            ...styles.label,
            ...(isActive ? styles.labelFilled : (multiline ? styles.labelMulti : styles.labelSingle)),
            color: error ? '#EA5858' : '#727272'
          }}
        >
          {label}
        </label>
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              ...styles.textarea,
              borderColor: error ? '#EA5858' : '#333333'
            }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              ...styles.input,
              borderColor: error ? '#EA5858' : '#333333'
            }}
          />
        )}
      </div>
      {error && errorMessage && (
        <div style={styles.error}>{errorMessage}</div>
      )}
    </div>
  );
};

const ProposalForm: React.FC<Props> = ({ 
  formData, 
  onChange, 
  addDeliverable, 
  removeDeliverable, 
  handleSubmit,
  onBack 
}) => {
  const handleChange = (field: string) => (value: string) => {
    if (field.includes('deliverables.')) {
      const [_, index, prop] = field.split('.');
      const updatedDeliverables = [...formData.deliverables];
      updatedDeliverables[parseInt(index)] = {
        ...updatedDeliverables[parseInt(index)],
        [prop]: value
      };
      onChange('deliverables', updatedDeliverables);
    } else {
      onChange(field, value);
    }
  };

  const calculateTotal = () => {
    return formData.deliverables
      .reduce((sum: number, item: any) => sum + (parseFloat(item.cost) || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const defaultTermination = "Either party may terminate this agreement with 15 days' notice. The initial deposit is non-refundable if Client terminates this Agreement, but Contractor shall refund the initial deposit if Contractor terminates this Agreement prior to the Work being completed and full ownership of the Work being transferred to Client.";

  useEffect(() => {
    if (formData.includeTermination && !formData.termination) {
      onChange('termination', defaultTermination);
    }
  }, [formData.includeTermination]);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.titleBar}>
        <img src="/assets/images/logo.png" alt="Iverson Logo" style={styles.logo} />
        <span style={styles.pageTitle}>PROPOSAL GENERATOR</span>
      </div>

      <FormField
        label="TITLE"
        value={formData.title}
        onChange={handleChange('title')}
      />
      
      <div style={styles.row}>
        <div style={styles.column}>
          <FormField
            label="CLIENT"
            value={formData.client}
            onChange={handleChange('client')}
          />
        </div>
        <div style={styles.column}>
          <FormField
            label="DATE"
            value={formData.date}
            onChange={handleChange('date')}
          />
        </div>
      </div>

      <FormField
        label="CONTEXT"
        value={formData.context}
        onChange={handleChange('context')}
        multiline
      />

      <FormField
        label="TIMELINE"
        value={formData.timeline}
        onChange={handleChange('timeline')}
        multiline
      />

      <div style={{ marginBottom: '20px' }}>
        <div style={styles.deliverableHeader}>
          <h3>DELIVERABLES & PRICING</h3>
          <button 
            style={styles.addButton}
            onClick={addDeliverable}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#242424',
                borderColor: '#404040'
              });
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#1A1A1A',
                borderColor: '#333333'
              });
            }}
            onMouseDown={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#2A2A2A',
                transform: 'translateY(1px)'
              });
            }}
            onMouseUp={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#242424',
                transform: 'none'
              });
            }}
          >
            Add Deliverable
          </button>
        </div>
        
        <FormField
          label="PREFACE"
          value={formData.deliverablesPreface}
          onChange={handleChange('deliverablesPreface')}
          multiline
        />

        {formData.deliverables.map((deliverable: any, index: number) => (
          <div key={index} style={styles.deliverableContainer}>
            <div style={styles.deliverableHeader}>
              <h4>Deliverable {index + 1}</h4>
              {index > 0 && (
                <button 
                  style={styles.removeButton}
                  onClick={() => removeDeliverable(index)}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={styles.row}>
              <div style={styles.column}>
                <FormField
                  label="DELIVERABLE"
                  value={deliverable.title}
                  onChange={handleChange(`deliverables.${index}.title`)}
                />
              </div>
              <div style={styles.column}>
                <FormField
                  label="COST"
                  value={deliverable.cost}
                  onChange={handleChange(`deliverables.${index}.cost`)}
                />
              </div>
            </div>
            
            <FormField
              label="DESCRIPTION"
              value={deliverable.description}
              onChange={handleChange(`deliverables.${index}.description`)}
              multiline
            />
          </div>
        ))}
        
        <FormField
          label="CONCLUSION"
          value={formData.deliverablesConclusion}
          onChange={handleChange('deliverablesConclusion')}
          multiline
        />

        <div style={{ 
          ...styles.deliverableContainer, 
          borderStyle: 'dashed',
          textAlign: 'right' as const
        }}>
          <strong>TOTAL: {calculateTotal()}</strong>
        </div>
      </div>

      <FormField
        label="PROCESS"
        value={formData.process}
        onChange={handleChange('process')}
        multiline
      />

      <div style={styles.toggleContainer}>
        <div 
          style={{
            ...styles.toggle,
            ...(formData.includeTermination ? styles.toggleActive : {})
          }}
          onClick={() => {
            onChange('includeTermination', !formData.includeTermination);
            if (!formData.includeTermination) {
              onChange('termination', defaultTermination);
            } else {
              onChange('termination', '');
            }
          }}
          onMouseEnter={(e) => {
            const circle = e.currentTarget.children[0] as HTMLElement;
            if (formData.includeTermination) {
              circle.style.backgroundColor = '#262626';
            } else {
              circle.style.backgroundColor = '#404040';
            }
          }}
          onMouseLeave={(e) => {
            const circle = e.currentTarget.children[0] as HTMLElement;
            if (formData.includeTermination) {
              circle.style.backgroundColor = '#000000';
            } else {
              circle.style.backgroundColor = '#333333';
            }
          }}
        >
          <div 
            style={{
              ...styles.toggleCircle,
              ...(formData.includeTermination ? styles.toggleCircleActive : {})
            }}
          />
        </div>
        <label style={styles.toggleLabel}>Include termination language</label>
      </div>

      {formData.includeTermination && (
        <FormField
          label="TERMINATION"
          value={formData.termination}
          onChange={handleChange('termination')}
          multiline
        />
      )}

      <div style={styles.toggleContainer}>
        <div 
          style={{
            ...styles.toggle,
            ...(formData.includeCopyright ? styles.toggleActive : {})
          }}
          onClick={() => {
            onChange('includeCopyright', !formData.includeCopyright);
            if (!formData.includeCopyright) {
              onChange('copyright', `Ownership of Intellectual Property: All intellectual property created, developed, or generated during the course of this product design project, including but not limited to designs, drawings, concepts, prototypes, and any related materials (collectively referred to as the "Work"), shall be the exclusive property of the Contractor until full payment is received from the Client.

Upon receipt of full payment, ownership of the Work, including all copyrights, shall be transferred to the Client

The Client acknowledges that prior to full payment, they may not use, reproduce, distribute, or create derivative works from the Work without express written permission from the Contractor.

The Contractor warrants that the Work will be original and will not infringe upon the intellectual property rights of any third party.

The Client agrees to indemnify and hold the Contractor harmless against any third-party claims or legal actions related to the use of the Work after full ownership has been transferred, other than claims alleging a violation of Contractor's warranties.`);
            } else {
              onChange('copyright', '');
            }
          }}
          onMouseEnter={(e) => {
            const circle = e.currentTarget.children[0] as HTMLElement;
            if (formData.includeCopyright) {
              circle.style.backgroundColor = '#262626';
            } else {
              circle.style.backgroundColor = '#404040';
            }
          }}
          onMouseLeave={(e) => {
            const circle = e.currentTarget.children[0] as HTMLElement;
            if (formData.includeCopyright) {
              circle.style.backgroundColor = '#000000';
            } else {
              circle.style.backgroundColor = '#333333';
            }
          }}
        >
          <div 
            style={{
              ...styles.toggleCircle,
              ...(formData.includeCopyright ? styles.toggleCircleActive : {})
            }}
          />
        </div>
        <label style={styles.toggleLabel}>Include copyright terms</label>
      </div>

      {formData.includeCopyright && (
        <FormField
          label="COPYRIGHT"
          value={formData.copyright}
          onChange={handleChange('copyright')}
          multiline
        />
      )}

      <div style={styles.bottomBar}>
        <button
          type="button"
          style={styles.backButton}
          onClick={onBack}
        >
          Back to Proposals
        </button>
        <button type="submit" style={styles.submitButton}>
          Generate PDF
        </button>
      </div>
    </form>
  );
};

export default ProposalForm;
