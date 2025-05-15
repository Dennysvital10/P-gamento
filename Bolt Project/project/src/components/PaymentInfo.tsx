import React from 'react';

type PaymentInfoProps = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

const PaymentInfo: React.FC<PaymentInfoProps> = ({ label, value, className = '' }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <span className="text-gray-400 text-sm mb-1">{label}</span>
      <span className="text-white text-base font-medium">{value}</span>
    </div>
  );
};

export default PaymentInfo;