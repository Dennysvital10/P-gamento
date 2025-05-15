import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CopyFieldProps = {
  value: string;
  label?: string;
  className?: string;
};

const CopyField: React.FC<CopyFieldProps> = ({ value, label, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <div className="flex">
        <div className="grow bg-gray-700 rounded-l-lg px-4 py-3 text-gray-200 overflow-hidden text-ellipsis font-mono">
          {value}
        </div>
        <button
          onClick={handleCopy}
          className="bg-gray-600 hover:bg-gray-500 transition-colors duration-200 rounded-r-lg px-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Copiar código"
        >
          {copied ? (
            <div className="flex items-center text-green-400">
              <Check size={18} className="mr-1" />
              <span className="text-sm">Copiado</span>
            </div>
          ) : (
            <div className="flex items-center text-white">
              <Copy size={18} className="mr-1" />
              <span className="text-sm">Copiar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyField;