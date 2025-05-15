import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type FeedbackType = 'success' | 'error';

type FeedbackProps = {
  message: string;
  type: FeedbackType;
  visible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
};

const Feedback: React.FC<FeedbackProps> = ({
  message,
  type,
  visible,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-800' : 'bg-red-800';
  const textColor = 'text-white';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg p-4 pr-12 ${bgColor} ${textColor} z-50 min-w-72 max-w-md animate-fade-in`}>
      <div className="flex items-center">
        <Icon size={24} className={`mr-3 ${iconColor}`} />
        <p>{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose && onClose();
        }}
        className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Feedback;