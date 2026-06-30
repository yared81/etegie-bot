'use client';

import React, { useState } from 'react';
import { Upload as UploadIcon, FileText as FileTextIcon, Building as BuildingIcon, CheckCircle as CheckCircleIcon } from 'lucide-react';

const Upload = UploadIcon as any;
const FileText = FileTextIcon as any;
const Building = BuildingIcon as any;
const CheckCircle = CheckCircleIcon as any;


// Self-contained styles — no Tailwind dependency required.
const setupStyles = `
  .etegie-setup {
    max-width: 440px !important;
    margin: 0 auto !important;
    padding: 28px !important;
    background: #ffffff !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    color: #111827 !important;
  }

  /* ── Stepper ── */
  .etegie-stepper {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-bottom: 28px !important;
    gap: 0 !important;
  }
  .etegie-step-circle {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    flex-shrink: 0 !important;
    transition: background 0.3s !important;
  }
  .etegie-step-circle.active   { background: #3b82f6 !important; color: #ffffff !important; }
  .etegie-step-circle.inactive { background: #e5e7eb !important; color: #6b7280 !important; }
  .etegie-step-line {
    width: 48px !important;
    height: 3px !important;
    border-radius: 2px !important;
    margin: 0 8px !important;
    transition: background 0.3s !important;
  }
  .etegie-step-line.active   { background: #3b82f6 !important; }
  .etegie-step-line.inactive { background: #e5e7eb !important; }

  /* ── Section Header ── */
  .etegie-setup-icon {
    display: flex !important;
    justify-content: center !important;
    margin-bottom: 12px !important;
    color: #3b82f6 !important;
  }
  .etegie-setup-title {
    text-align: center !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #111827 !important;
    margin: 0 0 6px !important;
  }
  .etegie-setup-subtitle {
    text-align: center !important;
    font-size: 14px !important;
    color: #6b7280 !important;
    margin: 0 0 24px !important;
  }

  /* ── Form Elements ── */
  .etegie-setup-form-group {
    margin-bottom: 18px !important;
  }
  .etegie-setup-label {
    display: block !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #374151 !important;
    margin-bottom: 6px !important;
  }
  .etegie-setup-input,
  .etegie-setup-textarea {
    width: 100% !important;
    padding: 10px 14px !important;
    border: 1.5px solid #d1d5db !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    color: #111827 !important;
    background: #f9fafb !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
    font-family: inherit !important;
    box-sizing: border-box !important;
  }
  .etegie-setup-input::placeholder,
  .etegie-setup-textarea::placeholder { color: #9ca3af !important; }
  .etegie-setup-input:focus,
  .etegie-setup-textarea:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
    background: #ffffff !important;
  }
  .etegie-setup-textarea {
    resize: vertical !important;
    min-height: 80px !important;
  }

  /* ── Buttons ── */
  .etegie-setup-btn-primary {
    width: 100% !important;
    padding: 11px 20px !important;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 10px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: opacity 0.2s, transform 0.2s !important;
    font-family: inherit !important;
    margin-top: 8px !important;
  }
  .etegie-setup-btn-primary:hover:not(:disabled) {
    opacity: 0.92 !important;
    transform: translateY(-1px) !important;
  }
  .etegie-setup-btn-primary:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }
  .etegie-setup-btn-row {
    display: flex !important;
    gap: 10px !important;
    margin-top: 8px !important;
  }
  .etegie-setup-btn-secondary {
    flex: 1 !important;
    padding: 11px 20px !important;
    background: #f3f4f6 !important;
    color: #374151 !important;
    border: none !important;
    border-radius: 10px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
    font-family: inherit !important;
  }
  .etegie-setup-btn-secondary:hover { background: #e5e7eb !important; }
  .etegie-setup-btn-primary.flex-1 { flex: 1 !important; width: auto !important; }

  /* ── Upload Zone ── */
  .etegie-upload-zone {
    border: 2px dashed #d1d5db !important;
    border-radius: 12px !important;
    padding: 28px 20px !important;
    text-align: center !important;
    margin-bottom: 14px !important;
    transition: border-color 0.2s !important;
  }
  .etegie-upload-zone.has-file { border-color: #22c55e !important; background: #f0fdf4 !important; }
  .etegie-upload-icon {
    display: flex !important;
    justify-content: center !important;
    margin-bottom: 12px !important;
  }
  .etegie-upload-icon.success { color: #22c55e !important; }
  .etegie-upload-icon.empty   { color: #9ca3af !important; }
  .etegie-upload-filename {
    font-weight: 600 !important;
    font-size: 14px !important;
    color: #111827 !important;
    margin: 4px 0 0 !important;
  }
  .etegie-upload-hint {
    font-size: 13px !important;
    color: #6b7280 !important;
    margin: 4px 0 0 !important;
  }
  .etegie-upload-ext {
    font-size: 12px !important;
    color: #9ca3af !important;
    margin-top: 4px !important;
  }
  .etegie-file-label {
    display: block !important;
    text-align: center !important;
    padding: 10px 20px !important;
    background: #f3f4f6 !important;
    color: #374151 !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
    font-family: inherit !important;
  }
  .etegie-file-label:hover { background: #e5e7eb !important; }

  /* ── Success State ── */
  .etegie-success {
    text-align: center !important;
    padding: 12px 0 !important;
  }
  .etegie-success-icon {
    display: flex !important;
    justify-content: center !important;
    color: #22c55e !important;
    margin-bottom: 16px !important;
  }
  .etegie-success-title {
    font-size: 22px !important;
    font-weight: 700 !important;
    color: #111827 !important;
    margin: 0 0 8px !important;
  }
  .etegie-success-text {
    font-size: 14px !important;
    color: #6b7280 !important;
    margin: 0 0 20px !important;
  }
`;

