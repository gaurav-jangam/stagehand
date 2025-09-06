"use client";

import { useState, useEffect } from 'react';

type ClientDateProps = {
  date: string;
  options: Intl.DateTimeFormatOptions;
  locale?: string;
};

export function ClientDate({ date, options, locale = 'en-US' }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleString(locale, options));
  }, [date, options, locale]);

  if (!formattedDate) {
    return null;
  }

  return <span>{formattedDate}</span>;
}

type ClientDateStringProps = {
    date: string;
    options: Intl.DateTimeFormatOptions;
    locale?: string;
  };

export function ClientDateString({ date, options, locale = 'en-US' }: ClientDateStringProps) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(date).toLocaleDateString(locale, options));
    }, [date, options, locale]);

    if (!formattedDate) {
        return null;
    }

    return <span>{formattedDate}</span>;
}
