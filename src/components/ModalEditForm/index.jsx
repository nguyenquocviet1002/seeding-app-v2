import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { tokenName } from '../../utils/config';
import { getCompanyFn, getDoctorFn, updateFormFn } from '../../api/form';
import Modal from '../Modal';
import Button from '../Button';
import styles from './ModalEditForm.module.scss';

// Import các component InputField và SelectField
import InputField from '../ModalCreateForm/InputField';
import SelectField from '../ModalCreateForm/SelectField';

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
    company_name: '',
    doctor_id: '',
    doctor_name: '',
    type_customer: '',
    type_customer_name: '',
  });

  // Data cho Type Customer
  const dataTypeCustomer = [
    { id: 'marketing', name: 'Marketing - Việt kiều' },
    { id: 'branch', name: 'Chi nhánh - Việt Kiều' },
    { id: 'mkt_oversea', name: 'Marketing - Quốc tế' },
    { id: 'branch_oversea', name: 'Chi nhánh - Quốc tế' },
  ];

  // States cho SelectField (danh sách options, giá trị tìm kiếm, trạng thái mở/đóng)
  const [companyOptions, setCompanyOptions] = useState([]);
  const [valueFCompany, setValueFCompany] = useState('');
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [valueFDoctor, setValueFDoctor] = useState('');
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  // States cho Type Customer
  const [typeCustomerOptions, setTypeCustomerOptions] = useState([...dataTypeCustomer]);
  const [valueFTypeCustomer, setValueFTypeCustomer] = useState('');
  const [isTypeCustomerOpen, setIsTypeCustomerOpen] = useState(false);

  const queryClient = useQueryClient();

  // DI CHUYỂN CÁC KHAI BÁO useQuery LÊN ĐÂY
  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (response) => {
      setCompanyOptions(response.data.data);
      // Logic cập nhật dataDetail.company_name sẽ được xử lý trong useEffect bên dưới
    },
    enabled: !!token,
  });

  const queryGetDoctor = useQuery({
    queryKey: ['get-doctor', token],
    queryFn: () => getDoctorFn(token),
    onSuccess: (response) => {
      setDoctorOptions(response.data.data);
    },
    enabled: !!token,
  });

  const queryUpdateForm = useQuery({
    queryKey: ['edit-form'],
    queryFn: () => updateFormFn(dataDetail),
    enabled: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-form'] });
      loading();
      hide();
      toast('Lưu thông tin thành công', 'success');
    },
    onError: (error) => {
      loading();
      toast(`Lỗi: ${error.message}`, 'error');
    }
  });
  // KẾT THÚC DI CHUYỂN CÁC KHAI BÁO useQuery

  // Effect để cập nhật dataDetail khi prop `data` hoặc dữ liệu từ query thay đổi
  useEffect(() => {
    if (data) {
      const companyName = queryGetCompany.data?.data?.data.find(c => c.code === data.company_code)?.name || '';
      const doctorName = queryGetDoctor.data?.data?.data.find(d => d.id === data.doctor_id?.id)?.name || '';
      const typeCustomerName = dataTypeCustomer.find(tc => tc.id === data.type_customer)?.name || '';

      setDataDetail((prev) => ({
        ...prev,
        ...data,
        company_id: data.company_code || '',
        company_name: companyName, // Cập nhật từ dữ liệu fetched
        doctor_id: data.doctor_id?.id || '',
        doctor_name: doctorName,   // Cập nhật từ dữ liệu fetched
        type_customer: data.type_customer || '',
        type_customer_name: typeCustomerName, // Cập nhật từ dataTypeCustomer
      }));
    } else {
      // Reset về trạng thái ban đầu khi modal đóng hoặc data không tồn tại
      setDataDetail({
        token: token,
        name: '', phone: '', link_fb: '', name_fb: '', service: '',
        note: '', script: '', interactive_proof: '', company_id: '',
        company_name: '', doctor_id: '', doctor_name: '',
        type_customer: '', type_customer_name: '',
      });
    }
  }, [data, token, queryGetCompany.data, queryGetDoctor.data]); // Thêm queryGetDoctor.data vào dependencies


  const handleChange = (name) => (event) => {
    setDataDetail((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = () => {
    loading();
    queryUpdateForm.refetch();
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace(/\s/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Handlers để tìm kiếm trong SelectFields
  const handleSearch = (e, type) => {
    const valueTarget = e.target.value;
    const valueNonBind = normalizeString(valueTarget);

    if (type === 'company') {
      setValueFCompany(valueTarget);
      const filtered = queryGetCompany.data?.data?.data.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      ) || [];
      setCompanyOptions(filtered);
    } else if (type === 'doctor') {
      setValueFDoctor(valueTarget);
      const filtered = queryGetDoctor.data?.data?.data.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      ) || [];
      setDoctorOptions(filtered);
    } else if (type === 'type_customer') {
      setValueFTypeCustomer(valueTarget);
      const filtered = dataTypeCustomer.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      );
      setTypeCustomerOptions(filtered);
    }
  };

  // Handlers để xóa tìm kiếm trong SelectFields
  const handleClearSearch = (type) => {
    if (type === 'company') {
      setValueFCompany('');
      setCompanyOptions(queryGetCompany.data?.data?.data || []);
    } else if (type === 'doctor') {
      setValueFDoctor('');
      setDoctorOptions(queryGetDoctor.data?.data?.data || []);
    } else if (type === 'type_customer') {
      setValueFTypeCustomer('');
      setTypeCustomerOptions([...dataTypeCustomer]);
    }
  };

  // Handlers để chọn một item trong SelectFields
  const handleSelectCompany = (code, name) => {
    setDataDetail((prev) => ({ ...prev, company_id: code, company_name: name }));
  };

  const handleSelectDoctor = (id, name) => {
    setDataDetail((prev) => ({ ...prev, doctor_id: id, doctor_name: name }));
  };

  const handleSelectTypeCustomer = (id, name) => {
    setDataDetail((prev) => ({ ...prev, type_customer: id, type_customer_name: name }));
  };

  // Hàm chuyển đổi trạng thái mở/đóng của SelectFields
  const toggleCompany = () => setIsCompanyOpen((prev) => !prev);
  const toggleDoctor = () => setIsDoctorOpen((prev) => !prev);
  const toggleTypeCustomer = () => setIsTypeCustomerOpen((prev) => !prev);


  // Hàm đóng SelectFields (cũng reset tìm kiếm và danh sách)
  const closeCompanySelect = useCallback(() => {
    setValueFCompany('');
    setIsCompanyOpen(false);
    if (queryGetCompany.data?.data?.data) {
      setCompanyOptions(queryGetCompany.data.data.data);
    }
  }, [queryGetCompany.data]);

  const closeDoctorSelect = useCallback(() => {
    setValueFDoctor('');
    setIsDoctorOpen(false);
    if (queryGetDoctor.data?.data?.data) {
      setDoctorOptions(queryGetDoctor.data.data.data);
    }
  }, [queryGetDoctor.data]);

  const closeTypeCustomerSelect = useCallback(() => {
    setValueFTypeCustomer('');
    setIsTypeCustomerOpen(false);
    setTypeCustomerOptions([...dataTypeCustomer]);
  }, []);


  const refCompany = useRef(null);
  const refDoctor = useRef(null);
  const refTypeCustomer = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideCompany = refCompany.current && refCompany.current.contains(event.target);
      const clickedInsideDoctor = refDoctor.current && refDoctor.current.contains(event.target);
      const clickedInsideTypeCustomer = refTypeCustomer.current && refTypeCustomer.current.contains(event.target);


      if (!clickedInsideCompany && isCompanyOpen) {
        closeCompanySelect();
      }
      if (!clickedInsideDoctor && isDoctorOpen) {
        closeDoctorSelect();
      }
      if (!clickedInsideTypeCustomer && isTypeCustomerOpen) {
        closeTypeCustomerSelect();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    refCompany, refDoctor, refTypeCustomer,
    isCompanyOpen, isDoctorOpen, isTypeCustomerOpen,
    closeCompanySelect, closeDoctorSelect, closeTypeCustomerSelect
  ]);


  return isShow && element === 'ModalEditForm'
    ? ReactDOM.createPortal(
      <>
        <Modal title="Sửa thông tin" hide={hide} size="large">
          <div className={styles['group']}>
            <InputField
              label="Họ tên"
              name="name"
              value={dataDetail.name}
              onChange={handleChange('name')}
            />
            <InputField
              label="Số điện thoại"
              name="phone"
              type="text"
              value={dataDetail.phone}
              onChange={handleChange('phone')}
            />
          </div>
          <div className={styles['group']}>
            <InputField
              label="Facebook"
              name="name_fb"
              value={dataDetail.name_fb}
              onChange={handleChange('name_fb')}
            />
            <InputField
              label="Link Facebook"
              name="link_fb"
              value={dataDetail.link_fb}
              onChange={handleChange('link_fb')}
            />
          </div>
          <div className={styles['group']}>
            <InputField
              label="Dịch vụ"
              name="service"
              value={dataDetail.service}
              onChange={handleChange('service')}
            />
            <SelectField
              label="Chi nhánh"
              fieldRef={refCompany}
              value={dataDetail.company_name}
              options={companyOptions}
              onSelect={handleSelectCompany}
              onSearch={(e) => handleSearch(e, 'company')}
              searchValue={valueFCompany}
              onClearSearch={() => handleClearSearch('company')}
              isOpen={isCompanyOpen}
              toggleOpen={toggleCompany}
              closeSelect={closeCompanySelect}
              displayKey="name"
              valueKey="code"
              placeholder="Chọn chi nhánh"
            />
          </div>
          <div className={styles['group']}>
            <SelectField
              label="Bác sĩ"
              fieldRef={refDoctor}
              value={dataDetail.doctor_name}
              options={doctorOptions}
              onSelect={handleSelectDoctor}
              onSearch={(e) => handleSearch(e, 'doctor')}
              searchValue={valueFDoctor}
              onClearSearch={() => handleClearSearch('doctor')}
              isOpen={isDoctorOpen}
              toggleOpen={toggleDoctor}
              closeSelect={closeDoctorSelect}
              displayKey="name"
              valueKey="id"
              placeholder="Chọn bác sĩ"
            />
            <InputField
              label="Kịch bản"
              name="script"
              value={dataDetail.script}
              onChange={handleChange('script')}
            />
          </div>
          <div className={styles['group']}>
            <InputField
              label="Tương tác"
              name="interactive_proof"
              value={dataDetail.interactive_proof}
              onChange={handleChange('interactive_proof')}
            />
            <SelectField
              label="Loại khách hàng"
              fieldRef={refTypeCustomer}
              value={dataDetail.type_customer_name}
              options={typeCustomerOptions}
              onSelect={handleSelectTypeCustomer}
              onSearch={(e) => handleSearch(e, 'type_customer')}
              searchValue={valueFTypeCustomer}
              onClearSearch={() => handleClearSearch('type_customer')}
              isOpen={isTypeCustomerOpen}
              toggleOpen={toggleTypeCustomer}
              closeSelect={closeTypeCustomerSelect}
              displayKey="name"
              valueKey="id"
              placeholder="Chọn loại khách hàng"
            />
          </div>
          <div className={styles['group--full']}>
            <InputField
              label="Ghi chú"
              name="note"
              type="textarea"
              value={dataDetail.note}
              onChange={handleChange('note')}
              rows={4}
            />
          </div>
          <div className={styles['submit']}>
            <Button classItem="primary" event={handleSubmit}>
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