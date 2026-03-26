'use client';

import { Chatbot, CompanySetup, PDFHandler } from 'etegie-bot';
import { MessageCircle, Upload, Trash2, Eye, FileText, X, CheckCircle, Settings, Users, Database, Zap, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Chatbot to avoid SSR issues
const DynamicChatbot = dynamic(() => import('etegie-bot').then(mod => ({ default: mod.Chatbot })), {
  ssr: false
}) as any;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('demo');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load existing documents on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && PDFHandler) {
      try {
        const documents = PDFHandler.getAllDocuments();
        setUploadedFiles(documents);
      } catch (error) {
        console.log('No existing documents found');
      }
    }
  }, []);

  // Handle dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !PDFHandler) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf') {
          setUploadProgress((i / files.length) * 100);
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const document = await PDFHandler.uploadPDF(file);
          setUploadedFiles(prev => [...prev, document]);
        }
      }
      setUploadProgress(100);
      
      // Reset progress after showing completion
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = (id: string) => {
    if (PDFHandler) {
      PDFHandler.deleteDocument(id);
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
    }
  };

  const handleViewFile = (file: any) => {
    alert(`Document: ${file.name}\n\nContent Preview:\n${file.content.substring(0, 200)}...`);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all uploaded documents?')) {
      if (PDFHandler) {
        PDFHandler.clearAllDocuments();
        setUploadedFiles([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <div className="w-7 h-7 text-white">
                  <MessageCircle size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Etegie Bot
                </h1>
                <p className="text-gray-600 text-sm">Professional AI Chatbot System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                v1.1.0
              </span>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <div className="w-5 h-5 text-yellow-500">
                    <Sun size={20} />
                  </div>
                ) : (
                  <div className="w-5 h-5 text-gray-600">
                    <Moon size={20} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'demo', label: 'Live Demo', icon: MessageCircle },
              { id: 'setup', label: 'Company Setup', icon: Settings },
              { id: 'features', label: 'Features', icon: Zap }
            ].map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <div className="w-5 h-5">
                    {tab.id === 'demo' && <MessageCircle size={20} />}
                    {tab.id === 'setup' && <Settings size={20} />}
                    {tab.id === 'features' && <Zap size={20} />}
                  </div>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'demo' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Experience Etegie Bot in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how our intelligent chatbot handles customer inquiries, provides instant support, 
                and learns from your company's knowledge base.
              </p>
            </div>

            {/* Demo Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: CheckCircle,
                  title: 'Smart Conversations',
                  description: 'Natural language processing with context awareness'
                },
                {
                  icon: Upload,
                  title: 'Knowledge Base',
                  description: 'Upload PDFs and documents for instant answers'
                },
                {
                  icon: X,
                  title: 'Real-time Responses',
                  description: 'Lightning-fast replies with typing indicators'
                }
              ].map((feature, index) => (
                <div key={index} className="demo-card p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    {index === 0 && (
                      <div className="w-6 h-6 text-white">
                        <CheckCircle size={24} />
                      </div>
                    )}
                    {index === 1 && (
                      <div className="w-6 h-6 text-white">
                        <Upload size={24} />
                      </div>
                    )}
                    {index === 2 && (
                      <div className="w-6 h-6 text-white">
                        <X size={24} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Test Questions */}
            <div className="demo-card p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Try These Test Questions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "What is Etegie Bot and how does it work?",
                  "How do I install and configure Etegie Bot?",
                  "What features does the chatbot system offer?",
                  "Can I customize the bot's appearance and behavior?",
                  "How does the PDF upload and knowledge base work?",
                  "What makes Etegie Bot different from other solutions?"
                ].map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 text-sm">"{question}"</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-6">
                Click the chat button in the bottom right corner to start testing!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Company Setup & Configuration
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Configure your company profile, upload knowledge base documents, and customize 
                the chatbot to match your brand and requirements.
              </p>
            </div>

            {/* Company Profile */}
            <div className="demo-card p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Company Profile</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    className="demo-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select className="demo-input">
                    <option>Select industry</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Retail</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Knowledge Base Upload */}
            <div className="demo-card p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Knowledge Base</h3>
               
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                  <Upload size={48} />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Documents</h4>
                <p className="text-gray-600 mb-4">
                  Upload your company's FAQ documents, manuals, or any PDF files to build your knowledge base.
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="pdf-upload"
                  className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="w-4 h-4 mr-2">
                    <FileText size={16} />
                  </div>
                  {isUploading ? 'Uploading...' : 'Choose PDF Files'}
                </label>
                
                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{Math.round(uploadProgress)}% Complete</p>
                  </div>
                )}
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Uploaded Documents</h4>
                    <button
                      onClick={handleClearAll}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-blue-500">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • 
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewFile(file)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View content"
                            >
                              <div className="w-4 h-4">
                                <Eye size={16} />
                              </div>
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete file"
                            >
                              <div className="w-4 h-4">
                                <Trash2 size={16} />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bot Customization */}
            <div className="demo-card p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Bot Customization</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Company Assistant"
                    className="demo-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                  <input
                    type="text"
                    placeholder="e.g., Hello! How can I help you today?"
                    className="demo-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select className="demo-input">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features & Capabilities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover what makes Etegie Bot the perfect solution for your customer support needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Intelligent Responses',
                  description: 'Advanced NLP that understands context and provides accurate, helpful responses based on your knowledge base.',
                  features: ['Context awareness', 'Multi-language support', 'Sentiment analysis', 'Intent recognition']
                },
                {
                  title: 'Easy Integration',
                  description: 'Simple setup process that works with any Next.js application and can be customized to match your brand.',
                  features: ['One-line installation', 'Customizable UI', 'Responsive design', 'Theme support']
                },
                {
                  title: 'Knowledge Management',
                  description: 'Upload and manage your company\'s knowledge base with support for PDF documents and structured data.',
                  features: ['PDF upload support', 'FAQ management', 'Content organization', 'Auto-updates']
                },
                {
                  title: 'Analytics & Insights',
                  description: 'Track conversation metrics, user satisfaction, and identify areas for improvement.',
                  features: ['Conversation logs', 'User feedback', 'Performance metrics', 'Usage analytics']
                }
              ].map((feature, index) => (
                <div key={index} className="demo-card p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Chatbot */}
      <DynamicChatbot 
        apiUrl="/api/chat"
        companyId="demo-company-123"
        botName="Etegie Assistant"
        welcomeMessage="Hello! I'm your Etegie assistant. I can help you with questions about our chatbot system, installation, features, and more. How can I assist you today?"
        showAvatars={true}
        showTimestamps={true}
        theme="light"
        primaryColor="#3b82f6"
        enablePDFUpload={true}
        enableLocalStorage={true}
        style={{
          '--chatbot-width': '400px',
          '--chatbot-height': '600px'
        } as React.CSSProperties}
      />
    </div>
  );
}
