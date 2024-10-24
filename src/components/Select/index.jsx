import { useEffect, useRef, useState } from 'react';
import selectStyles from './Select.module.scss';

const Select = ({ labelIndex, data, eventClick, keyData, code, all }) => {
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
          {all && (
            <div
              className={selectStyles['select__item']}
              id=""
              onClick={(e) => {
                eventClick(e);
                setIsDropdown(false);
              }}
            >
              Tất cả
            </div>
          )}
          {data.map((item, index) => (
            <div
              key={index}
              className={selectStyles['select__item']}
              id={!code ? item.value : item[code]}
              onClick={(e) => {
                eventClick(e);
                setIsDropdown(false);
              }}
            >
              {!keyData ? item.label : item[keyData]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
