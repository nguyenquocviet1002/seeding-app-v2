import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { tokenName } from '../../utils/config';
import { getCompanyFn, getDoctorFn, updateFormFn } from '../../api/form';
import Modal from '../Modal';
import Button from '../Button';
import modalEditForm from './ModalEditForm.module.scss';

const ModalEditForm = ({ isShow, hide, element, data, toast, loading }) => {
  const [token] = useLocalStorage(tokenName, null);
  const [dataDetail, setDataDetail] = useState({
    token: token,
    name: '',
    phone: '',
    link_fb: '',
    name_fb: '',
    service: '',
    note: '',
    script: '',
    interactive_proof: '',
    company_id: '',
    doctor_id: '',
    doctor_name: '',
  });
  const [company, setCompany] = useState([]);
  const [valueFCompany, setValueFCompany] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [doctor, setDoctor] = useState([]);
  const [valueFDoctor, setValueFDoctor] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    setDataDetail((prev) => ({
      ...prev,
      ...data,
      company_id: data ? data.company_code : '',
      doctor_name: data ? data.doctor_id.name : '',
      doctor_id: data ? data.doctor_id.id : '',
    }));
  }, [data]);

  const queryClient = useQueryClient();

  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (data) => {
      setCompany(data.data.data);
    },
  });

  const queryGetDoctor = useQuery({
    queryKey: ['get-doctor', token],
    queryFn: () => getDoctorFn(token),
    onSuccess: (data) => {
      setDoctor(data.data.data);
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

  const handelValue = (e, type) => {
    const valueTarget = e.target.value;
    const valueNonSpace = valueTarget.toLowerCase().replace(/\s/g, '');
    const valueNonBind = valueNonSpace
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    if (type === 'company') {
      setValueFCompany(valueTarget);
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
    } else if (type === 'doctor') {
      setValueFDoctor(valueTarget);
      const doctorFilter = queryGetDoctor.data.data.data.filter((item) => {
        const nameCompanyNonSpace = item.name.toLowerCase().replace(/\s/g, '');
        const nameCompanyNonBind = nameCompanyNonSpace
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        return nameCompanyNonBind.includes(valueNonBind);
      });
      setDoctor(doctorFilter);
    } else {
      return;
    }
  };

  const setValueCompany = (id, name) => {
    setDataDetail((prev) => ({ ...prev, company_id: id, company_name: name }));
  };

  const setValueDoctor = (id, name) => {
    setDataDetail((prev) => ({ ...prev, doctor_id: id, doctor_name: name }));
  };

  const toggleSelect = (type) => {
    if (type === 'company') {
      setIsCompany(!isCompany);
    } else if (type === 'doctor') {
      setIsDoctor(!isDoctor);
    } else {
      return;
    }
  };

  const closeSelect = useCallback(() => {
    setValueFCompany('');
    setIsCompany(false);
    setCompany(queryGetCompany.data.data.data);
  }, [queryGetCompany]);

  const closeSelectDoctor = useCallback(() => {
    setValueFDoctor('');
    setIsDoctor(false);
    setDoctor(queryGetDoctor.data.data.data);
  }, [queryGetDoctor]);

  const refCompany = useRef(null);
  const refDoctor = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (refCompany.current && !refCompany.current.contains(event.target)) {
        closeSelect();
      }
      if (refDoctor.current && !refDoctor.current.contains(event.target)) {
        closeSelectDoctor();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refCompany, refDoctor, closeSelect, closeSelectDoctor]);

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
                      <input
                        type="text"
                        value={valueFCompany}
                        placeholder="Tìm kiếm chi nhánh"
                        onChange={(e) => handelValue(e, 'company')}
                      />
                      {valueFCompany && (
                        <button
                          onClick={() => {
                            setValueFCompany('');
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
              <div className={modalEditForm['control']} ref={refDoctor}>
                <label className={modalEditForm['label']}>Bác sĩ</label>
                <p
                  className={`${modalEditForm['input']} ${modalEditForm['select']}`}
                  onClick={() => toggleSelect('doctor')}
                >
                  {dataDetail.doctor_name ? dataDetail.doctor_name : 'Chọn bác sĩ'}
                </p>
                {isDoctor && (
                  <div className={modalEditForm['option']}>
                    <div className={modalEditForm['filter']}>
                      <input
                        type="text"
                        value={valueFDoctor}
                        placeholder="Tìm kiếm bác sĩ"
                        onChange={(e) => handelValue(e, 'doctor')}
                      />
                      {valueFDoctor && (
                        <button
                          onClick={() => {
                            setValueFDoctor('');
                            setDoctor(queryGetDoctor.data.data.data);
                          }}
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                    {doctor.length > 0 ? (
                      <ul className={modalEditForm['list']}>
                        {doctor.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => {
                              setValueDoctor(item.id, item.name);
                              closeSelectDoctor();
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
              <div className={modalEditForm['control']}>
                <label className={modalEditForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalEditForm['input']}
                  value={dataDetail.script}
                  onChange={handleChange('script')}
                />
              </div>
            </div>
            <div className={modalEditForm['group']}>
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
