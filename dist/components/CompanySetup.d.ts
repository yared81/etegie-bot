import React from 'react';
interface CompanySetupData {
    companyName: string;
    companyDescription: string;
    fileName: string;
}
interface CompanySetupProps {
    onSetupComplete?: (data: CompanySetupData) => void;
}
export declare function CompanySetup({ onSetupComplete }: CompanySetupProps): React.JSX.Element;
export {};
//# sourceMappingURL=CompanySetup.d.ts.map