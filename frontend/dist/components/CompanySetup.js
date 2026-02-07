'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload, FileText, Building, CheckCircle } from 'lucide-react';
export function CompanySetup({ onSetupComplete }) {
    const [step, setStep] = useState(1);
    const [companyName, setCompanyName] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [setupComplete, setSetupComplete] = useState(false);
    function handleCompanySubmit(e) {
        e.preventDefault();
        if (companyName.trim()) {
            setStep(2);
        }
    }
    function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    }
    function handleFileProcess() {
        if (!uploadedFile)
            return;
        setIsProcessing(true);
        setTimeout(function () {
            setIsProcessing(false);
            setSetupComplete(true);
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
        return (_jsx("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 text-green-500 mx-auto mb-4", children: _jsx(CheckCircle, { size: 64 }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Setup Complete!" }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["Your company \"", companyName, "\" has been configured successfully."] }), _jsx("button", { onClick: resetSetup, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "Setup Another Company" })] }) }));
    }
    return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-center mb-6", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`, children: "1" }), _jsx("div", { className: `w-12 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}` }), _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`, children: "2" })] }), step === 1 && (_jsxs("div", { children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-12 h-12 text-blue-500 mx-auto mb-3", children: _jsx(Building, { size: 48 }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Company Information" }), _jsx("p", { className: "text-gray-600", children: "Tell us about your company" })] }), _jsxs("form", { onSubmit: handleCompanySubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Company Name *" }), _jsx("input", { type: "text", value: companyName, onChange: function (e) { setCompanyName(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Enter company name", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description (Optional)" }), _jsx("textarea", { value: companyDescription, onChange: function (e) { setCompanyDescription(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Brief description of your company", rows: 3 })] }), _jsx("button", { type: "submit", disabled: !companyName.trim(), className: "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Continue" })] })] })), step === 2 && (_jsxs("div", { children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-12 h-12 text-blue-500 mx-auto mb-3", children: _jsx(Upload, { size: 48 }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Upload FAQ Data" }), _jsx("p", { className: "text-gray-600", children: "Upload your FAQ information" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: uploadedFile ? (_jsx("div", { className: "w-8 h-8 text-green-500", children: _jsx(CheckCircle, { size: 32 }) })) : (_jsx("div", { className: "w-8 h-8 text-gray-400", children: _jsx(FileText, { size: 32 }) })) }), uploadedFile ? (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "File selected:" }), _jsx("p", { className: "font-medium text-gray-900", children: uploadedFile.name })] })) : (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Upload a PDF or Excel file containing your FAQ data" }), _jsx("p", { className: "text-xs text-gray-500", children: "Supported formats: .pdf, .xlsx, .xls" })] }))] }), _jsx("input", { type: "file", accept: ".pdf,.xlsx,.xls", onChange: handleFileUpload, className: "hidden", id: "file-upload" }), _jsx("label", { htmlFor: "file-upload", className: "block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors", children: "Choose File" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: function () { setStep(1); }, className: "flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors", children: "Back" }), _jsx("button", { onClick: handleFileProcess, disabled: !uploadedFile || isProcessing, className: "flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isProcessing ? 'Processing...' : 'Process & Complete' })] })] }))] }));
}
//# sourceMappingURL=CompanySetup.js.map