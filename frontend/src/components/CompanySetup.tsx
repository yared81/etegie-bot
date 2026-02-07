'use client';

import React, { useState } from 'react';
import { Upload, FileText, Table, Building, CheckCircle } from 'lucide-react';

interface CompanySetupData {
  companyName: string;
  companyDescription: string;
  fileName: string;
}

interface CompanySetupProps {
  onSetupComplete?: (data: CompanySetupData) => void;
}

/**
 * Company setup component for initial configuration
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
    if (companyName.trim()) {
      setStep(2);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  }

  function handleFileProcess() {
    if (!uploadedFile) return;

    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(function() {
      setIsProcessing(false);
      setSetupComplete(true);
      
      // Call the completion callback
      if (onSetupComplete) {
        onSetupComplete({
          companyName,
          companyDescription,
          fileName: uploadedFile.name
        });
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

  if (setupComplete) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 text-green-500 mx-auto mb-4">
            <CheckCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
          <p className="text-gray-600 mb-4">
            Your company "{companyName}" has been configured successfully.
          </p>
          <button
            onClick={resetSetup}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Setup Another Company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          1
        </div>
        <div className={`w-12 h-1 mx-2 ${
          step >= 2 ? 'bg-blue-500' : 'bg-gray-200'
        }`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          2
        </div>
      </div>

      {/* Step 1: Company Information */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-12 h-12 text-blue-500 mx-auto mb-3">
              <Building size={48} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            <p className="text-gray-600">Tell us about your company</p>
          </div>

          <form onSubmit={handleCompanySubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={function(e) { setCompanyName(e.target.value); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={companyDescription}
                onChange={function(e) { setCompanyDescription(e.target.value); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your company"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={!companyName.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      )}

      {/* Step 2: FAQ Upload */}
      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-12 h-12 text-blue-500 mx-auto mb-3">
              <Upload size={48} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Upload FAQ Data</h2>
            <p className="text-gray-600">Upload your FAQ information</p>
          </div>

          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {uploadedFile ? (
                  <div className="w-8 h-8 text-green-500">
                    <CheckCircle size={32} />
                  </div>
                ) : (
                  <div className="w-8 h-8 text-gray-400">
                    <FileText size={32} />
                  </div>
                )}
              </div>
              
              {uploadedFile ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">File selected:</p>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a PDF or Excel file containing your FAQ data
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: .pdf, .xlsx, .xls
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={function() { setStep(1); }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={handleFileProcess}
              disabled={!uploadedFile || isProcessing}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Process & Complete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
