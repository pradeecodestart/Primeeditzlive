'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  title?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  title = 'Enter OTP Code',
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const otpString = otp.join('');
    onChange(otpString);
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  }, [otp, length, onChange, onComplete]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);

    if (!/^\d*$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(length - newOtp.length).fill('')]);

    // Focus last filled input
    setTimeout(() => {
      inputRefs.current[Math.min(newOtp.length, length - 1)]?.focus();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div className="flex gap-2 justify-center">
        {Array(length)
          .fill(null)
          .map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            />
          ))}
      </div>
    </div>
  );
}
