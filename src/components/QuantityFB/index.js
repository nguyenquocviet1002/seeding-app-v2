import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import quantityFBStyles from './QuantityFB.module.scss';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  getDaysOfMonth,
  getDaysOfWeek,
  getDaysOfYear,
  removeFirstItem,
  removeLastItem,
  tokenName,
} from '@/utils/config';
import { useQuery } from '@tanstack/react-query';
import { getFormFn } from '@/api/form';
import { getBookingFn } from '@/api/booking';
import { quantityDate, quantityWeek, quantityWeekForBrand, quantityYear } from '@/utils/quantityFB';
import Loading from '../Loading';
import { getAllUserFn } from '@/api/user';
import SelectUser from '../SelectUser';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      suggestedMax: 10,
    },
  },
};

const QuantityFB = () => {
  const [token] = useLocalStorage(tokenName, null);
  const initialDate = getDaysOfWeek();
  const [allUser, setAllUser] = useState([]);
  const [typeLabel, setTypeLabel] = useState({ label: 'Nhân viên', code: '' });
  const [bodyForm, setBodyForm] = useState({
    brand_id: '',
    type: 'seeding',
    limit: '',
    offset: '',
    company_id: '',
    name_fb: '',
    phone: '',
    service: '',
    name: '',
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user_seeding: typeLabel.code,
    token: token,
  });
  const [bodyBooking, setBodyBooking] = useState({
    token: token,
    type: 'opportunity',
    check: 'seeding',
    limit: '',
    offset: '',
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    name: '',
    phone: '',
    code: '',
    user_seeding: typeLabel.code,
  });

  const [data, setData] = useState();
  const [table, setTable] = useState();
  const [isActive, setIsActive] = useState('week');
  const [type, setType] = useState('week');
  const [dateInput, setDateInput] = useState({ startDate: '', endDate: '' });
  const [isDate, setIsDate] = useState(false);

  const queryGetForm = useQuery({
    queryKey: ['get-form', bodyForm],
    queryFn: () => getFormFn(bodyForm),
  });
  const queryGetBooking = useQuery({
    queryKey: ['get-booking', bodyBooking],
    queryFn: () => getBookingFn(bodyBooking),
  });
  useQuery({
    queryKey: ['get-all-user', token],
    queryFn: () => getAllUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setAllUser(removeFirstItem(data.data.data));
    },
  });

  useEffect(() => {
    try {
      if (type === 'week') {
        if (queryGetForm.isSuccess && queryGetBooking.isSuccess) {
          const date = getDaysOfWeek();
          setBodyForm((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          const data = quantityWeek(
            initialDate.firstDay,
            initialDate.lastDay,
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setData(data);

          const table = quantityWeekForBrand(
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setTable(table);
        }
      }
      if (type === 'month') {
        if (queryGetForm.isSuccess && queryGetBooking.isSuccess) {
          const date = getDaysOfMonth();
          setBodyForm((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          const data = quantityDate(
            date.firstDay,
            date.lastDay,
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setData(data);

          const table = quantityWeekForBrand(
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setTable(table);
        }
      }
      if (type === 'year') {
        if (queryGetForm.isSuccess && queryGetBooking.isSuccess) {
          const date = getDaysOfYear();
          setBodyForm((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          const data = quantityYear(
            date.firstDay,
            date.lastDay,
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setData(data);

          const table = quantityWeekForBrand(
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setTable(table);
        }
      }
      if (type === 'date') {
        if (queryGetForm.isSuccess && queryGetBooking.isSuccess) {
          setBodyForm((prev) => ({ ...prev, start_date: dateInput.startDate, end_date: dateInput.endDate }));
          setBodyBooking((prev) => ({ ...prev, start_date: dateInput.startDate, end_date: dateInput.endDate }));
          const data = quantityDate(
            dateInput.startDate,
            dateInput.endDate,
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setData(data);

          const table = quantityWeekForBrand(
            removeFirstItem(queryGetForm.data.data.data),
            removeLastItem(removeFirstItem(queryGetBooking.data.data.data)),
          );
          setTable(table);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    initialDate.firstDay,
    initialDate.lastDay,
    queryGetBooking.data,
    queryGetForm.data,
    type,
    queryGetForm.isSuccess,
    queryGetBooking.isSuccess,
    dateInput,
  ]);

  const handleActive = (type) => {
    setIsActive(type);
  };
  const handleTab = (type) => {
    setType(type);
  };
  const setUser = (e) => {
    setTypeLabel({ label: e.target.textContent, value: e.target.id });
    setBodyForm((prev) => ({ ...prev, user_seeding: e.target.id }));
    setBodyBooking((prev) => ({ ...prev, user_seeding: e.target.id }));
  };
  return (
    <>
      <div className={quantityFBStyles['top']}>
        <div className={quantityFBStyles['head']}>
          <div className={quantityFBStyles['title']}>Số Lượng Form/Booking</div>
          <div className={quantityFBStyles['action']}>
            <button
              className={`${quantityFBStyles['cta']} ${isActive === 'week' ? quantityFBStyles['active'] : ''}`}
              onClick={() => {
                handleTab('week');
                handleActive('week');
                setIsDate(false);
              }}
            >
              Tuần
            </button>
            <button
              className={`${quantityFBStyles['cta']} ${isActive === 'month' ? quantityFBStyles['active'] : ''}`}
              onClick={() => {
                handleTab('month');
                handleActive('month');
                setIsDate(false);
              }}
            >
              Tháng
            </button>
            <button
              className={`${quantityFBStyles['cta']} ${isActive === 'year' ? quantityFBStyles['active'] : ''}`}
              onClick={() => {
                handleTab('year');
                handleActive('year');
                setIsDate(false);
              }}
            >
              Năm
            </button>
            <button
              className={`${quantityFBStyles['cta']} ${isActive === 'date' ? quantityFBStyles['active'] : ''}`}
              onClick={() => {
                handleActive('date');
                setIsDate(true);
              }}
            >
              Khoảng ngày
            </button>
            <SelectUser labelIndex={typeLabel} data={allUser} eventClick={setUser} />
          </div>
        </div>
        {isDate && (
          <div className={quantityFBStyles['date']}>
            <div className={quantityFBStyles['date__group']}>
              <label className={quantityFBStyles['date__label']}>Ngày bắt đầu</label>
              <input
                type="date"
                className={quantityFBStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className={quantityFBStyles['date__group']}>
              <label className={quantityFBStyles['date__label']}>Ngày kết thúc</label>
              <input
                type="date"
                className={quantityFBStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <button className={quantityFBStyles['date__submit']} onClick={() => handleTab('date')}>
              Tìm
            </button>
          </div>
        )}
      </div>
      <div className={quantityFBStyles['main']}>
        <div className={quantityFBStyles['chart']}>{data && <Bar options={options} data={data} />}</div>
        <div className={quantityFBStyles['table']}>
          {table && (
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Thương hiệu</th>
                  <th>Form</th>
                  <th>Booking</th>
                </tr>
              </thead>
              <tbody>
                {table.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.form}</td>
                    <td>{item.booking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {queryGetForm.isLoading && <Loading />}
    </>
  );
};

export default QuantityFB;
