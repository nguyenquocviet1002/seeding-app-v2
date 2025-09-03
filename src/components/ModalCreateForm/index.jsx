import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFormFn, getCompanyFn, getDoctorFn } from '../../api/form';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { tokenName } from '../../utils/config';
import Modal from '../Modal';
import Button from '../Button';
import modalCreateForm from './ModalCreateForm.module.scss';

const ModalCreateForm = ({ isShow, hide, element, toast, loading }) => {
  const [token] = useLocalStorage(tokenName, null);
  const initial = {
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
    type: 'seeding',
  };
  const [form, setForm] = useState(initial);
  const [company, setCompany] = useState([]);
  // Khai báo Data Fanpage
  const dataFanpage = [
    {
      id: 1,
      name: 'BS Lucas Hoàng',
      link: 'https://www.facebook.com/profile.php?id=61566337224475'
    },
    {
      id: 2,
      name: 'BS Henry',
      link: 'https://www.facebook.com/drhenrykangnam'
    },
    {
      id: 3,
      name: 'BS Felix',
      link: 'https://www.facebook.com/drfelixtrankangnam'
    },
    {
      id: 4,
      name: 'Bác sỹ Henry Nguyễn',
      link: 'https://www.facebook.com/Bacsihenrynguyenx'
    },
    {
      id: 5,
      name: 'BS Victo Vũ',
      link: 'https://www.facebook.com/DrVictorVuBVTMKangNam'
    },
    {
      id: 6,
      name: 'BS Edward Nguyễn',
      link: 'https://www.facebook.com/bacsiedwardnguyenkangnam'
    },
    {
      id: 7,
      name: 'BS Felix Trần',
      link: 'https://www.facebook.com/DrFelixTranBVTMKangnam'
    },
    {
      id: 8,
      name: 'Bác sĩ Annie Lê',
      link: 'https://www.facebook.com/DrAnnieLeTruongkhoaBenhvienRHMParis/about_contact_and_basic_info'
    },
    {
      id: 9,
      name: 'Bác sĩ Aniie Seeding',
      link: 'https://www.facebook.com/dr.AnnieLe.truongkhoaRHMParis/'
    },
  ];
  // Khai báo trạng thái Fanpage
  const [fanpage, setFanpage] = useState([... dataFanpage]);
  const [doctor, setDoctor] = useState([]);
  // Khai báo giá trị tìm kiếm Fanpage
  const [valueFFanpage, setValueFFanpage] = useState('');
  const [valueFCompany, setValueFCompany] = useState('');
  const [valueFDoctor, setValueFDoctor] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  // Kiểm tra trang thái Fanpage
  const [isFanpage, setIsFanpage] = useState(false);

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
    const noteString = form.note.length;
    if (!form.name || !form.phone || !form.service || !form.company_id) {
      toast('Vui lòng điền các trường bắt buộc', 'warning');
    } else if(noteString > 100){
      toast(`Bạn vùi lòng nhập dưới 100 ký tự! Số ký tự hiện tại: ${noteString}. `, 'warning');
    } else {
      loading();
      queryCreateForm.refetch();
      setForm(initial);
      hide();
      toast('Thêm mới thành công', 'success');
    }
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
    }else if (type === 'fanpage') {
      setValueFFanpage(valueTarget);
      // Lọc dữ liệu Fanpage
      const fanpageFilter = dataFanpage.filter((item) => {
        const nameFanpageNonSpace = item.name.toLowerCase().replace(/\s/g, '');
        const nameFanpageNonBind = nameFanpageNonSpace
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        return nameFanpageNonBind.includes(valueNonBind);
      });
      setFanpage(fanpageFilter);
    } else {
      return;
    }
  };

  const setValueCompany = (id, name) => {
    setForm({ ...form, company_id: id, company_name: name });
  };

  // Thêm giá trị Fanpage
  const setValueFanpage = (id, name, link) => {
    setForm({ ...form, interactive_proof_id: id, interactive_proof_name: name, interactive_proof: link });
  };

  const setValueDoctor = (id, name) => {
    setForm({ ...form, doctor_id: id, doctor_name: name });
  };

  const toggleSelect = (type) => {
    if (type === 'company') {
      setIsCompany(!isCompany);
    } else if (type === 'doctor') {
      setIsDoctor(!isDoctor);
    } else if( type === 'fanpage'){
      // Thay đổi trạng thái Fanpage
      setIsFanpage((!isFanpage));
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

  // Đóng chọn Fanpage
  const closeSelectFanpage = useCallback(() => {
    setValueFFanpage('');
    setIsFanpage(false);
    setFanpage([... dataFanpage]);
  }, [queryGetDoctor]);

  const refCompany = useRef(null);
  const refDoctor = useRef(null);
  // Thêm ref Fanpage
  const refFanpage = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (refCompany.current && !refCompany.current.contains(event.target)) {
        closeSelect();
      }
      // Thêm điều kiện đóng chọn Fanpage
      if (refFanpage.current && !refFanpage.current.contains(event.target)) {
        closeSelectFanpage();
      }
      if (refDoctor.current && !refDoctor.current.contains(event.target)) {
        closeSelectDoctor();
      } else {
        return;
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refCompany, closeSelect, closeSelectDoctor, closeSelectFanpage]);

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
              <div className={modalCreateForm['control']} ref={refDoctor}>
                <label className={modalCreateForm['label']}>Bác sĩ</label>
                <p
                  className={`${modalCreateForm['input']} ${modalCreateForm['select']}`}
                  onClick={() => toggleSelect('doctor')}
                >
                  {form.doctor_name ? form.doctor_name : 'Chọn bác sĩ'}
                </p>
                {isDoctor && (
                  <div className={modalCreateForm['option']}>
                    <div className={modalCreateForm['filter']}>
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
                      <ul className={modalCreateForm['list']}>
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
                      <div className={modalCreateForm['list']}>Không có dữ liệu</div>
                    )}
                  </div>
                )}
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Tên Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.name_fb}
                  onChange={handleChange('name_fb')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Link Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.link_fb}
                  onChange={handleChange('link_fb')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.script}
                  onChange={handleChange('script')}
                />
              </div>
            </div>
            {/* <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Link Fanpage [Bác sĩ]</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.interactive_proof}
                  onChange={handleChange('interactive_proof')}
                />
              </div>
            </div> */}
            {/* // Thêm dữ liệu Fanpage */}
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']} ref={refFanpage}>
                <label className={modalCreateForm['label']}>
                  Link Fanpage Bác sĩ 
                  {
                    form.interactive_proof && (<span onClick={() => setValueFanpage('')}>[ Hủy bỏ ]</span>)
                  } 
                </label>
                <p
                  className={`${modalCreateForm['input']} ${modalCreateForm['select']}`}
                  onClick={() => toggleSelect('fanpage')}
                >
                  <span>{form.interactive_proof ? form.interactive_proof : 'Chọn Fanpage Bác sĩ'}</span>
                </p>
                {isFanpage && (
                  <div className={modalCreateForm['option']}>
                    <div className={modalCreateForm['filter']}>
                      <input
                        type="text"
                        value={valueFFanpage}
                        placeholder="Tìm kiếm chi nhánh"
                        onChange={(e) => handelValue(e, 'fanpage')}
                      />
                      {valueFFanpage && (
                        <button
                          onClick={() => {
                            setValueFFanpage('');
                            setFanpage([... dataFanpage]);
                          }}
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                    {fanpage.length > 0 ? (
                      <ul className={modalCreateForm['list']}>
                        {fanpage.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => {
                              setValueFanpage(item.id, item.name, item.link);
                              closeSelectFanpage();
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
