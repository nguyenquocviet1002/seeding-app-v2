import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type) => {
    const toast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
}
