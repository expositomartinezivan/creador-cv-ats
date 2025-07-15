
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface AtsTooltipProps {
  text: string;
}

const AtsTooltip: React.FC<AtsTooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center ml-2">
      <HelpCircle 
        size={16} 
        className="text-gray-400 cursor-pointer hover:text-blue-500 shrink-0"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
      {visible && (
        <div className="absolute left-full bottom-0 ml-3 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg z-10 transition-opacity duration-300">
          <p className="font-bold mb-1">Consejo ATS:</p>
          {text}
        </div>
      )}
    </div>
  );
};

export default AtsTooltip;
