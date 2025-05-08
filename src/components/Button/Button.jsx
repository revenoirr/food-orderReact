import React from 'react';
import './Button.scss';

/**
 *
 * @param {string} className
 * @param {string} variant
 * @param {boolean} active
 * @param {function} onClick
 * @param {React.ReactNode} children
 * @param {Object} rest
 */
const Button = ({ 
  className = '',
  variant = 'primary',
  active = false,
  onClick,
  children,
  ...restProps
}) => {
  const getClassNames = () => {
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
  };

  const buttonProps = { ...restProps };
  
  return (
    <button 
      className={getClassNames()}
      onClick={onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;