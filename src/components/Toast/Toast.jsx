import { CloseIcon, FailureIcon, SuccessIcon, WarningIcon } from '../Icons/Icon';
import toastStyles from './Toast.module.scss';

const Toast = ({ message, type, onClose }) => {
  const iconMap = {
    success: <SuccessIcon />,
    failure: <FailureIcon />,
    warning: <WarningIcon />,
  };
  const toastIcon = iconMap[type] || null;

  return (
    <div className={`${toastStyles['toast']} ${toastStyles[`toast--${type}`]}`} role="alert">
      <div className={toastStyles['toast-message']}>
        {toastIcon && (
          <div className={`${toastStyles['icon']} ${toastStyles['icon--lg']} ${toastStyles['icon--thumb']}`}>
            {toastIcon}
          </div>
        )}
        <p>{message}</p>
      </div>
      <button className={toastStyles['toast-close-btn']} onClick={onClose}>
        <span className={toastStyles['icon']}>
          <CloseIcon />
        </span>
      </button>
    </div>
  );
};

Toast.defaultProps = {
  type: 'success',
  message: 'Add a meaningful toast message here.',
};

export default Toast;
