import { useEffect, useRef, useState } from 'react';
import selectUserStyles from './SelectUser.module.scss';

const SelectUser = ({ labelIndex, data, eventClick }) => {
  const userIsActive = data.filter((item) => item.active_user === true);
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
    <div className={selectUserStyles['select']} ref={ref}>
      <button className={selectUserStyles['select__label']} onClick={() => setIsDropdown(!isDropdown)}>
        {labelIndex.label}
      </button>
      {isDropdown && (
        <div className={selectUserStyles['select__dropdown']}>
          <div
            className={selectUserStyles['select__item']}
            id=""
            onClick={(e) => {
              eventClick(e);
              setIsDropdown(false);
            }}
          >
            Tất cả
          </div>
          {userIsActive.map((item, index) => (
            <div
              key={index}
              className={selectUserStyles['select__item']}
              id={item.code_user}
              onClick={(e) => {
                eventClick(e);
                setIsDropdown(false);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectUser;
