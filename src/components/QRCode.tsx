import React from 'react';
import { useEffect, useState } from 'react';

type QRCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

const QRCode: React.FC<QRCodeProps> = ({ value, size = 200, className = '' }) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        
        // Check if Supabase environment variables are available
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase configuration is missing. Please connect to Supabase first.');
        }

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pix-qrcode`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            valor: parseFloat(value.replace('R$', '').replace(',', '.')),
            chavePix: "test@example.com",
            descricao: "Pagamento Mandrill Filmes",
            identificador: crypto.randomUUID(),
            nomeBeneficiario: "Mandrill Filmes",
            cidadeBeneficiario: "SAO PAULO"
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate QR code');
        }

        const data = await response.json();
        setQrCodeData(data.qrCodeImage);
        
        // Set the PIX code in the parent component
        if (data.qrCodeText) {
          // You can implement this later if needed
          // onPixCodeGenerated(data.qrCodeText);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('QR Code generation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [value]);

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-900/20 rounded-lg">
        <p className="font-medium mb-2">Erro ao gerar QR Code</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="mb-4 font-medium text-gray-300">Escaneie o QR Code</div>
      <div 
        className="bg-white p-4 rounded-lg shadow-lg inline-flex items-center justify-center" 
        style={{ width: size, height: size }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          qrCodeData && (
            <img 
              src={qrCodeData} 
              alt="QR Code PIX" 
              className="w-full h-full"
            />
          )
        )}
      </div>
      <div className="mt-3 text-sm text-gray-400">
        PIX para: Mandrill Filmes
      </div>
    </div>
  );
};

export default QRCode;