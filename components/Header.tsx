
import React from 'react';
import { Download, FileText } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  isGenerating: boolean;
  scriptsLoaded: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDownload, isGenerating, scriptsLoaded }) => {
  const isDisabled = isGenerating || !scriptsLoaded;
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <FileText className="text-blue-600" size={28} />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 ml-2">Creador de CV <span className="text-blue-600">ATS-Friendly</span></h1>
          </div>
          <button
            onClick={onDownload}
            disabled={isDisabled}
            className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isDisabled ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isGenerating ? 'Generando...' : 'Cargando...'}
              </>
            ) : (
              <>
                <Download size={20} className="mr-2" />
                Descargar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
