import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisableButton = isDisabled || isLoading;

  const baseStyles = 'flex-row items-center justify-center rounded-xl';

  const variants = {
    primary: 'bg-primary-500 active:bg-primary-600 w-full',
    secondary: 'bg-secondary-300 active:bg-secondary-400 w-full',
    outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-50 w-full',
    link: 'w-full',
  };

  const sizes = {
    sm: 'py-2 px-4 rounded-lg',
    md: 'py-4 px-5 rounded-xl',
    lg: 'py-5 px-6 rounded-2xl',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-text-primary',
    outline: 'text-primary-500',
    link: 'text-primary-500',
  };

  const buttonStyles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    isDisableButton && 'opacity-60',
    className
  );

  return (
    <TouchableOpacity disabled={isDisableButton} className={buttonStyles} {...props}>
      {isLoading ? (
        <View className="flex-row items-center space-x-2">
          <ActivityIndicator color={variant === 'primary' ? 'white' : '#E76F5E'} size="small" />
          {loadingText && (
            <Text className={`font-nunito-bold text-base ${textStyles[variant]}`}>
              {loadingText}
            </Text>
          )}
        </View>
      ) : (
        <View className="flex-row items-center space-x-2">
          {leftIcon}
          <Text className={`font-nunito-bold text-center text-lg ${textStyles[variant]}`}>
            {children}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
