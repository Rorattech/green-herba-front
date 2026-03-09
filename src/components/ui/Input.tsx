"use client";

import { useState, useEffect, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata dígitos segundo a máscara (9 = dígito). Ex: "(99) 99999-9999" */
function formatWithMask(digits: string, mask: string): string {
  let i = 0;
  return mask.replace(/9/g, () => digits[i++] ?? '');
}

function getDigits(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

/** Retorna a posição no texto mascarado após o n-ésimo dígito (n = 0,1,2,...). */
function positionAfterDigitCount(formatted: string, digitCount: number): number {
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++;
    if (count === digitCount) return i + 1;
  }
  return formatted.length;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  colorTheme?: 'light' | 'dark';
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  /** Quando true e type="password", mostra ícone de olho que alterna entre mostrar/ocultar senha */
  showPasswordToggle?: boolean;
  /** Máscara (ex: "(99) 99999-9999" para celular, "999.999.999-99" para CPF). Aceita apenas dígitos nos lugares do 9. */
  mask?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  colorTheme = 'light',
  iconRight,
  iconLeft,
  className,
  id,
  type: typeProp,
  showPasswordToggle = false,
  mask,
  value: valueProp,
  defaultValue: defaultValueProp,
  onChange,
  ...props
}, ref) => {
  const isPassword = typeProp === 'password';
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [maskedValue, setMaskedValue] = useState<string>(() => {
    if (!mask) return '';
    const initial = valueProp != null ? String(valueProp) : (defaultValueProp != null ? String(defaultValueProp) : '');
    return formatWithMask(getDigits(initial), mask);
  });
  const isControlled = valueProp !== undefined && valueProp !== null;

  useEffect(() => {
    if (mask && isControlled) {
      setMaskedValue(formatWithMask(getDigits(String(valueProp)), mask));
    }
  }, [mask, isControlled, valueProp]);

  const type = isPassword && showPasswordToggle ? (passwordVisible ? 'text' : 'password') : typeProp;

  const inputVariants = {
    light: "bg-gray-100 border-gray-200 text-green-800 placeholder:text-gray-400 focus:border-green-700",
    dark: "bg-green-800/20 border-green-600/30 text-green-100 placeholder:text-green-400/50 focus:border-green-500",
  };

  const showToggle = isPassword && showPasswordToggle;
  const rightIcon = showToggle ? (
    <button
      type="button"
      tabIndex={-1}
      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 cursor-pointer"
      onClick={() => setPasswordVisible((v) => !v)}
      aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
    >
      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  ) : iconRight;

  const inputClasses = cn(
    "w-full px-6 py-4 rounded-full text-body-m font-medium outline-none border transition-all duration-200",
    inputVariants[colorTheme],
    error ? "border-error" : "",
    iconLeft && "pl-12",
    (iconRight || showToggle) && "pr-12",
    className
  );

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = getDigits(e.target.value);
    const maxLen = (mask ?? '').replace(/\D/g, '').length;
    const truncated = digits.slice(0, maxLen);
    const formatted = formatWithMask(truncated, mask!);
    setMaskedValue(formatted);
    const synthetic = { ...e, target: { ...e.target, value: formatted } };
    onChange?.(synthetic);
  };

  const handleMaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const pos = el.selectionStart ?? 0;
    const len = maskedValue.length;

    if (e.key === 'Backspace' && pos > 0) {
      const charBefore = maskedValue[pos - 1];
      if (!/\d/.test(charBefore)) {
        e.preventDefault();
        const digits = getDigits(maskedValue);
        const digitIndex = getDigits(maskedValue.slice(0, pos)).length;
        if (digitIndex === 0) return;
        const newDigits = digits.slice(0, digitIndex - 1) + digits.slice(digitIndex);
        const formatted = formatWithMask(newDigits, mask!);
        setMaskedValue(formatted);
        onChange?.({ ...e, target: { ...el, value: formatted } } as React.ChangeEvent<HTMLInputElement>);
        const newPos = positionAfterDigitCount(formatted, digitIndex - 1);
        requestAnimationFrame(() => el.setSelectionRange(newPos, newPos));
      }
      return;
    }

    if (e.key === 'Delete' && pos < len) {
      const charAfter = maskedValue[pos];
      if (!/\d/.test(charAfter)) {
        e.preventDefault();
        const digits = getDigits(maskedValue);
        const digitIndex = getDigits(maskedValue.slice(0, pos)).length;
        if (digitIndex >= digits.length) return;
        const newDigits = digits.slice(0, digitIndex) + digits.slice(digitIndex + 1);
        const formatted = formatWithMask(newDigits, mask!);
        setMaskedValue(formatted);
        onChange?.({ ...e, target: { ...el, value: formatted } } as React.ChangeEvent<HTMLInputElement>);
        const newPos = positionAfterDigitCount(formatted, digitIndex);
        requestAnimationFrame(() => el.setSelectionRange(newPos, newPos));
      }
    }
  };

  const inputEl = mask ? (
    <input
      {...props}
      id={id}
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="off"
      className={inputClasses}
      value={maskedValue}
      onChange={handleMaskChange}
      onKeyDown={(e) => {
        handleMaskKeyDown(e);
        props.onKeyDown?.(e);
      }}
    />
  ) : (
    <input
      id={id}
      ref={ref}
      type={type}
      className={inputClasses}
      value={valueProp}
      defaultValue={defaultValueProp}
      onChange={onChange}
      {...props}
    />
  );

  return (
    <div className="relative w-full group">
      {label && (
        <label htmlFor={id} className={cn(
          "block mb-1.5 text-body-s font-medium uppercase tracking-wider",
          colorTheme === 'light' ? "text-gray-400" : "text-green-400/70"
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {iconLeft}
          </div>
        )}
        {inputEl}
        {rightIcon && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";