import { useEffect, useRef } from 'react';
import modalStyle from './Modal.module.scss';

const Modal = ({ title, hide, children, size }) => {
  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        hide();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, hide]);

  return (
    <>
      <div className={modalStyle['modal']}>
        <div className={`${modalStyle['modal__box']} ${modalStyle[size]}`}>
          <div className={modalStyle['modal__content']} ref={ref}>
            <button className={modalStyle['modal__close']} onClick={hide}>
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
            </button>
            <h4 className={modalStyle['modal__head']}>{title}</h4>
            <div className={modalStyle['modal__line']}></div>
            <div className={modalStyle['modal__around']}>
              <div className={modalStyle['modal__body']}>{children}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={modalStyle['modal__bg']}></div>
    </>
  );
};

export default Modal;
