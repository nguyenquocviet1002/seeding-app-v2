import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { removeFirstItem, tokenName } from '@/utils/config';
import { getAllUserFn, getUserFn } from '@/api/user';
import Modal from '../Modal';
import Button from '../Button';
import modalSearchBooking from './ModalSearchBooking.module.scss';

const ModalSearchBooking = ({ isShow, hide, element, event }) => {
  const [token] = useLocalStorage(tokenName, null);
  const initial = {
    start_date: '',
    end_date: '',
    name: '',
    phone: '',
    code: '',
    user_seeding: '',
  };
  const [form, setForm] = useState(initial);
  const [allUser, setAllUser] = useState([]);
  const [value, setValue] = useState('');
  const [isUser, setIsUser] = useState(false);

  const queryGetAllUser = useQuery({
    queryKey: ['get-all-user', token],
    queryFn: () => getAllUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setAllUser(removeFirstItem(data.data.data));
    },
  });

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn(token),
  });

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    event(form);
    setForm(initial);
    hide();
  };

  const handelValue = (e) => {
    const valueTarget = e.target.value;
    setValue(valueTarget);
    const valueNonSpace = valueTarget.toLowerCase().replace(/\s/g, '');
    const valueNonBind = valueNonSpace
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    const userFilter = removeFirstItem(queryGetAllUser.data.data.data).filter((item) => {
      const nameUserNonSpace = item.name.toLowerCase().replace(/\s/g, '');
      const nameUserNonBind = nameUserNonSpace
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
      return nameUserNonBind.includes(valueNonBind);
    });
    setAllUser(userFilter);
  };

  const setValueUser = (id, name) => {
    setForm({ ...form, user_seeding: id, name_seeding: name });
  };

  const toggleSelect = () => {
    setIsUser(!isUser);
  };

  const closeSelect = useCallback(() => {
    setValue('');
    setIsUser(false);
    setAllUser(removeFirstItem(queryGetAllUser.data.data.data));
  }, [queryGetAllUser]);

  const refUser = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (refUser.current && !refUser.current.contains(event.target)) {
        closeSelect();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refUser, closeSelect]);

  return isShow && element === 'ModalSearchBooking'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Tìm kiếm" hide={hide} size="large">
            <div className={modalSearchBooking['group']}>
              <div className={modalSearchBooking['control']}>
                <label className={modalSearchBooking['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalSearchBooking['input']}
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={modalSearchBooking['control']}>
                <label className={modalSearchBooking['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalSearchBooking['input']}
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
            <div className={modalSearchBooking['group']}>
              <div className={modalSearchBooking['control']}>
                <label className={modalSearchBooking['label']}>Mã booking</label>
                <input
                  type="text"
                  className={modalSearchBooking['input']}
                  value={form.code}
                  onChange={handleChange('code')}
                />
              </div>
              {queryGetUser.isSuccess && queryGetUser.data.data.data.rule === 'admin' && (
                <div className={modalSearchBooking['control']} ref={refUser}>
                  <label className={modalSearchBooking['label']}>Nhân viên</label>
                  <p
                    className={`${modalSearchBooking['input']} ${modalSearchBooking['select']}`}
                    onClick={() => toggleSelect()}
                  >
                    {form.name_seeding ? form.name_seeding : 'Chọn nhân viên'}
                  </p>
                  {isUser && (
                    <div className={modalSearchBooking['option']}>
                      <div className={modalSearchBooking['filter']}>
                        <input
                          type="text"
                          value={value}
                          placeholder="Tìm kiếm nhân viên"
                          onChange={(e) => handelValue(e)}
                        />
                        {value && (
                          <button
                            onClick={() => {
                              setValue('');
                              setAllUser(removeFirstItem(queryGetAllUser.data.data.data));
                            }}
                          >
                            &#10005;
                          </button>
                        )}
                      </div>
                      {allUser.length > 0 ? (
                        <ul className={modalSearchBooking['list']}>
                          {allUser.map((item) => (
                            <li
                              key={item.code_user}
                              onClick={() => {
                                setValueUser(item.code_user, item.name);
                                closeSelect();
                              }}
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className={modalSearchBooking['list']}>Không có dữ liệu</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={modalSearchBooking['group']}>
              <div className={modalSearchBooking['control']}>
                <label className={modalSearchBooking['label']}>Từ ngày</label>
                <input
                  type="date"
                  className={modalSearchBooking['input']}
                  value={form.start_date}
                  onChange={handleChange('start_date')}
                />
              </div>
              <div className={modalSearchBooking['control']}>
                <label className={modalSearchBooking['label']}>Đến ngày</label>
                <input
                  type="date"
                  className={modalSearchBooking['input']}
                  value={form.end_date}
                  onChange={handleChange('end_date')}
                />
              </div>
            </div>
            <div className={modalSearchBooking['submit']}>
              <Button classItem="primary" event={() => handelSubmit()}>
                Tìm kiếm
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalSearchBooking;
