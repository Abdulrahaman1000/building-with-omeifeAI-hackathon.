import React, { useState, useRef } from 'react';
import { Upload, Copy, Loader2, Key, Volume2, CheckCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';

const AudioTranscription = () => {
  const { apiKey, generateApiKey } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState(null);
  const [manualApiKey, setManualApiKey] = useState('');
  const [useManualKey, setUseManualKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setTranscription('');
      setUploadSuccess(false);
      setError(null);
    }
  };

  const ensureApiKey = async () => {
    if (!apiKey && !useManualKey) {
      setIsGeneratingKey(true);
      try {
        await generateApiKey();
      } catch (err) {
        throw new Error('Failed to generate API key');
      } finally {
        setIsGeneratingKey(false);
      }
    }
    return useManualKey ? manualApiKey : apiKey;
  };

  const handleTranscription = async () => {
    if (!audioFile) {
      setError('Please select an audio file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keyToUse = await ensureApiKey();
      if (!keyToUse) {
        throw new Error('No API key available');
      }

      const formData = new FormData();
      formData.append('file', audioFile);  // Field name must be 'file'

      const response = await fetch('https://apis.omeife.ai/api/v1/user/developer/transcription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.auth === 'auth-001') {
          const newKey = await generateApiKey();
          if (!newKey) throw new Error('Session expired');
          return handleTranscription();
        }
        throw new Error(data.message || 'Transcription failed');
      }

      if (data.status === 'success') {
        setTranscription(data.data.transcription || 'No transcription available');
        setUploadSuccess(true);
      } else {
        throw new Error(data.message || 'Transcription failed');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
      setUploadSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription)
        .catch(copyErr => console.error('Copy failed:', copyErr));
    }
  };

  const handleClear = () => {
    setAudioFile(null);
    setTranscription('');
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            <div className="card-header d-flex align-items-center">
              <Volume2 className="me-2 text-primary" />
              <h2 className="card-title mb-0">Audio Transcription</h2>
            </div>
            <div className="card-body">
              {/* API Key Section */}
              <div className="mb-4">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="useManualKey"
                    checked={useManualKey}
                    onChange={() => setUseManualKey(!useManualKey)}
                  />
                  <label className="form-check-label" htmlFor="useManualKey">
                    Use custom API key
                  </label>
                </div>

                {useManualKey && (
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Key size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your API key"
                      value={manualApiKey}
                      onChange={(e) => setManualApiKey(e.target.value)}
                    />
                  </div>
                )}

                {!useManualKey && apiKey && (
                  <div className="alert alert-info d-flex align-items-center">
                    <Key className="me-2" size={16} />
                    <small>Using your generated API key</small>
                  </div>
                )}

                {!useManualKey && !apiKey && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={generateApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? (
                      <>
                        <Loader2 className="me-1 spin" size={16} />
                        Generating...
                      </>
                    ) : 'Generate API Key'}
                  </button>
                )}
              </div>

              {/* File Upload Section */}
              <div className="mb-4">
                <div className="input-group mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*"
                    className="form-control"
                    style={{ display: 'none' }}
                  />
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload className="me-2" size={16} />
                    {audioFile ? audioFile.name : 'Select Audio File'}
                  </button>
                </div>

                {audioFile && (
                  <div className="d-flex gap-2 mb-3">
                    <button
                      onClick={handleTranscription}
                      disabled={isLoading || isGeneratingKey || (!apiKey && !manualApiKey)}
                      className="btn btn-primary flex-grow-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="me-2 spin" size={16} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="me-2" size={16} />
                          Transcribe Audio
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleClear}
                      className="btn btn-outline-secondary"
                      disabled={isLoading}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Status */}
              {uploadSuccess && (
                <div className="alert alert-success d-flex align-items-center">
                  <CheckCircle className="me-2" size={16} />
                  <span>Audio file successfully processed</span>
                </div>
              )}

              {/* Error Handling */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <div className="flex-grow-1">{error}</div>
                  {error.includes('expired') && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </button>
                  )}
                </div>
              )}

              {/* Transcription Result */}
              {transcription && (
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Transcription Result</h5>
                    <button 
                      onClick={handleCopyText}
                      className="btn btn-sm btn-outline-secondary"
                      title="Copy transcription"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <textarea 
                    readOnly 
                    value={transcription}
                    className="form-control bg-light"
                    rows="8"
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscription;