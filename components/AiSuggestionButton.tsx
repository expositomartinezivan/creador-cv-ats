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
    return `Rewrite the following job experience description to be more results-oriented and ATS-friendly, using action verbs and bullet points. The current description is: "${baseText}"`;
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
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000); // Hide error after 3 seconds
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  if (!process.env.API_KEY) {
    return null; // Don't render the button if no API key is available
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="absolute bottom-2.5 right-2 flex items-center justify-center h-7 w-7 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        title="Mejorar con IA"
        aria-label="Mejorar texto con Inteligencia Artificial"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Sparkles size={14} />
        )}
      </button>
      {error && <div role="alert" className="absolute -bottom-6 right-0 text-red-500 text-xs mt-1 bg-white p-1 rounded shadow-md">{error}</div>}
    </>
  );
};

export default AiSuggestionButton;
