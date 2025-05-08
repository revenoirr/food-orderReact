import React from 'react';
import './../PhoneToolTip/PhoneTooltip.scss';

const PhoneTooltip = ({ phoneNumber, children }) => {
  return (
    <span className="phone-tooltip-wrapper">
      {children}
      <span className="phone-tooltip">{phoneNumber}</span>
    </span>
  );
};

export default PhoneTooltip;