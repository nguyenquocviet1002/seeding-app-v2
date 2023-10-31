import { useState } from 'react';

export function useModal() {
  const [isShowing, setIsShowing] = useState(false);
  const [cpn, setCpn] = useState(null);

  function toggle(cpn) {
    setIsShowing(!isShowing);
    setCpn(cpn);
  }

  return {
    isShowing,
    cpn,
    toggle,
  };
}
