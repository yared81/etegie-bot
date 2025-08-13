"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySetup = CompanySetup;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function CompanySetup({ onSetupComplete }) {
    const [step, setStep] = (0, react_1.useState)(1);
    const [companyName, setCompanyName] = (0, react_1.useState)('');
    const [companyDescription, setCompanyDescription] = (0, react_1.useState)('');
    const [uploadedFile, setUploadedFile] = (0, react_1.useState)(null);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [setupComplete, setSetupComplete] = (0, react_1.useState)(false);
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
        return (react_1.default.createElement("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" },
            react_1.default.createElement("div", { className: "text-center" },
                react_1.default.createElement(lucide_react_1.CheckCircle, { className: "w-16 h-16 text-green-500 mx-auto mb-4" }),
                react_1.default.createElement("h2", { className: "text-2xl font-bold text-gray-900 mb-2" }, "Setup Complete!"),
                react_1.default.createElement("p", { className: "text-gray-600 mb-4" },
                    "Your company \"",
                    companyName,
                    "\" has been configured successfully."),
                react_1.default.createElement("button", { onClick: resetSetup, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors" }, "Setup Another Company"))));
    }
    return (react_1.default.createElement("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" },
        react_1.default.createElement("div", { className: "flex items-center justify-center mb-6" },
            react_1.default.createElement("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}` }, "1"),
            react_1.default.createElement("div", { className: `w-12 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}` }),
            react_1.default.createElement("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}` }, "2")),
        step === 1 && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "text-center mb-6" },
                react_1.default.createElement(lucide_react_1.Building, { className: "w-12 h-12 text-blue-500 mx-auto mb-3" }),
                react_1.default.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Company Information"),
                react_1.default.createElement("p", { className: "text-gray-600" }, "Tell us about your company")),
            react_1.default.createElement("form", { onSubmit: handleCompanySubmit },
                react_1.default.createElement("div", { className: "mb-4" },
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Company Name *"),
                    react_1.default.createElement("input", { type: "text", value: companyName, onChange: function (e) { setCompanyName(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Enter company name", required: true })),
                react_1.default.createElement("div", { className: "mb-6" },
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Description (Optional)"),
                    react_1.default.createElement("textarea", { value: companyDescription, onChange: function (e) { setCompanyDescription(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Brief description of your company", rows: 3 })),
                react_1.default.createElement("button", { type: "submit", disabled: !companyName.trim(), className: "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" }, "Continue")))),
        step === 2 && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "text-center mb-6" },
                react_1.default.createElement(lucide_react_1.Upload, { className: "w-12 h-12 text-blue-500 mx-auto mb-3" }),
                react_1.default.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Upload FAQ Data"),
                react_1.default.createElement("p", { className: "text-gray-600" }, "Upload your FAQ information")),
            react_1.default.createElement("div", { className: "mb-6" },
                react_1.default.createElement("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center" },
                    react_1.default.createElement("div", { className: "flex items-center justify-center mb-4" }, uploadedFile ? (react_1.default.createElement(lucide_react_1.CheckCircle, { className: "w-8 h-8 text-green-500" })) : (react_1.default.createElement(lucide_react_1.FileText, { className: "w-8 h-8 text-gray-400" }))),
                    uploadedFile ? (react_1.default.createElement("div", null,
                        react_1.default.createElement("p", { className: "text-sm text-gray-600 mb-2" }, "File selected:"),
                        react_1.default.createElement("p", { className: "font-medium text-gray-900" }, uploadedFile.name))) : (react_1.default.createElement("div", null,
                        react_1.default.createElement("p", { className: "text-sm text-gray-600 mb-2" }, "Upload a PDF or Excel file containing your FAQ data"),
                        react_1.default.createElement("p", { className: "text-xs text-gray-500" }, "Supported formats: .pdf, .xlsx, .xls")))),
                react_1.default.createElement("input", { type: "file", accept: ".pdf,.xlsx,.xls", onChange: handleFileUpload, className: "hidden", id: "file-upload" }),
                react_1.default.createElement("label", { htmlFor: "file-upload", className: "block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors" }, "Choose File")),
            react_1.default.createElement("div", { className: "flex gap-3" },
                react_1.default.createElement("button", { onClick: function () { setStep(1); }, className: "flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors" }, "Back"),
                react_1.default.createElement("button", { onClick: handleFileProcess, disabled: !uploadedFile || isProcessing, className: "flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" }, isProcessing ? 'Processing...' : 'Process & Complete'))))));
}
//# sourceMappingURL=CompanySetup.js.map