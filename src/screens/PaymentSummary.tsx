import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PaymentInfo from '../components/PaymentInfo';
import { usePayment } from '../context/PaymentContext';
import { X, ArrowLeft } from 'lucide-react';

const PaymentSummary: React.FC = () => {
  const { paymentData, proceedToPayment, cancelPayment } = usePayment();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = () => {
    setShowCancelModal(true);
    cancelPayment();
    setTimeout(() => {
      setShowCancelModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center justify-center">
      {showCancelModal ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/95 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mb-4 animate-scale-in">
            <X size={40} className="text-red-500" />
          </div>
          <p className="text-red-500 text-xl font-medium animate-fade-in-up">
            Agendamento Cancelado
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <Card className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">Resumo do Pagamento</h1>
            
            <div className="mb-6">
              <PaymentInfo label="Destinatário" value={paymentData.recipient} />
              <PaymentInfo 
                label="Valor" 
                value={<span className="text-xl font-bold text-white">{paymentData.amount}</span>} 
              />
              <PaymentInfo label="Serviço" value={paymentData.service} />
              <PaymentInfo label="Local" value={paymentData.location} />
              <PaymentInfo label="Data de Início" value={paymentData.startDate} />
              <PaymentInfo label="Duração" value={`${paymentData.duration}h`} />
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button onClick={proceedToPayment}>
                Confirmar
              </Button>
            </div>
          </Card>
          
          <p className="text-gray-400 text-sm text-center mt-4">
            Ao confirmar, você será redirecionado para a tela de pagamento PIX
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;