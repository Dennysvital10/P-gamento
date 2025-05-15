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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [value]);

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Erro ao gerar QR Code. Por favor, tente novamente.
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