import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useModal } from '../../hooks/useModal';
import { removeFirstItem, removeLastItem, tokenName } from '../../utils/config';
import { getBookingFn } from '../../api/booking';
import { getNameFn } from '../../api/user';
import dayjs from 'dayjs';
import Button from '../Button';
import Select from '../Select';
import Table from '../Table';
import ModalSearchBooking from '../ModalSearchBooking';
import ModalDetailBooking from '../ModalDetailBooking';
import Loading from '../Loading';
import bookingStyles from './Booking.module.scss';
import { images } from '../../assets/images.jsx';

const Booking = () => {
  const [token] = useLocalStorage(tokenName, null);
  const { isShowing, cpn, toggle } = useModal();

  const initial = {
    token: token,
    type: 'opportunity',
    check: 'seeding',
    limit: 10,
    offset: 0,
    start_date: '',
    end_date: '',
    name: '',
    phone: '',
    code: '',
    user_seeding: '',
  };
  const label = [
    { label: 'Booking', value: 'opportunity' },
    { label: 'Lead', value: 'lead' },
  ];

  const [body, setBody] = useState(initial);
  const [totalRows, setTotalRows] = useState(0);
  const [typeLabel, setTypeLabel] = useState({ label: 'Booking', value: 'opportunity' });
  const [itemDetail, setItemDetail] = useState();
  const [filter, setFilter] = useState();
  const [user, setUser] = useState({});

  const queryGetBooking = useQuery({
    queryKey: ['get-booking', body],
    queryFn: () => getBookingFn(body),
    onSuccess: (data) => {
      if (data.data.type === 'access_token') {
        return;
      } else if (data.data.type === 'access_token_not_found') {
        return;
      } else {
        setTotalRows(data.data.data[0].count_no_limit);
      }
    },
  });

  const queryGetName = useQuery({
    queryKey: ['get-name', token],
    queryFn: () => getNameFn(token),
    onSuccess: (data) => {
      if (data.data.type === 'access_token') {
        return;
      } else if (data.data.type === 'access_token_not_found') {
        return;
      } else {
        setUser(data.data.data);
      }
    },
  });

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
      selector: (row) => dayjs(row.booking_date).format('DD/MM/YYYY'),
      omit: typeLabel.value === 'lead' ? true : false,
      grow: 0.8,
    },
    {
      name: 'Hiệu lực đến',
      selector: (row) => dayjs(row.day_expire).format('DD/MM/YYYY'),
      omit: typeLabel.value === 'lead' ? true : false,
      grow: 0.8,
    },
    {
      name: 'Trạng thái hiệu lực',
      selector: (row) => row.effect,
      omit: typeLabel.value === 'lead' ? true : false,
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.stage_id,
      grow: 0.8,
    },
    {
      name: 'Nhân viên',
      selector: (row) => row.name_user_seeding,
      sortable: true,
      omit: queryGetName.isSuccess && user.rule === 'user' ? true : false,
      grow: 0.5,
    },
    {
      name: 'Xem thêm',
      cell: (row) => (
        <Button classItem="outline" event={() => detailForm(row.id, 'ModalDetailBooking')}>
          Chi tiết
        </Button>
      ),
      right: true,
      grow: 0.5,
    },
  ];

  const detailForm = (id, modal) => {
    const item = queryGetBooking.data.data.data.filter((item) => item.id === id);
    setItemDetail(item[0]);
    setTimeout(() => {
      toggle(modal);
    }, 100);
  };

  const setType = (e) => {
    setTypeLabel({ label: e.target.textContent, value: e.target.id });
    setBody((prev) => ({ ...prev, type: e.target.id }));
  };

  const submitSearch = (value) => {
    setBody({ ...body, ...value });
    setFilter(value);
  };

  const removeFilter = () => {
    setBody(initial);
    setFilter();
  };

  const handlePageChange = (page) => {
    setBody({ ...body, offset: (page - 1) * body.limit });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setBody({ ...body, limit: newPerPage, offset: (page - 1) * newPerPage });
  };

  return (
    <>
      <div className={bookingStyles['inner']}>
        <div className={bookingStyles['head']}>
          <div className={bookingStyles['top']}>
            <div className={bookingStyles['title']}>Danh Sách Booking</div>
            <div className={bookingStyles['action']}>
              {filter && (
                <Button classItem="danger" event={removeFilter}>
                  Xóa bộ lọc
                </Button>
              )}
              <Button classItem="primary" icon={images.magnifying_glass_solid} event={() => toggle('ModalSearchBooking')}>
                Tìm kiếm
              </Button>
              <Select labelIndex={typeLabel} data={label} eventClick={setType} />
            </div>
          </div>
          {filter && (
            <div className={bookingStyles['filter']}>
              <p className={bookingStyles['filter__title']}>Kết quả tìm kiếm cho: </p>
              <div className={bookingStyles['filter__box']}>
                {filter.name && <span className={bookingStyles['filter__item']}>Họ tên: {filter.name}</span>}
                {filter.phone && <span className={bookingStyles['filter__item']}>Số điện thoại: {filter.phone}</span>}
                {filter.service && <span className={bookingStyles['filter__item']}>Dịch vụ: {filter.service}</span>}
                {filter.name_fb && <span className={bookingStyles['filter__item']}>Tên FB: {filter.name_fb}</span>}
                {filter.company_name && (
                  <span className={bookingStyles['filter__item']}>Chi nhánh: {filter.company_name}</span>
                )}
                {filter.name_seeding && (
                  <span className={bookingStyles['filter__item']}>Tên nhân viên: {filter.name_seeding}</span>
                )}
                {filter.start_date && (
                  <span className={bookingStyles['filter__item']}>
                    Ngày bắt đầu: {dayjs(filter.start_date).format('DD/MM/YYYY')}
                  </span>
                )}
                {filter.end_date && (
                  <span className={bookingStyles['filter__item']}>
                    Ngày kết thúc: {dayjs(filter.end_date).format('DD/MM/YYYY')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={bookingStyles['table']}>
          <Table
            columns={columns}
            data={
              queryGetBooking.isSuccess && queryGetBooking.data.data.count > 1
                ? removeLastItem(removeFirstItem(queryGetBooking.data.data.data))
                : []
            }
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
          />
        </div>
      </div>
      <ModalSearchBooking isShow={isShowing} hide={toggle} element={cpn} event={submitSearch} />
      <ModalDetailBooking isShow={isShowing} hide={toggle} element={cpn} data={itemDetail} />
      {queryGetBooking.isLoading && <Loading />}
    </>
  );
};

export default Booking;