interface CompanySetupData {
  companyName: string;
  companyDescription: string;
  fileName: string;
}

interface CompanySetupProps {
  onSetupComplete?: (data: CompanySetupData) => void;
}

/**
 * Company setup component for initial configuration.
 * Self-contained — no Tailwind required.
 */
export function CompanySetup({ onSetupComplete }: CompanySetupProps) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (companyName.trim()) setStep(2);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  }

  function handleFileProcess() {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setTimeout(function () {
      setIsProcessing(false);
      setSetupComplete(true);
      if (onSetupComplete) {
        onSetupComplete({ companyName, companyDescription, fileName: uploadedFile.name });
      }
    }, 2000);
  }

  function resetSetup() {
    setStep(1);
    setCompanyName('');
    setCompanyDescription('');
    setUploadedFile(null);
    setIsProcessing(false);
    setSetupComplete(false);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: setupStyles }} />

      <div className="etegie-setup">
        {/* Stepper */}
        <div className="etegie-stepper">
          <div className={`etegie-step-circle ${step >= 1 ? 'active' : 'inactive'}`}>1</div>
          <div className={`etegie-step-line ${step >= 2 ? 'active' : 'inactive'}`} />
          <div className={`etegie-step-circle ${step >= 2 ? 'active' : 'inactive'}`}>2</div>
        </div>

        {/* ── Success State ── */}
        {setupComplete && (
          <div className="etegie-success">
            <div className="etegie-success-icon"><CheckCircle size={60} /></div>
            <h2 className="etegie-success-title">Setup Complete!</h2>
            <p className="etegie-success-text">
              Your company &ldquo;{companyName}&rdquo; has been configured successfully.
            </p>
            <button onClick={resetSetup} className="etegie-setup-btn-primary" style={{ width: 'auto', padding: '10px 28px' }}>
              Setup Another Company
            </button>
          </div>
        )}

        {/* ── Step 1: Company Info ── */}
        {!setupComplete && step === 1 && (
          <div>
            <div className="etegie-setup-icon"><Building size={44} /></div>
            <h2 className="etegie-setup-title">Company Information</h2>
            <p className="etegie-setup-subtitle">Tell us about your company</p>

            <form onSubmit={handleCompanySubmit}>
              <div className="etegie-setup-form-group">
                <label className="etegie-setup-label">Company Name *</label>
                <input
                  type="text"
                  className="etegie-setup-input"
                  value={companyName}
                  onChange={function (e) { setCompanyName(e.target.value); }}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="etegie-setup-form-group">
                <label className="etegie-setup-label">Description (Optional)</label>
                <textarea
                  className="etegie-setup-textarea"
                  value={companyDescription}
                  onChange={function (e) { setCompanyDescription(e.target.value); }}
                  placeholder="Brief description of your company"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="etegie-setup-btn-primary"
                disabled={!companyName.trim()}
              >
                Continue →
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: FAQ Upload ── */}
        {!setupComplete && step === 2 && (
          <div>
            <div className="etegie-setup-icon"><Upload size={44} /></div>
            <h2 className="etegie-setup-title">Upload FAQ Data</h2>
            <p className="etegie-setup-subtitle">Upload your company's FAQ or knowledge base</p>

            <div className={`etegie-upload-zone${uploadedFile ? ' has-file' : ''}`}>
              <div className={`etegie-upload-icon${uploadedFile ? ' success' : ' empty'}`}>
                {uploadedFile ? <CheckCircle size={32} /> : <FileText size={32} />}
              </div>
              {uploadedFile ? (
                <>
                  <p className="etegie-upload-hint">File selected:</p>
                  <p className="etegie-upload-filename">{uploadedFile.name}</p>
                </>
              ) : (
                <>
                  <p className="etegie-upload-hint">Upload a PDF or Excel file containing your FAQ data</p>
                  <p className="etegie-upload-ext">Supported: .pdf, .xlsx, .xls</p>
                </>
              )}
            </div>

            <input
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="etegie-file-upload"
            />
            <label htmlFor="etegie-file-upload" className="etegie-file-label">
              {uploadedFile ? 'Change File' : 'Choose File'}
            </label>

            <div className="etegie-setup-btn-row" style={{ marginTop: '16px' }}>
              <button
                className="etegie-setup-btn-secondary"
                onClick={function () { setStep(1); }}
              >
                ← Back
              </button>
              <button
                className="etegie-setup-btn-primary flex-1"
                onClick={handleFileProcess}
                disabled={!uploadedFile || isProcessing}
                style={{ flex: 1, width: 'auto' }}
              >
                {isProcessing ? 'Processing…' : 'Process & Complete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
