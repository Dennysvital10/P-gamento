import React, { createContext, useContext, useState, ReactNode } from 'react';

// Payment data types
type PaymentData = {
  recipient: string;
  amount: string;
  service: string;
  location: string;
  startDate: string;
  duration: string;
  pixCode?: string;
  status: 'pending' | 'cancelled' | 'completed';
};

// Payment page states
type PaymentPage = 'summary' | 'pix' | 'success';

// Context type
type PaymentContextType = {
  paymentData: PaymentData;
  currentPage: PaymentPage;
  proceedToPayment: () => void;
  confirmPayment: () => void;
  cancelPayment: () => void;
  goBack: () => void;
  resetPayment: () => void;
};

// Create context
export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Provider component
type PaymentProviderProps = {
  children: ReactNode;
};

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  // Default payment data
  const defaultPaymentData: PaymentData = {
    recipient: 'Mandrill Filmes',
    amount: 'R$945,00',
    service: 'Cobertura Digital',
    location: 'São Paulo, SP',
    startDate: '15/10/2023 - 14:30',
    duration: '8',
    status: 'pending',
  };

  const [paymentData, setPaymentData] = useState<PaymentData>(defaultPaymentData);
  const [currentPage, setCurrentPage] = useState<PaymentPage>('summary');

  // Navigation functions
  const proceedToPayment = () => {
    setCurrentPage('pix');
  };

  const confirmPayment = () => {
    setPaymentData(prev => ({ ...prev, status: 'completed' }));
    setCurrentPage('success');
  };

  const cancelPayment = () => {
    setPaymentData(prev => ({ ...prev, status: 'cancelled' }));
    resetPayment();
  };

  const goBack = () => {
    setCurrentPage('summary');
  };

  const resetPayment = () => {
    setPaymentData(defaultPaymentData);
    setCurrentPage('summary');
  };

  // Context value
  const value = {
    paymentData,
    currentPage,
    proceedToPayment,
    confirmPayment,
    cancelPayment,
    goBack,
    resetPayment,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

// Custom hook for using the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};