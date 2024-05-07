import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { removeFirstItem, tokenName } from '@/utils/config';
import { getCompanyFn } from '@/api/form';
import { getUserFn, getNameFn } from '@/api/user';
import Modal from '../Modal';
import Button from '../Button';
import modalSearchForm from './ModalSearchForm.module.scss';

const ModalSearchForm = ({ isShow, hide, element, event }) => {
  const [token] = useLocalStorage(tokenName, null);
  const initial = {
    company_id: '',
    company_name: '',
    name_fb: '',
    phone: '',
    service: '',
    name: '',
    start_date: '',
    end_date: '',
    user_seeding: '',
    name_seeding: '',
  };
  const [form, setForm] = useState(initial);
  const [company, setCompany] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [inputCompany, setInputCompany] = useState('');
  const [inputUser, setInputUser] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (data) => {
      setCompany(data.data.data);
    },
  });

  const queryGetAllUser = useQuery({
    queryKey: ['get-all-user', token],
    queryFn: () => getUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setAllUser(filterIsActive(removeFirstItem(data.data.data)));
    },
  });

  const queryGetName = useQuery({
    queryKey: ['get-name', token],
    queryFn: () => getNameFn(token),
  });

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    event(form);
    setForm(initial);
    hide();
  };

  const handelValue = (e, type) => {
    const valueTarget = e.target.value;
    const valueNonSpace = valueTarget.toLowerCase().replace(/\s/g, '');
    const valueNonBind = valueNonSpace
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    if (type === 'company') {
      setInputCompany(valueTarget);
      const companyFilter = queryGetCompany.data.data.data.filter((item) => {
        const nameCompanyNonSpace = item.name.toLowerCase().replace(/\s/g, '');
        const nameCompanyNonBind = nameCompanyNonSpace
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        return nameCompanyNonBind.includes(valueNonBind);
      });
      setCompany(companyFilter);
    }
    if (type === 'user') {
      setInputUser(valueTarget);
      const userFilter = filterIsActive(removeFirstItem(queryGetAllUser.data.data.data)).filter((item) => {
        const nameUserNonSpace = item.name.toLowerCase().replace(/\s/g, '');
        const nameUserNonBind = nameUserNonSpace
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        return nameUserNonBind.includes(valueNonBind);
      });
      setAllUser(userFilter);
    }
  };

  const setValueCompany = (id, name) => {
    setForm({ ...form, company_id: id, company_name: name });
  };

  const setValueUser = (id, name) => {
    setForm({ ...form, user_seeding: id, name_seeding: name });
  };

  const toggleSelect = (type) => {
    if (type === 'company') {
      setIsCompany(!isCompany);
    }
    if (type === 'user') {
      setIsUser(!isUser);
    }
  };

  const closeSelect = useCallback(
    (type) => {
      if (type === 'company') {
        setInputCompany('');
        setIsCompany(false);
        setCompany(queryGetCompany.data.data.data);
      }
      if (type === 'user') {
        setInputUser('');
        setIsUser(false);
        setAllUser(filterIsActive(removeFirstItem(queryGetAllUser.data.data.data)));
      }
    },
    [queryGetCompany, queryGetAllUser],
  );

  const filterIsActive = (data) => {
    return data.filter((item) => item.active_user === true);
  };

  const refCompany = useRef(null);
  const refUser = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (refCompany.current && !refCompany.current.contains(event.target)) {
        closeSelect('company');
      }
      if (refUser.current && !refUser.current.contains(event.target)) {
        closeSelect('user');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refCompany, refUser, closeSelect]);

  return isShow && element === 'ModalSearchForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Tìm kiếm" hide={hide} size="large">
            <div className={modalSearchForm['group']}>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalSearchForm['input']}
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalSearchForm['input']}
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
            <div className={modalSearchForm['group']}>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Tên Facebook</label>
                <input
                  type="text"
                  className={modalSearchForm['input']}
                  value={form.name_fb}
                  onChange={handleChange('name_fb')}
                />
              </div>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalSearchForm['input']}
                  value={form.service}
                  onChange={handleChange('service')}
                />
              </div>
            </div>
            <div className={modalSearchForm['group']}>
              <div className={modalSearchForm['control']} ref={refCompany}>
                <label className={modalSearchForm['label']}>Chi nhánh</label>
                <p
                  className={`${modalSearchForm['input']} ${modalSearchForm['select']}`}
                  onClick={() => toggleSelect('company')}
                >
                  {form.company_name ? form.company_name : 'Chọn chi nhánh'}
                </p>
                {isCompany && (
                  <div className={modalSearchForm['option']}>
                    <div className={modalSearchForm['filter']}>
                      <input
                        type="text"
                        value={inputCompany}
                        placeholder="Tìm kiếm chi nhánh"
                        onChange={(e) => handelValue(e, 'company')}
                      />
                      {inputCompany && (
                        <button
                          onClick={() => {
                            setInputCompany('');
                            setCompany(queryGetCompany.data.data.data);
                          }}
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                    {company.length > 0 ? (
                      <ul className={modalSearchForm['list']}>
                        {company.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => {
                              setValueCompany(item.code, item.name);
                              closeSelect('company');
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={modalSearchForm['list']}>Không có dữ liệu</div>
                    )}
                  </div>
                )}
              </div>
              {queryGetName.isSuccess && queryGetName.data.data.data.rule === 'admin' && (
                <div className={modalSearchForm['control']} ref={refUser}>
                  <label className={modalSearchForm['label']}>Nhân viên</label>
                  <p
                    className={`${modalSearchForm['input']} ${modalSearchForm['select']}`}
                    onClick={() => toggleSelect('user')}
                  >
                    {form.name_seeding ? form.name_seeding : 'Chọn nhân viên'}
                  </p>
                  {isUser && (
                    <div className={modalSearchForm['option']}>
                      <div className={modalSearchForm['filter']}>
                        <input
                          type="text"
                          value={inputUser}
                          placeholder="Tìm kiếm nhân viên"
                          onChange={(e) => handelValue(e, 'user')}
                        />
                        {inputUser && (
                          <button
                            onClick={() => {
                              setInputUser('');
                              setAllUser(filterIsActive(removeFirstItem(queryGetAllUser.data.data.data)));
                            }}
                          >
                            &#10005;
                          </button>
                        )}
                      </div>
                      {allUser.length > 0 ? (
                        <ul className={modalSearchForm['list']}>
                          {allUser.map((item) => (
                            <li
                              key={item.code_user}
                              onClick={() => {
                                setValueUser(item.code_user, item.name);
                                closeSelect('user');
                              }}
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className={modalSearchForm['list']}>Không có dữ liệu</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={modalSearchForm['group']}>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Từ ngày</label>
                <input
                  type="date"
                  className={modalSearchForm['input']}
                  value={form.start_date}
                  onChange={handleChange('start_date')}
                />
              </div>
              <div className={modalSearchForm['control']}>
                <label className={modalSearchForm['label']}>Đến ngày</label>
                <input
                  type="date"
                  className={modalSearchForm['input']}
                  value={form.end_date}
                  onChange={handleChange('end_date')}
                />
              </div>
            </div>
            <div className={modalSearchForm['submit']}>
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

export default ModalSearchForm;
