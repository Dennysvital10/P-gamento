import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import CountdownTimer from '../components/CountdownTimer';
import QRCode from '../components/QRCode';
import CopyField from '../components/CopyField';
import Feedback from '../components/Feedback';
import { usePayment } from '../context/PaymentContext';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';

const PixPayment: React.FC = () => {
  const { paymentData, goBack, confirmPayment, cancelPayment } = usePayment();
  const [showFeedback, setShowFeedback] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelScreen, setShowCancelScreen] = useState(false);

  const handleTimeout = () => {
    setPaymentStatus('error');
    setShowCancelScreen(true);
    setTimeout(() => {
      cancelPayment();
    }, 3000);
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://mandrill-cal-pagamento-production.up.railway.app/pagamento/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: parseFloat(paymentData.amount.replace('R$', '').replace(',', '.')),
          identificador: paymentData.identificador
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao verificar pagamento');
      }

      const data = await response.json();
      
      if (data.status === 'CONCLUIDO') {
        setPaymentStatus('success');
        setShowFeedback(true);
        setTimeout(() => {
          confirmPayment();
        }, 2000);
      } else {
        setPaymentStatus('error');
        setShowFeedback(true);
      }
    } catch (error) {
      setPaymentStatus('error');
      setShowFeedback(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (showCancelScreen) {
    return (
      <div className="min-h-screen bg-gray-900 py-6 px-4 flex flex-col items-center justify-center">
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/95 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mb-4 animate-scale-in">
            <X size={40} className="text-red-500" />
          </div>
          <p className="text-red-500 text-xl font-medium animate-fade-in-up">
            Tempo de pagamento expirado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Pagamento via PIX</h1>
          
          <div className="text-center mb-6">
            <span className="text-3xl font-bold text-white">{paymentData.amount}</span>
            <p className="text-gray-400 text-sm mt-1">Valor do pagamento</p>
          </div>
          
          <CountdownTimer 
            initialMinutes={10} 
            initialSeconds={0} 
            onTimeout={handleTimeout}
            className="mb-6" 
          />
          
          <div className="my-6">
            <QRCode 
              value={paymentData.amount}
              className="mb-8" 
            />
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Beneficiário</span>
                <span className="text-white font-medium">Mandrill Filmes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Valor confirmado</span>
                <span className="text-green-400 font-medium">{paymentData.amount}</span>
              </div>
            </div>
            
            <div className="my-8">
              <CopyField 
                label="Código PIX copia e cola" 
                value={paymentData.pixCode || ''} 
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outlined" 
              onClick={goBack}
              className="flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              disabled={isLoading}
              className={isLoading ? 'relative' : ''}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Confirmar Pagamento</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                <span className="flex items-center">
                  {paymentStatus === 'success' && <CheckCircle size={16} className="mr-2" />}
                  Confirmar Pagamento
                </span>
              )}
            </Button>
          </div>
        </Card>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Após realizar o pagamento, clique em "Confirmar Pagamento"
        </p>
      </div>
      
      <Feedback 
        type="success"
        message="Pagamento confirmado com sucesso!"
        visible={showFeedback && paymentStatus === 'success'}
        onClose={() => setShowFeedback(false)}
      />
      
      <Feedback 
        type="error"
        message="Pagamento não encontrado. Tente novamente."
        visible={showFeedback && paymentStatus === 'error'}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default PixPayment;