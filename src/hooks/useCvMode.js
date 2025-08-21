import { useState, useRef } from 'react';
import { INITIAL_CV_DATA } from '../data/initialCvData.js';
import { CV_DEV } from '../data/cvData.js';

export function useCvMode() {
  const [mode, setMode] = useState('data');
  const [cvData, setCvData] = useState(INITIAL_CV_DATA);
  const originalDataRef = useRef(JSON.parse(JSON.stringify(INITIAL_CV_DATA)));

  const toggleMode = () => {
    setMode(m => {
      if (m === 'data') {
        originalDataRef.current = JSON.parse(JSON.stringify(cvData));
        setCvData(JSON.parse(JSON.stringify(CV_DEV)));
        return 'dev';
      } else {
        setCvData(JSON.parse(JSON.stringify(originalDataRef.current)));
        return 'data';
      }
    });
  };

  return { mode, cvData, setCvData, toggleMode };
}
