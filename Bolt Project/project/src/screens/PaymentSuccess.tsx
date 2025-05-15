import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { usePayment } from '../context/PaymentContext';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const { paymentData, resetPayment } = usePayment();

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="mb-6 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
            
            <p className="text-gray-300 mb-6">
              Seu pagamento de <span className="font-bold text-white">{paymentData.amount}</span> para <span className="font-bold text-white">{paymentData.recipient}</span> foi processado com sucesso.
            </p>
            
            <div className="w-full bg-gray-700 h-px my-6"></div>
            
            <div className="mb-6 w-full">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Código da transação</span>
                <span className="text-white font-mono">PIX{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Data</span>
                <span className="text-white">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            
            <Button onClick={resetPayment} className="mt-4 px-8">
              Concluir
            </Button>
          </div>
        </Card>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Um comprovante foi enviado para o seu e-mail
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;