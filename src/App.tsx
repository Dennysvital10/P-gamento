import React from 'react';
import { PaymentProvider, usePayment } from './context/PaymentContext';
import PaymentSummary from './screens/PaymentSummary';
import PixPayment from './screens/PixPayment';
import PaymentSuccess from './screens/PaymentSuccess';
import './utils/animations.css';

const PaymentFlow: React.FC = () => {
  const { currentPage } = usePayment();
  
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      {currentPage === 'summary' && <PaymentSummary />}
      {currentPage === 'pix' && <PixPayment />}
      {currentPage === 'success' && <PaymentSuccess />}
    </div>
  );
};

function App() {
  return (
    <PaymentProvider>
      <PaymentFlow />
    </PaymentProvider>
  );
}

export default App;