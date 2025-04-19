import React, { Component } from 'react';
import './../PhoneToolTip/PhoneTooltip.scss';

class PhoneTooltip extends Component {
  render() {
    const { phoneNumber, children } = this.props;
    
    return (
      <span className="phone-tooltip-wrapper">
        {children}
        <span className="phone-tooltip">{phoneNumber}</span>
      </span>
    );
  }
}

export default PhoneTooltip;