import { useState, useEffect } from 'react';
import type { FirefliesConfig } from '../config/fireflies';

const STORAGE_KEY = 'fireflies_config';

interface FirefliesConfigProps {
  onConfigSave: (config: FirefliesConfig) => void;
}

export default function FirefliesConfigForm({ onConfigSave }: FirefliesConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isConfigured, setIsConfigured] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load saved config on mount
  useEffect(() => {
    console.log('Loading saved configuration...');
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    console.log('Saved config from localStorage:', savedConfig);
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        console.log('Parsed config:', { ...config, apiKey: config.apiKey ? '[REDACTED]' : undefined });
        setApiKey(config.apiKey);
        setIsConfigured(true);
        onConfigSave(config);
        console.log('Configuration loaded successfully');
      } catch (error) {
        const errorMsg = 'Error loading saved config: ' + (error instanceof Error ? error.message : String(error));
        console.error(errorMsg);
        setErrorMessage(errorMsg);
      }
    } else {
      console.log('No saved configuration found');
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    console.log('Attempting to save configuration...');
    setErrorMessage('');
    
    try {
      if (!apiKey.trim()) {
        throw new Error('API key cannot be empty');
      }

      const config = { apiKey: apiKey.trim() };
      console.log('Saving config to localStorage...', { ...config, apiKey: '[REDACTED]' });
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      
      // Immediately verify the save
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      console.log('Verifying saved config:', savedConfig ? 'Config found' : 'Config not found');
      
      if (!savedConfig) {
        throw new Error('Failed to verify saved configuration');
      }

      // Parse the saved config to make sure it's valid
      const parsedConfig = JSON.parse(savedConfig);
      if (!parsedConfig.apiKey) {
        throw new Error('Saved configuration is invalid');
      }

      console.log('Calling onConfigSave callback...');
      onConfigSave(config);
      
      setIsConfigured(true);
      setSaveStatus('saved');
      console.log('Configuration saved successfully');
      
      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      const errorMsg = 'Error saving config: ' + (error instanceof Error ? error.message : String(error));
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      setSaveStatus('error');
    }
  };

  const handleClear = () => {
    console.log('Clearing configuration...');
    try {
      localStorage.removeItem(STORAGE_KEY);
      setApiKey('');
      setIsConfigured(false);
      setSaveStatus('idle');
      setErrorMessage('');
      onConfigSave({ apiKey: '' });
      console.log('Configuration cleared successfully');
    } catch (error) {
      const errorMsg = 'Error clearing config: ' + (error instanceof Error ? error.message : String(error));
      console.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  // Debug function to check localStorage
  const debugStorage = () => {
    console.log('Current localStorage state:');
    console.log('STORAGE_KEY:', STORAGE_KEY);
    console.log('Saved config:', localStorage.getItem(STORAGE_KEY));
    console.log('All localStorage keys:', Object.keys(localStorage));
  };

  return (
    <div className="fireflies-config">
      <div className="config-header">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="config-toggle"
        >
          {showConfig ? 'Hide Fireflies.ai Config' : 'Configure Fireflies.ai'}
        </button>
        {isConfigured && !showConfig && (
          <span className="status-badge configured">
            ✓ Configured
          </span>
        )}
        <button 
          onClick={debugStorage}
          className="debug-button"
          type="button"
        >
          Debug Storage
        </button>
      </div>

      {showConfig && (
        <div className="config-form">
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <div className="input-group">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => {
                  console.log('API key input changed');
                  setApiKey(e.target.value);
                }}
                placeholder="Enter your Fireflies.ai API key"
                required
              />
              {isConfigured && (
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="button"
              onClick={() => handleSubmit()}
              disabled={saveStatus === 'saved'}
            >
              {saveStatus === 'saved' ? '✓ Saved' : 'Save Configuration'}
            </button>
            {saveStatus === 'error' && (
              <span className="error-message">
                {errorMessage || 'Error saving configuration'}
              </span>
            )}
          </div>
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          <div className="debug-info">
            <strong>Debug Info:</strong>
            <div>Is Configured: {isConfigured ? 'Yes' : 'No'}</div>
            <div>Save Status: {saveStatus}</div>
            <div>API Key Set: {apiKey ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .fireflies-config {
          margin: 1rem 0;
        }
        .config-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .status-badge.configured {
          background: #1a4721;
          color: #4ade80;
        }
        .config-toggle {
          background: transparent;
          border: 1px solid #666;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .config-toggle:hover {
          border-color: #999;
        }
        .debug-button {
          background: #2d2d2d;
          border: 1px solid #666;
          color: #888;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        .debug-button:hover {
          border-color: #999;
        }
        .config-form {
          margin-top: 1rem;
          padding: 1rem;
          background: #1a1a1a;
          border-radius: 4px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          flex: 1;
          padding: 0.5rem;
          background: #333;
          border: 1px solid #666;
          color: #fff;
          border-radius: 4px;
        }
        .form-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        button[type="button"] {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button[type="button"]:hover {
          background: #0060df;
        }
        button[type="button"]:disabled {
          background: #0060df;
          cursor: default;
        }
        .clear-button {
          background: #333;
          color: #fff;
          border: 1px solid #666;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .clear-button:hover {
          background: #444;
        }
        .error-message {
          color: #ff4444;
          margin-top: 0.5rem;
        }
        .debug-info {
          margin-top: 1rem;
          padding: 0.5rem;
          background: #2d2d2d;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #888;
        }
        .debug-info > div {
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
