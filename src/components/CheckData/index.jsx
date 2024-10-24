import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useModal } from '../../hooks/useModal';
import { tokenName } from '../../utils/config';
import { getCheckSeedingFn } from '../../api/report';
import dayjs from 'dayjs';
import Button from '../Button';
import Table from '../Table';
import Loading from '../Loading';
import ModalTotalPrice from '../ModalTotalPrice';
import ModalService from '../ModalService';
import checkDataStyles from './CheckData.module.scss';

const CheckData = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [token] = useLocalStorage(tokenName, null);
  const { isShowing, cpn, toggle } = useModal();

  const initial = {
    token: token,
    start_date: '',
    end_date: '',
    phone: '',
    user_seeding: '',
  };

  const [body, setBody] = useState(initial);
  const [filter, setFilter] = useState();
  const [valueInput, setValueInput] = useState('');
  const [valueDate, setValueDate] = useState('');
  const [dataTotalPrice, setDataTotalPrice] = useState([]);
  const [dataService, setDataService] = useState([]);

  const columns = [
    {
      name: 'Mã booking',
      selector: (row) => row.bk_code,
    },
    {
      name: 'Tên khách hàng',
      selector: (row) => row.name,
    },
    {
      name: 'Số điện thoại',
      selector: (row) => row.phone_1,
    },
    {
      name: 'Nhân viên sale',
      selector: (row) => row.sale_create,
    },
    {
      name: 'Doanh số',
      cell: (row) =>
        row.doanh_so.length > 0 ? (
          <Button
            classItem="outline"
            event={() => {
              setDataTotalPrice(row.doanh_so);
              toggle('ModalTotalPrice');
            }}
          >
            Xem thêm
          </Button>
        ) : (
          'Trống'
        ),
    },
    {
      name: 'Dịch vụ',
      cell: (row) =>
        row.dich_vu.length > 0 ? (
          <Button
            classItem="outline"
            event={() => {
              setDataService(row.dich_vu);
              toggle('ModalService');
            }}
          >
            Xem thêm
          </Button>
        ) : (
          'Trống'
        ),
    },
  ];

  const queryCheckSeeding = useQuery({
    queryKey: ['check-seeding', body],
    queryFn: () => getCheckSeedingFn(body),
  });

  const handleChangeInput = (event) => {
    setValueInput(event.target.value);
  };

  const handleChangeDate = (event) => {
    setValueDate(event.target.value);
  };

  const submitSearch = () => {
    if (valueInput) {
      setBody((prev) => ({ ...prev, phone: valueInput }));
      setFilter((prev) => ({ ...prev, phone: valueInput }));
    }
    if (valueDate) {
      setBody((prev) => ({
        ...prev,
        start_date: dayjs(new Date(valueDate).setDate(new Date(valueDate).getDate() - 1)).format('YYYY-MM-DD'),
        end_date: dayjs(valueDate).format('YYYY-MM-DD'),
      }));
      setFilter((prev) => ({ ...prev, date: valueDate }));
    }
  };

  const removeFilter = () => {
    setBody(initial);
    setFilter();
    setValueInput('');
    setValueDate('');
  };

  return (
    <>
      <div className={checkDataStyles['inner']}>
        <div className={checkDataStyles['head']}>
          <div className={checkDataStyles['top']}>
            <div className={checkDataStyles['title']}>Danh Sách Dữ Liệu Trùng</div>
            <div className={checkDataStyles['action']}>
              <input
                type="text"
                className={checkDataStyles['inputSearch']}
                placeholder="Tìm theo số điện thoại..."
                onChange={handleChangeInput}
                value={valueInput}
              />
              <input
                type="date"
                className={checkDataStyles['dateSearch']}
                onChange={handleChangeDate}
                value={valueDate}
              />
              <Button classItem="primary" event={submitSearch}>
                Tìm kiếm
              </Button>
              {filter && (
                <Button classItem="danger" event={removeFilter}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
          {filter && (
            <div className={checkDataStyles['filter']}>
              <p className={checkDataStyles['filter__title']}>Kết quả tìm kiếm cho: </p>
              <div className={checkDataStyles['filter__box']}>
                {filter.phone && <span className={checkDataStyles['filter__item']}>Số điện thoại: {filter.phone}</span>}
                {filter.date && (
                  <span className={checkDataStyles['filter__item']}>
                    Ngày: {dayjs(filter.date).format('DD/MM/YYYY')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={checkDataStyles['table']}>
          <Table
            columns={columns}
            data={
              queryCheckSeeding.isSuccess && queryCheckSeeding.data.data.count > 0
                ? queryCheckSeeding.data.data.data
                : []
            }
          />
        </div>
      </div>
      <ModalTotalPrice isShow={isShowing} hide={toggle} element={cpn} data={dataTotalPrice} />
      <ModalService isShow={isShowing} hide={toggle} element={cpn} data={dataService} />
      {queryCheckSeeding.isLoading && (
        <>
          <Loading />
          <button
            className={checkDataStyles['cancel']}
            onClick={(e) => {
              e.preventDefault();
              queryClient.cancelQueries(['check-data', token]);
              navigate(-1);
            }}
          >
            Thoát
          </button>
        </>
      )}
    </>
  );
};

export default CheckData;
