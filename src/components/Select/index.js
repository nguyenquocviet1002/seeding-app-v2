import { useEffect, useRef, useState } from 'react';
import selectStyles from './Select.module.scss';

const Select = ({ labelIndex, data, eventClick }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className={selectStyles['select']} ref={ref}>
      <button className={selectStyles['select__label']} onClick={() => setIsDropdown(!isDropdown)}>
        {labelIndex.label}
      </button>
      {isDropdown && (
        <div className={selectStyles['select__dropdown']}>
          {data.map((item, index) => (
            <div
              key={index}
              className={selectStyles['select__item']}
              id={item.value}
              onClick={(e) => {
                eventClick(e);
                setIsDropdown(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
