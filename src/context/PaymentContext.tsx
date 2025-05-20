import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  identificador?: string;
  uid?: string;
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
  setPaymentIdentificador: (id: string) => void;
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
    recipient: '',
    amount: '',
    service: '',
    location: '',
    startDate: '',
    duration: '',
    status: 'pending',
  };

  const [paymentData, setPaymentData] = useState<PaymentData>(defaultPaymentData);
  const [currentPage, setCurrentPage] = useState<PaymentPage>('summary');

  // Load payment data from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPaymentData: Partial<PaymentData> = {
      recipient: params.get('recipient') || '',
      amount: params.get('amount') || '',
      service: params.get('service') || '',
      location: params.get('location') || '',
      startDate: params.get('startDate') || '',
      duration: params.get('duration') || '',
      uid: params.get('uid') || '',
      status: 'pending',
    };

    console.log('URL Payment Data:', urlPaymentData);
    setPaymentData(prevData => ({ ...prevData, ...urlPaymentData }));
  }, []);

  const setPaymentIdentificador = (id: string) => {
    setPaymentData(prev => ({ ...prev, identificador: id }));
  };

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
    setPaymentIdentificador,
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