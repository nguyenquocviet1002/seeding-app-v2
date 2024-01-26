import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { tokenName } from '@/utils/config';
import Modal from '../Modal';
import Button from '../Button';
import modalEditForm from './ModalEditForm.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCompanyFn, updateFormFn } from '@/api/form';

const ModalEditForm = ({ isShow, hide, element, data, toast, loading }) => {
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

  const [dataDetail, setDataDetail] = useState(initial);
  const [company, setCompany] = useState([]);
  const [value, setValue] = useState('');
  const [isCompany, setIsCompany] = useState(false);

  useEffect(() => {
    setDataDetail((prev) => ({ ...prev, ...data, company_id: data ? data.company_code : '' }));
  }, [data]);

  const queryClient = useQueryClient();

  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (data) => {
      setCompany(data.data.data);
    },
  });

  const queryUpdateForm = useQuery({
    queryKey: ['edit-form'],
    queryFn: () => updateFormFn(dataDetail),
    enabled: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-form'] });
      loading();
      toast('Lưu thông tin thành công', 'success');
    },
  });

  const handleChange = (name) => (event) => {
    setDataDetail((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handleSubmit = () => {
    loading();
    queryUpdateForm.refetch();
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
    setDataDetail((prev) => ({ ...prev, company_id: id, company_name: name }));
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

  return isShow && element === 'ModalEditForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Sửa thông tin" hide={hide} size="large">
            <div className={modalEditForm['group']}>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
            <div className={modalEditForm['group']}>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Facebook</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.name_fb}
                  onChange={handleChange('name_fb')}
                />
              </div>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Link Facebook</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.link_fb}
                  onChange={handleChange('link_fb')}
                />
              </div>
            </div>
            <div className={modalEditForm['group']}>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.service}
                  onChange={handleChange('service')}
                />
              </div>
              <div className={modalEditForm['control']} ref={refCompany}>
                <label className={modalEditForm['label']}>Chi nhánh</label>
                <p
                  className={`${modalEditForm['input']} ${modalEditForm['select']}`}
                  onClick={() => toggleSelect('company')}
                >
                  {dataDetail.company_name ? dataDetail.company_name : 'Chọn chi nhánh'}
                </p>
                {isCompany && (
                  <div className={modalEditForm['option']}>
                    <div className={modalEditForm['filter']}>
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
                      <ul className={modalEditForm['list']}>
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
                      <div className={modalEditForm['list']}>Không có dữ liệu</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={modalEditForm['group']}>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.script}
                  onChange={handleChange('script')}
                />
              </div>
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Tương tác</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.interactive_proof}
                  onChange={handleChange('interactive_proof')}
                />
              </div>
            </div>
            <div className={modalEditForm['group--full']}>
              <label className={modalEditForm['label']}>Ghi chú</label>
              <textarea
                className={modalEditForm['input']}
                value={dataDetail.note}
                onChange={handleChange('note')}
                rows={4}
              ></textarea>
            </div>
            <div className={modalEditForm['submit']}>
              <Button classItem="primary" event={() => handleSubmit()}>
                Lưu
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalEditForm;
