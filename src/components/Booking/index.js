import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import Button from '../Button';
import Table from '../Table';
import ModalSearchForm from '../ModalSearchForm';
import ModalDetailBooking from '../ModalDetailBooking';
import Select from '../Select';
import formStyles from './Booking.module.scss';

const data = [
  {
    id: 1,
    sale_create: '001',
    contact_name: 'Name1',
    name_user_seeding: 'Name1',
    link: 'https://home.base.vn/home',
    phone_1: '001',
    service: 'service1',
    company: 'company1',
    effect: 'done',
    stage_id: 'done',
    user: 'user1',
    date: 'date1',
  },
  {
    id: 2,
    sale_create: '002',
    contact_name: 'Name2',
    name_user_seeding: 'Name1',
    link: 'https://home.base.vn/home',
    phone_1: '002',
    service: 'service2',
    company: 'company2',
    effect: 'done',
    stage_id: 'done',
    user: 'user2',
    date: 'date2',
  },
];

const Booking = () => {
  const [itemDetail, setItemDetail] = useState();
  const [label] = useState([
    { label: 'Booking', value: 'opportunity' },
    { label: 'Booking 2', value: 'opportunity 2' },
  ]);
  const [typeLabel, setTypeLabel] = useState(label[0]);
  const { isShowing, cpn, toggle } = useModal();
  const columns = [
    {
      name: 'NV Sale',
      selector: (row) => row.sale_create,
      sortable: true,
    },
    {
      name: 'Họ và tên',
      selector: (row) => row.contact_name,
      sortable: true,
    },
    {
      name: 'Điện thoại',
      selector: (row) => row.phone_1,
    },
    {
      name: 'Ngày hẹn lịch',
      selector: (row) => row.date,
    },
    {
      name: 'Hiệu lực đến',
      selector: (row) => row.date,
    },
    {
      name: 'Trạng thái hiệu lực',
      selector: (row) => row.effect,
      grow: 0.6,
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.stage_id,
    },
    {
      name: 'Nhân viên',
      selector: (row) => row.name_user_seeding,
      sortable: true,
    },
    {
      name: 'Xem thêm',
      cell: (row) => (
        <Button classItem="outline" event={() => detailForm(row.id, 'ModalDetailBooking')}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailForm = (id, modal) => {
    const item = data.filter((item) => item.id === id);
    setItemDetail(item[0]);
    setTimeout(() => {
      toggle(modal);
    }, 0);
  };

  const setType = (e) => {
    setTypeLabel({ label: e.target.textContent, value: e.target.id });
  };

  return (
    <>
      <div className={formStyles['inner']}>
        <div className={formStyles['head']}>
          <div className={formStyles['top']}>
            <div className={formStyles['title']}>Danh Sách Booking</div>
            <div className={formStyles['action']}>
              <Button classItem="primary" icon="magnifying-glass-solid.svg" event={() => toggle('ModalSearchForm')}>
                Tìm kiếm
              </Button>
              <Select labelIndex={typeLabel} data={label} event={setType} />
            </div>
          </div>
        </div>
        <div className={formStyles['table']}>
          <Table columns={columns} data={data} />
        </div>
      </div>
      <ModalSearchForm isShow={isShowing} hide={toggle} element={cpn} />
      <ModalDetailBooking isShow={isShowing} hide={toggle} element={cpn} data={itemDetail} />
    </>
  );
};

export default Booking;
