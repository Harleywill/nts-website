'use client';

import { useState } from 'react';

interface FormFieldHelpProps {
  label: string;
  required?: boolean;
  hint?: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FormFieldHelp({ label, required, hint, helpText, children }: FormFieldHelpProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-brand-green-600 hover:text-brand-green-700 font-medium"
            title={helpText}
          >
            ?
          </button>
        )}
      </div>
      
      {hint && (
        <p className="text-xs text-gray-500 mb-2">
          {hint}
        </p>
      )}
      
      {showHelp && helpText && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          {helpText}
        </div>
      )}
      
      {children}
    </div>
  );
}
