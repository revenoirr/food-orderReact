import React, { Component } from 'react';
import './Button.scss';

/**
 *
 * @param {string} 
 * @param {string} 
 * @param {boolean} 
 * @param {function} 
 * @param {React.ReactNode} 
 * @param {Object} 
 */
class Button extends Component {
  getClassNames() {
    const { className, variant, active } = this.props;
    let classes = 'btn';
    
    if (variant === 'primary') {
      classes += ' btn-primary';
    } else if (variant === 'tab') {
      classes += ' menu-tab';
      if (active) classes += ' active';
    } else if (variant === 'outlined') {
      classes += ' btn-outlined';
    } else if (variant === 'see-more') {
      classes += ' see-more-btn';
    }
    
    if (className) classes += ` ${className}`;
    
    return classes;
  }

  render() {
    const { onClick, children, ...restProps } = this.props;
    
    const buttonProps = { ...restProps };
    delete buttonProps.className;
    delete buttonProps.variant;
    delete buttonProps.active;

    return (
      <button 
        className={this.getClassNames()}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}

Button.defaultProps = {
  className: '',
  variant: 'primary',
  active: false
};

export default Button;