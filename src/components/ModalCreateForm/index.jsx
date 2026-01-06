import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFormFn, getCompanyFn, getDoctorFn } from '../../api/form';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { tokenName } from '../../utils/config';
import Modal from '../Modal';
import Button from '../Button';
import styles from './ModalCreateForm.module.scss'; // Đổi alias import thành `styles`

// Import các component mới
import InputField from './InputField';
import SelectField from './SelectField';

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
    interactive_proof: '', // Lưu link fanpage
    company_id: '',
    doctor_id: '',
    type: 'seeding',
    type_customer: '', // TRƯỜNG MỚI: type_customer
    // Thêm các trường để lưu tên hiển thị của các lựa chọn select
    company_name: '',
    doctor_name: '',
    interactive_proof_name: '', // Tên fanpage hiển thị
    type_customer_name: '', // TRƯỜNG MỚI: Tên hiển thị của type_customer
  };
  const [form, setForm] = useState(initial);
  const [companyList, setCompanyList] = useState([]);
  const dataFanpage = [
    { id: 1, name: 'BS Lucas Hoàng', link: 'https://www.facebook.com/profile.php?id=61566337224475' },
    { id: 2, name: 'BS Henry', link: 'https://www.facebook.com/drhenrykangnam' },
    { id: 3, name: 'BS Felix', link: 'https://www.facebook.com/drfelixtrankangnam' },
    { id: 4, name: 'Bác sỹ Henry Nguyễn', link: 'https://www.facebook.com/Bacsihenrynguyenx' },
    { id: 5, name: 'BS Victo Vũ', link: 'https://www.facebook.com/DrVictorVuBVTMKangNam' },
    { id: 6, name: 'BS Edward Nguyễn', link: 'https://www.facebook.com/bacsiedwardnguyenkangnam' },
    { id: 7, name: 'BS Felix Trần', link: 'https://www.facebook.com/DrFelixTranBVTMKangnam' },
    { id: 8, name: 'Bác sĩ Annie Lê', link: 'https://www.facebook.com/DrAnnieLeTruongkhoaBenhvienRHMParis/about_contact_and_basic_info' },
    { id: 9, name: 'Bác sĩ Aniie Seeding', link: 'https://www.facebook.com/dr.AnnieLe.truongkhoaRHMParis/' },
  ];
  const [fanpageList, setFanpageList] = useState([...dataFanpage]);
  const [doctorList, setDoctorList] = useState([]);

  // TRƯỜNG MỚI: Data cho Type Customer
  const dataTypeCustomer = [
    { id: 'marketing', name: 'Marketing - Việt kiều' },
    { id: 'branch', name: 'Chi nhánh - Việt Kiều' },
    { id: 'mkt_oversea', name: 'Marketing - Quốc tế' },
    { id: 'branch_oversea', name: 'Chi nhánh - Quốc tế' },
  ];
  const [typeCustomerList, setTypeCustomerList] = useState([...dataTypeCustomer]);


  const [valueFCompany, setValueFCompany] = useState('');
  const [valueFDoctor, setValueFDoctor] = useState('');
  const [valueFFanpage, setValueFFanpage] = useState('');
  // TRƯỜNG MỚI: Giá trị tìm kiếm cho Type Customer
  const [valueFTypeCustomer, setValueFTypeCustomer] = useState('');


  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isFanpageOpen, setIsFanpageOpen] = useState(false);
  // TRƯỜNG MỚI: Trạng thái mở/đóng cho Type Customer
  const [isTypeCustomerOpen, setIsTypeCustomerOpen] = useState(false);


  const queryClient = useQueryClient();

  const queryGetCompany = useQuery({
    queryKey: ['get-company', token],
    queryFn: () => getCompanyFn(token),
    onSuccess: (data) => {
      setCompanyList(data.data.data);
    },
    enabled: !!token, // Chỉ chạy query nếu token tồn tại
  });

  const queryGetDoctor = useQuery({
    queryKey: ['get-doctor', token],
    queryFn: () => getDoctorFn(token),
    onSuccess: (data) => {
      setDoctorList(data.data.data);
    },
    enabled: !!token, // Chỉ chạy query nếu token tồn tại
  });

  const queryCreateForm = useQuery({
    queryKey: ['create-form'],
    queryFn: () => createFormFn(form),
    enabled: false, // Query này sẽ được kích hoạt thủ công khi submit
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-form'] });
      loading();
      setForm(initial); // Reset form sau khi submit thành công
      hide(); // Ẩn modal
      toast('Thêm mới thành công', 'success');
    },
    onError: (error) => {
      loading(); // Ẩn loading ngay cả khi có lỗi
      toast(`Lỗi: ${error.message}`, 'error');
    }
  });

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handelSubmit = () => {
    const noteStringLength = form.note.length;
    // Cập nhật điều kiện kiểm tra các trường bắt buộc
    if (!form.name || !form.phone || !form.service || !form.company_id || !form.type_customer) {
      toast('Vui lòng điền các trường bắt buộc', 'warning');
      return;
    } else if (noteStringLength > 100) {
      toast(`Bạn vui lòng nhập dưới 100 ký tự! Số ký tự hiện tại: ${noteStringLength}. `, 'warning');
      return;
    } else {
      loading(); // Hiển thị loading trước khi gửi form
      queryCreateForm.refetch(); // Kích hoạt query tạo form
    }
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
      setCompanyList(filtered);
    } else if (type === 'doctor') {
      setValueFDoctor(valueTarget);
      const filtered = queryGetDoctor.data?.data?.data.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      ) || [];
      setDoctorList(filtered);
    } else if (type === 'fanpage') {
      setValueFFanpage(valueTarget);
      const filtered = dataFanpage.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      );
      setFanpageList(filtered);
    } else if (type === 'type_customer') { // TRƯỜNG MỚI: Tìm kiếm Type Customer
      setValueFTypeCustomer(valueTarget);
      const filtered = dataTypeCustomer.filter((item) =>
        normalizeString(item.name).includes(valueNonBind)
      );
      setTypeCustomerList(filtered);
    }
  };

  // Handlers để xóa tìm kiếm trong SelectFields
  const handleClearSearch = (type) => {
    if (type === 'company') {
      setValueFCompany('');
      setCompanyList(queryGetCompany.data?.data?.data || []);
    } else if (type === 'doctor') {
      setValueFDoctor('');
      setDoctorList(queryGetDoctor.data?.data?.data || []);
    } else if (type === 'fanpage') {
      setValueFFanpage('');
      setFanpageList([...dataFanpage]);
    } else if (type === 'type_customer') { // TRƯỜNG MỚI: Xóa tìm kiếm Type Customer
      setValueFTypeCustomer('');
      setTypeCustomerList([...dataTypeCustomer]);
    }
  };

  // Handlers để chọn một item trong SelectFields
  const handleSelectCompany = (code, name) => {
    setForm((prev) => ({ ...prev, company_id: code, company_name: name }));
  };

  const handleSelectDoctor = (id, name) => {
    setForm((prev) => ({ ...prev, doctor_id: id, doctor_name: name }));
  };

  const handleSelectFanpage = (id, name, link) => {
    setForm((prev) => ({ ...prev, interactive_proof_id: id, interactive_proof_name: name, interactive_proof: link }));
  };

  // Hàm để hủy bỏ lựa chọn Fanpage
  const clearFanpageSelection = () => {
    setForm((prev) => ({ ...prev, interactive_proof_id: '', interactive_proof_name: '', interactive_proof: '' }));
  };

  // TRƯỜNG MỚI: Chọn Type Customer
  const handleSelectTypeCustomer = (id, name) => {
    setForm((prev) => ({ ...prev, type_customer: id, type_customer_name: name }));
  };

  // Hàm chuyển đổi trạng thái mở/đóng của SelectFields
  const toggleCompany = () => setIsCompanyOpen((prev) => !prev);
  const toggleDoctor = () => setIsDoctorOpen((prev) => !prev);
  const toggleFanpage = () => setIsFanpageOpen((prev) => !prev);
  // TRƯỜNG MỚI: Chuyển đổi Type Customer
  const toggleTypeCustomer = () => setIsTypeCustomerOpen((prev) => !prev);


  // Hàm đóng SelectFields (cũng reset tìm kiếm và danh sách)
  const closeCompanySelect = useCallback(() => {
    setValueFCompany('');
    setIsCompanyOpen(false);
    if (queryGetCompany.data?.data?.data) {
      setCompanyList(queryGetCompany.data.data.data);
    }
  }, [queryGetCompany.data]);

  const closeDoctorSelect = useCallback(() => {
    setValueFDoctor('');
    setIsDoctorOpen(false);
    if (queryGetDoctor.data?.data?.data) {
      setDoctorList(queryGetDoctor.data.data.data);
    }
  }, [queryGetDoctor.data]);

  const closeFanpageSelect = useCallback(() => {
    setValueFFanpage('');
    setIsFanpageOpen(false);
    setFanpageList([...dataFanpage]);
  }, []);

  // TRƯỜNG MỚI: Đóng Type Customer Select
  const closeTypeCustomerSelect = useCallback(() => {
    setValueFTypeCustomer('');
    setIsTypeCustomerOpen(false);
    setTypeCustomerList([...dataTypeCustomer]);
  }, []);


  const refCompany = useRef(null);
  const refDoctor = useRef(null);
  const refFanpage = useRef(null);
  // TRƯỜNG MỚI: Ref cho Type Customer
  const refTypeCustomer = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideCompany = refCompany.current && refCompany.current.contains(event.target);
      const clickedInsideDoctor = refDoctor.current && refDoctor.current.contains(event.target);
      const clickedInsideFanpage = refFanpage.current && refFanpage.current.contains(event.target);
      // TRƯỜNG MỚI: Click ngoài Type Customer
      const clickedInsideTypeCustomer = refTypeCustomer.current && refTypeCustomer.current.contains(event.target);


      // Đóng select cụ thể nếu click ở bên ngoài và nó đang mở
      if (!clickedInsideCompany && isCompanyOpen) {
        closeCompanySelect();
      }
      if (!clickedInsideDoctor && isDoctorOpen) {
        closeDoctorSelect();
      }
      if (!clickedInsideFanpage && isFanpageOpen) {
        closeFanpageSelect();
      }
      // TRƯỜNG MỚI: Đóng Type Customer nếu click ngoài
      if (!clickedInsideTypeCustomer && isTypeCustomerOpen) {
        closeTypeCustomerSelect();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    refCompany,
    refDoctor,
    refFanpage,
    refTypeCustomer, // TRƯỜNG MỚI
    isCompanyOpen,
    isDoctorOpen,
    isFanpageOpen,
    isTypeCustomerOpen, // TRƯỜNG MỚI
    closeCompanySelect,
    closeDoctorSelect,
    closeFanpageSelect,
    closeTypeCustomerSelect, // TRƯỜNG MỚI
  ]);

  return isShow && element === 'ModalCreateForm'
    ? ReactDOM.createPortal(
      <>
        <Modal title="Thêm mới" hide={hide} size="large">
          <div className={styles['note']}>
            <span className={styles['require']}>(*)</span> : trường bắt buộc
          </div>
          <div className={styles['group']}>
            <InputField
              label="Họ tên"
              name="name"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
            <InputField
              label="Số điện thoại"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange('phone')}
              required
            />
          </div>
          <div className={styles['group']}>
            <InputField
              label="Dịch vụ"
              name="service"
              value={form.service}
              onChange={handleChange('service')}
              required
            />
            <SelectField
              label="Chi nhánh"
              fieldRef={refCompany}
              value={form.company_name} // Hiển thị tên chi nhánh
              options={companyList}
              onSelect={handleSelectCompany}
              onSearch={(e) => handleSearch(e, 'company')}
              searchValue={valueFCompany}
              onClearSearch={() => handleClearSearch('company')}
              isOpen={isCompanyOpen}
              toggleOpen={toggleCompany}
              closeSelect={closeCompanySelect}
              required
              displayKey="name"
              valueKey="code" // 'code' là ID của chi nhánh
              placeholder="Chọn chi nhánh"
            />
          </div>
          <div className={styles['group']}>
            <SelectField
              label="Bác sĩ"
              fieldRef={refDoctor}
              value={form.doctor_name} // Hiển thị tên bác sĩ
              options={doctorList}
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
              label="Tên Facebook"
              name="name_fb"
              value={form.name_fb}
              onChange={handleChange('name_fb')}
            />
          </div>
          <div className={styles['group']}>
            <InputField
              label="Link Facebook"
              name="link_fb"
              value={form.link_fb}
              onChange={handleChange('link_fb')}
            />
            <InputField
              label="Kịch bản"
              name="script"
              value={form.script}
              onChange={handleChange('script')}
            />
          </div>
          <div className={styles['group']}>
            <SelectField
              label="Link Fanpage Bác sĩ"
              fieldRef={refFanpage}
              value={form.interactive_proof_name || ''} // Hiển thị tên fanpage đã chọn
              options={fanpageList}
              onSelect={handleSelectFanpage}
              onSearch={(e) => handleSearch(e, 'fanpage')}
              searchValue={valueFFanpage}
              onClearSearch={() => handleClearSearch('fanpage')}
              isOpen={isFanpageOpen}
              toggleOpen={toggleFanpage}
              closeSelect={closeFanpageSelect}
              displayKey="name"
              valueKey="id"
              secondValueKey="link" // Truyền thêm link fanpage
              placeholder="Chọn Fanpage Bác sĩ"
              clearSelection={clearFanpageSelection} // Cho phép hủy lựa chọn fanpage
            />
            {/* TRƯỜNG MỚI: Select cho Type Customer */}
            <SelectField
              label="Loại khách hàng"
              fieldRef={refTypeCustomer}
              value={form.type_customer_name}
              options={typeCustomerList}
              onSelect={handleSelectTypeCustomer}
              onSearch={(e) => handleSearch(e, 'type_customer')}
              searchValue={valueFTypeCustomer}
              onClearSearch={() => handleClearSearch('type_customer')}
              isOpen={isTypeCustomerOpen}
              toggleOpen={toggleTypeCustomer}
              closeSelect={closeTypeCustomerSelect}
              required
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
              value={form.note}
              onChange={handleChange('note')}
              rows={3}
            />
          </div>
          <div className={styles['submit']}>
            <Button classItem="primary" event={handelSubmit}>
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