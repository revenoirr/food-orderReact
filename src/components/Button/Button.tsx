import React, { ButtonHTMLAttributes } from 'react';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'primary' | 'tab' | 'outlined' | 'see-more' | 'small' | 'secondary';
  active?: boolean;
  children: React.ReactNode;
}


const Button: React.FC<ButtonProps> = ({ 
  className = '',
  variant = 'primary',
  active = false,
  onClick,
  children,
  ...restProps
}) => {
  const variantClasses: Record<string, string> = {
    primary: 'btn-primary',
    tab: 'menu-tab',
    outlined: 'btn-outlined',
    'see-more': 'see-more-btn',
    small: 'btn-small',
    secondary: 'btn-secondary'
  };
  
  const getClassNames = (): string => {
    const classes: string[] = ['btn'];
    
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