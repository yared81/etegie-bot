export interface PDFDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  size: number;
}

export class PDFHandler {
  private static STORAGE_KEY = 'etegie-pdf-documents';

  // Upload and process PDF file
  static async uploadPDF(file: File): Promise<PDFDocument> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const text = await this.extractTextFromPDF(arrayBuffer);
          
          const document: PDFDocument = {
            id: this.generateId(),
            name: file.name,
            content: text,
            uploadedAt: new Date(),
            size: file.size
          };

          // Save to local storage
          this.saveToLocalStorage(document);
          
          resolve(document);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Extract text from PDF (simplified - in real app you'd use a PDF library)
  private static async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    // This is a simplified text extraction
    // In a real application, you'd use a library like pdf.js
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction (basic implementation)
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
        text += String.fromCharCode(uint8Array[i]);
      }
    }
    
    // Clean up the text
    text = text.replace(/[^\w\s.,!?-]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // If no readable text found, provide a fallback
    if (text.length < 50) {
      text = `PDF Document: ${new Date().toLocaleDateString()}. This document has been uploaded and processed. The content will be used to answer questions about your company.`;
    }
    
    return text;
  }

  // Save document to local storage
  private static saveToLocalStorage(document: PDFDocument): void {
    try {
      const existing = this.getAllDocuments();
      existing.push(document);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save to local storage:', error);
    }
  }

  // Get all documents from local storage
  static getAllDocuments(): PDFDocument[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const documents = JSON.parse(stored);
        return documents.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to read from local storage:', error);
    }
    return [];
  }

  // Search documents for relevant content
  static searchDocuments(query: string): PDFDocument[] {
    const documents = this.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery)
    );
  }

  // Delete document
  static deleteDocument(id: string): boolean {
    try {
      const documents = this.getAllDocuments().filter(doc => doc.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }

  // Clear all documents
  static clearAllDocuments(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear documents:', error);
    }
  }

  // Generate unique ID
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
