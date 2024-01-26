import { useEffect, useRef } from 'react';
import Toast from '../Toast/Toast';
import toastListStyles from './ToastList.module.scss';

const ToastList = ({ data, removeToast }) => {
  const listRef = useRef(null);

  const handleScrolling = (el) => {
    el?.scrollTo(0, 0);
  };

  useEffect(() => {
    handleScrolling(listRef.current);
  }, [data]);

  const sortedData = [...data].reverse();

  return (
    sortedData.length > 0 && (
      <div
        className={`${toastListStyles['toast-list']} ${toastListStyles['toast-list--bottom-right']}`}
        aria-live="assertive"
        ref={listRef}
      >
        {sortedData.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    )
  );
};

export default ToastList;
