import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFormFn, getCompanyFn } from '@/api/form';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { tokenName } from '@/utils/config';
import Modal from '../Modal';
import Button from '../Button';
import modalCreateForm from './ModalCreateForm.module.scss';

const ModalCreateForm = ({ isShow, hide, element, toast, loading }) => {
  const [token] = useLocalStorage(tokenName, null);
  const initial = {
    token: token,
    type: 'seeding',
    company_id: '',
    name_fb: '',
    link_fb: '',
    phone: '',
    service: '',
    name: '',
    note: '',
    script: '',
    interactive_proof: '',
  };
  const [form, setForm] = useState(initial);
  const [company, setCompany] = useState([]);
  const [value, setValue] = useState('');
  const [isCompany, setIsCompany] = useState(false);

  const queryClient = useQueryClient();

  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (data) => {
      setCompany(data.data.data);
    },
  });

  const queryCreateForm = useQuery({
    queryKey: ['create-form'],
    queryFn: () => createFormFn(form),
    enabled: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-form'] });
      loading();
    },
  });

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    if (!form.name || !form.phone || !form.service || !form.company_id) {
      toast('Vui lòng điền các trường bắt buộc', 'warning');
    } else {
      loading();
      queryCreateForm.refetch();
      setForm(initial);
      hide();
      toast('Thêm mới thành công', 'success');
    }
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
  };

  const setValueCompany = (id, name) => {
    setForm({ ...form, company_id: id, company_name: name });
  };

  const toggleSelect = () => {
    setIsCompany(!isCompany);
  };

  const closeSelect = useCallback(() => {
    setValue('');
    setIsCompany(false);
    setCompany(queryGetCompany.data.data.data);
  }, [queryGetCompany]);

  const refCompany = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (refCompany.current && !refCompany.current.contains(event.target)) {
        closeSelect('company');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refCompany, closeSelect]);

  return isShow && element === 'ModalCreateForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Thêm mới" hide={hide} size="large">
            <div className={modalCreateForm['note']}>
              <span className={modalCreateForm['require']}>(*)</span> : trường bắt buộc
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>
                  Họ tên <span className={modalCreateForm['require']}>(*)</span>
                </label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>
                  Số điện thoại <span className={modalCreateForm['require']}>(*)</span>
                </label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>
                  Dịch vụ <span className={modalCreateForm['require']}>(*)</span>
                </label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.service}
                  onChange={handleChange('service')}
                />
              </div>
              <div className={modalCreateForm['control']} ref={refCompany}>
                <label className={modalCreateForm['label']}>
                  Chi nhánh <span className={modalCreateForm['require']}>(*)</span>
                </label>
                <p
                  className={`${modalCreateForm['input']} ${modalCreateForm['select']}`}
                  onClick={() => toggleSelect('company')}
                >
                  {form.company_name ? form.company_name : 'Chọn chi nhánh'}
                </p>
                {isCompany && (
                  <div className={modalCreateForm['option']}>
                    <div className={modalCreateForm['filter']}>
                      <input type="text" value={value} placeholder="Tìm kiếm chi nhánh" onChange={handelValue} />
                      {value && (
                        <button
                          onClick={() => {
                            setValue('');
                            setCompany(queryGetCompany.data.data.data);
                          }}
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                    {company.length > 0 ? (
                      <ul className={modalCreateForm['list']}>
                        {company.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => {
                              setValueCompany(item.code, item.name);
                              closeSelect();
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={modalCreateForm['list']}>Không có dữ liệu</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Tên Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.name_fb}
                  onChange={handleChange('name_fb')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Link Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.link_fb}
                  onChange={handleChange('link_fb')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.script}
                  onChange={handleChange('script')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Tương tác</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.interactive_proof}
                  onChange={handleChange('interactive_proof')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group--full']}>
              <label className={modalCreateForm['label']}>Ghi chú</label>
              <textarea
                className={modalCreateForm['input']}
                value={form.note}
                onChange={handleChange('note')}
                rows={3}
              ></textarea>
            </div>
            <div className={modalCreateForm['submit']}>
              <Button classItem="primary" event={() => handelSubmit()}>
                Thêm mới
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalCreateForm;
