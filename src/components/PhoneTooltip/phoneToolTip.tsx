import React from 'react';
import './PhoneTooltip.scss';

interface PhoneTooltipProps {
  phoneNumber: string;
  children: React.ReactNode;
}

const PhoneTooltip: React.FC<PhoneTooltipProps> = ({ phoneNumber, children }) => {
  return (
    <span className="phone-tooltip-wrapper">
      {children}
      <span className="phone-tooltip">{phoneNumber}</span>
    </span>
  );
};

export default PhoneTooltip;