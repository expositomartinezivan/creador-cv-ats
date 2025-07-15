
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { generateAtsFriendlyText } from '../services/geminiService';

interface AiSuggestionButtonProps {
  baseText: string;
  promptType: 'summary' | 'experience';
  onSuggestion: (suggestion: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const AiSuggestionButton: React.FC<AiSuggestionButtonProps> = ({ baseText, promptType, onSuggestion, onLoadingChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrompt = () => {
    if (promptType === 'summary') {
      return `Rewrite the following professional summary to be more impactful and ATS-friendly. The current summary is: "${baseText}"`;
    }
    return `Rewrite the following job experience description to be more results-oriented and ATS-friendly, using action verbs. The current description is: "${baseText}"`;
  };

  const handleClick = async () => {
    setIsLoading(true);
    onLoadingChange(true);
    setError(null);
    try {
      const prompt = getPrompt();
      const suggestion = await generateAtsFriendlyText(prompt);
      onSuggestion(suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  if (!process.env.API_KEY) {
    return null; // Don't render the button if no API key is available
  }

  return (
    <div className="w-full mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center text-xs bg-blue-50 text-blue-700 font-semibold py-2 px-3 rounded-md hover:bg-blue-100 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mejorando...
          </>
        ) : (
          <>
            <Sparkles size={14} className="mr-2" />
            Mejorar con IA
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AiSuggestionButton;
