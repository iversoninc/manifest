import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import FirefliesConfigForm from './FirefliesConfig';
import MeetingSelector from './MeetingSelector';
import type { FirefliesConfig, FirefliesMeeting } from '../config/fireflies';

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
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '50%',
    padding: '16px',
    backgroundColor: '#0C0C0D',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    zIndex: 100
  },
  backButton: {
    height: '36px',
    padding: '0px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#cccccc',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    height: '36px',
    padding: '0px 16px',
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#F2F2F2',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  generateButton: {
    height: '36px',
    padding: '0px 16px',
    backgroundColor: '#F2F2F2',
    color: '#1A1A1A',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease'
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '20px'
  },
  toggle: {
    width: '40px',
    height: '20px',
    backgroundColor: '#333',
    borderRadius: '10px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  toggleActive: {
    backgroundColor: '#fff'
  },
  toggleCircle: {
    width: '16px',
    height: '16px',
    backgroundColor: '#666',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    transition: 'all 0.2s ease'
  },
  toggleCircleActive: {
    backgroundColor: '#0C0C0D',
    transform: 'translateX(20px)'
  },
  toggleCircleHover: {
    backgroundColor: '#999'
  },
  toggleCircleActiveHover: {
    backgroundColor: '#262626'
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#999',
    cursor: 'pointer',
    userSelect: 'none' as const
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
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontFamily: 'var(--font-monument-semi-mono)',
    color: '#727272',
    letterSpacing: '0.5px',
    marginBottom: '16px'
  }
};

interface FormData {
  title: string;
  client: string;
  date: string;
  context: string;
  timeline: string;
  process: string;
  deliverablesPreface: string;
  deliverables: Array<{
    title: string;
    description: string;
    cost: string;
  }>;
  includeTermination: boolean;
  termination: string;
  includeCopyright: boolean;
  copyright: string;
  signature: {
    name: string;
    title: string;
    company: string;
    date: string;
  };
}

const defaultFormData: FormData = {
  title: '',
  client: '',
  date: '',
  context: '',
  timeline: '',
  process: '',
  deliverablesPreface: '',
  deliverables: [],
  includeTermination: false,
  termination: '',
  includeCopyright: false,
  copyright: '',
  signature: {
    name: '',
    title: '',
    company: '',
    date: ''
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
  const [firefliesConfig, setFirefliesConfig] = useState<FirefliesConfig | null>(null);
  const [selectedMeetings, setSelectedMeetings] = useState<FirefliesMeeting[]>([]);

  const handleChange = (field: string) => (value: string) => {
    if (field.includes('deliverables.')) {
      const [_, index, prop] = field.split('.');
      const updatedDeliverables = [...formData.deliverables];
      updatedDeliverables[parseInt(index)] = {
        ...updatedDeliverables[parseInt(index)],
        [prop]: value
      };
      onChange('deliverables', updatedDeliverables);
    } else if (field.includes('signature.')) {
      const [_, prop] = field.split('.');
      onChange('signature', { ...formData.signature, [prop]: value });
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

  const [isHoveringTermination, setIsHoveringTermination] = useState(false);
  const [isHoveringCopyright, setIsHoveringCopyright] = useState(false);

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

      <div style={{ marginBottom: '20px' }}>
        <FirefliesConfigForm onConfigSave={setFirefliesConfig} />
        {firefliesConfig && (
          <MeetingSelector 
            apiKey={firefliesConfig.apiKey}
            onMeetingsSelected={(meetings) => {
              // Combine all meeting transcripts and summaries into the context
              const contextFromMeetings = meetings.map(meeting => `
Meeting: ${meeting.title}
Date: ${new Date(meeting.date).toLocaleDateString()}
${meeting.summary ? `\nSummary:\n${meeting.summary}` : ''}
${meeting.transcript ? `\nTranscript:\n${meeting.transcript}` : ''}
-------------------
`).join('\n');
              
              // Update the context field with the meeting information
              onChange('context', formData.context + '\n\n' + contextFromMeetings);
              setSelectedMeetings(meetings);
            }}
          />
        )}
      </div>

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

      <div style={{ ...styles.formGroup, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          style={{
            ...styles.toggle,
            ...(formData.includeTermination ? styles.toggleActive : {})
          }}
          onClick={() => handleChange('includeTermination')(!formData.includeTermination)}
        >
          <div
            style={{
              ...styles.toggleCircle,
              ...(formData.includeTermination ? styles.toggleCircleActive : {}),
              ...(isHoveringTermination ? (formData.includeTermination ? styles.toggleCircleActiveHover : styles.toggleCircleHover) : {})
            }}
            onMouseEnter={() => setIsHoveringTermination(true)}
            onMouseLeave={() => setIsHoveringTermination(false)}
          />
        </div>
        <label style={styles.toggleLabel}>Include Termination Language</label>
      </div>

      {formData.includeTermination && (
        <FormField
          label="TERMINATION"
          value={formData.termination}
          onChange={handleChange('termination')}
          multiline
        />
      )}

      <div style={{ ...styles.formGroup, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          style={{
            ...styles.toggle,
            ...(formData.includeCopyright ? styles.toggleActive : {})
          }}
          onClick={() => handleChange('includeCopyright')(!formData.includeCopyright)}
        >
          <div
            style={{
              ...styles.toggleCircle,
              ...(formData.includeCopyright ? styles.toggleCircleActive : {}),
              ...(isHoveringCopyright ? (formData.includeCopyright ? styles.toggleCircleActiveHover : styles.toggleCircleHover) : {})
            }}
            onMouseEnter={() => setIsHoveringCopyright(true)}
            onMouseLeave={() => setIsHoveringCopyright(false)}
          />
        </div>
        <label style={styles.toggleLabel}>Include Copyright Terms</label>
      </div>

      {formData.includeCopyright && (
        <FormField
          label="COPYRIGHT"
          value={formData.copyright}
          onChange={handleChange('copyright')}
          multiline
        />
      )}

      {/* Signature Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>SIGNATURE</h3>
        <FormField
          label="NAME"
          value={formData.signature?.name || ''}
          onChange={(value) => handleChange('signature')({ ...formData.signature, name: value })}
        />
        <FormField
          label="TITLE"
          value={formData.signature?.title || ''}
          onChange={(value) => handleChange('signature')({ ...formData.signature, title: value })}
        />
        <FormField
          label="COMPANY"
          value={formData.signature?.company || ''}
          onChange={(value) => handleChange('signature')({ ...formData.signature, company: value })}
        />
        <FormField
          label="DATE"
          value={formData.signature?.date || ''}
          onChange={(value) => handleChange('signature')({ ...formData.signature, date: value })}
        />
      </div>

      <div style={styles.bottomBar}>
        <button
          type="button"
          style={styles.backButton}
          onClick={onBack}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, {
              backgroundColor: '#242424',
              borderColor: '#404040'
            });
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              backgroundColor: 'transparent',
              borderColor: '#333'
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
          Back
        </button>
        <button 
          type="submit" 
          style={styles.submitButton}
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
          Create
        </button>
      </div>
    </form>
  );
};

export default ProposalForm;
