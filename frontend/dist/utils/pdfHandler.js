export class PDFHandler {
    static async uploadPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target?.result;
                    const text = await this.extractTextFromPDF(arrayBuffer);
                    const document = {
                        id: this.generateId(),
                        name: file.name,
                        content: text,
                        uploadedAt: new Date(),
                        size: file.size
                    };
                    this.saveToLocalStorage(document);
                    resolve(document);
                }
                catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }
    static async extractTextFromPDF(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        let text = '';
        for (let i = 0; i < uint8Array.length; i++) {
            if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
                text += String.fromCharCode(uint8Array[i]);
            }
        }
        text = text.replace(/[^\w\s.,!?-]/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length < 50) {
            text = `PDF Document: ${new Date().toLocaleDateString()}. This document has been uploaded and processed. The content will be used to answer questions about your company.`;
        }
        return text;
    }
    static saveToLocalStorage(document) {
        try {
            const existing = this.getAllDocuments();
            existing.push(document);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
        }
        catch (error) {
            console.error('Failed to save to local storage:', error);
        }
    }
    static getAllDocuments() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const documents = JSON.parse(stored);
                return documents.map((doc) => ({
                    ...doc,
                    uploadedAt: new Date(doc.uploadedAt)
                }));
            }
        }
        catch (error) {
            console.error('Failed to read from local storage:', error);
        }
        return [];
    }
    static searchDocuments(query) {
        const documents = this.getAllDocuments();
        const lowerQuery = query.toLowerCase();
        return documents.filter(doc => doc.name.toLowerCase().includes(lowerQuery) ||
            doc.content.toLowerCase().includes(lowerQuery));
    }
    static deleteDocument(id) {
        try {
            const documents = this.getAllDocuments().filter(doc => doc.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
            return true;
        }
        catch (error) {
            console.error('Failed to delete document:', error);
            return false;
        }
    }
    static clearAllDocuments() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        catch (error) {
            console.error('Failed to clear documents:', error);
        }
    }
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
PDFHandler.STORAGE_KEY = 'etegie-pdf-documents';
//# sourceMappingURL=pdfHandler.js.map