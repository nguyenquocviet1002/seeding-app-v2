import ReactDOM from 'react-dom';
import { useEffect, useRef } from 'react';
import modalConfirmStyles from './ModalConfirm.module.scss';

const ModalConfirm = ({ isShow, hide, element, children, event }) => {
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

  return isShow && element === 'ModalConfirm'
    ? ReactDOM.createPortal(
        <>
          <div className={modalConfirmStyles['modal']}>
            <div className={modalConfirmStyles['modal__box']}>
              <div className={modalConfirmStyles['modal__content']} ref={ref}>
                <button className={modalConfirmStyles['modal__close']} onClick={hide}>
                  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                  </svg>
                </button>
                <div className={modalConfirmStyles['modal__around']}>
                  <div className={modalConfirmStyles['modal__body']}>
                    <svg
                      aria-hidden="true"
                      className={modalConfirmStyles['modalConfirm__icon']}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 className={modalConfirmStyles['modalConfirm__text']}>{children}</h3>
                    <button
                      type="button"
                      className={modalConfirmStyles['modalConfirm__yes']}
                      onClick={() => {
                        hide();
                        event();
                      }}
                    >
                      Có
                    </button>
                    <button type="button" className={modalConfirmStyles['modalConfirm__cancel']} onClick={hide}>
                      Không
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={modalConfirmStyles['modal__bg']}></div>
        </>,
        document.body,
      )
    : null;
};

export default ModalConfirm;
