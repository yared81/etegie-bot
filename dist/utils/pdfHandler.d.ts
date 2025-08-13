export interface PDFDocument {
    id: string;
    name: string;
    content: string;
    uploadedAt: Date;
    size: number;
}
export declare class PDFHandler {
    private static STORAGE_KEY;
    static uploadPDF(file: File): Promise<PDFDocument>;
    private static extractTextFromPDF;
    private static saveToLocalStorage;
    static getAllDocuments(): PDFDocument[];
    static searchDocuments(query: string): PDFDocument[];
    static deleteDocument(id: string): boolean;
    static clearAllDocuments(): void;
    private static generateId;
}
//# sourceMappingURL=pdfHandler.d.ts.map