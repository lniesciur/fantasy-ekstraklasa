import React from 'react';

interface FieldErrorMessageProps {
  error?: string;
  id?: string;
}

export default function FieldErrorMessage({ error, id }: FieldErrorMessageProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      className="mt-1 text-sm text-red-300"
      role="alert"
    >
      {error}
    </p>
  );
}
