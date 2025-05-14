import React from 'react';
import './Button.scss';

/**
 * Button component with various styles
 * 
 * @param {string} className - Additional CSS class names
 * @param {string} variant - Button style variant ('primary', 'tab', 'outlined', 'see-more', 'small')
 * @param {boolean} active - Whether the button is in active state (for tabs)
 * @param {function} onClick - Click handler function
 * @param {React.ReactNode} children - Button content
 */
const Button = ({ 
  className = '',
  variant = 'primary',
  active = false,
  onClick,
  children,
  ...restProps
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    tab: 'menu-tab',
    outlined: 'btn-outlined',
    'see-more': 'see-more-btn',
    small: 'btn-small',
    secondary: 'btn-secondary'
  };
  
  const getClassNames = () => {
    const classes = ['btn'];
    
    if (variantClasses[variant]) {
      classes.push(variantClasses[variant]);
    }
    
    if (variant === 'tab' && active) {
      classes.push('active');
    }

    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };
  
  return (
    <button 
      className={getClassNames()}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;