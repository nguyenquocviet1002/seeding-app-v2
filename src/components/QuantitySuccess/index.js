import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import quantitySuccessStyles from './QuantitySuccess.module.scss';
import SelectUser from '../SelectUser';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getDaysOfWeek, removeFirstItem, removeLastItem, tokenName } from '@/utils/config';
import { getAllUserFn } from '@/api/user';
import { getReportBookingFn } from '@/api/report';
import { successByBrand } from '@/utils/quantitySuccess';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
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

const QuantitySuccess = () => {
  const [token] = useLocalStorage(tokenName, null);
  const initialDate = getDaysOfWeek();

  const [isActive, setIsActive] = useState('week');
  const [type, setType] = useState('week');
  const [isDate, setIsDate] = useState(false);
  const [dateInput, setDateInput] = useState({ startDate: '', endDate: '' });
  const [allUser, setAllUser] = useState([]);
  const [typeLabel, setTypeLabel] = useState({ label: 'Nhân viên', code: '' });
  const [data, setData] = useState();
  console.log('data: ', data);
  const [bodyReportBooking, setBodyReportBooking] = useState({
    token: token,
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user: typeLabel.code,
  });

  useQuery({
    queryKey: ['get-all-user', token],
    queryFn: () => getAllUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setAllUser(removeFirstItem(data.data.data));
    },
  });

  const queryReportBooking = useQuery({
    queryKey: ['get-report-booking', bodyReportBooking],
    queryFn: () => getReportBookingFn(bodyReportBooking),
  });

  useEffect(() => {
    try {
      if (type === 'week') {
        if (queryReportBooking.isSuccess) {
          const date = getDaysOfWeek();
          setBodyReportBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const data = successByBrand(removeLastItem(queryReportBooking.data.data.data));
          setData(data);
        }
      }
      if (type === 'month') {
        console.log(1);
      }
    } catch (error) {
      console.log(error);
    }
  }, [initialDate.firstDay, initialDate.lastDay, queryReportBooking.data, queryReportBooking.isSuccess, type]);

  const handleActive = (type) => {
    setIsActive(type);
  };

  const handleTab = (type) => {
    setType(type);
  };

  const setUser = (e) => {
    setTypeLabel({ label: e.target.textContent, value: e.target.id });
  };

  return (
    <>
      <div className={quantitySuccessStyles['top']}>
        <div className={quantitySuccessStyles['head']}>
          <div className={quantitySuccessStyles['title']}>Số Lượng Form/Booking</div>
          <div className={quantitySuccessStyles['action']}>
            <button
              className={`${quantitySuccessStyles['cta']} ${
                isActive === 'week' ? quantitySuccessStyles['active'] : ''
              }`}
              onClick={() => {
                handleTab('week');
                handleActive('week');
                setIsDate(false);
              }}
            >
              Tuần
            </button>
            <button
              className={`${quantitySuccessStyles['cta']} ${
                isActive === 'month' ? quantitySuccessStyles['active'] : ''
              }`}
              onClick={() => {
                handleTab('month');
                handleActive('month');
                setIsDate(false);
              }}
            >
              Tháng
            </button>
            <button
              className={`${quantitySuccessStyles['cta']} ${
                isActive === 'year' ? quantitySuccessStyles['active'] : ''
              }`}
              onClick={() => {
                handleTab('year');
                handleActive('year');
                setIsDate(false);
              }}
            >
              Năm
            </button>
            <button
              className={`${quantitySuccessStyles['cta']} ${
                isActive === 'date' ? quantitySuccessStyles['active'] : ''
              }`}
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
          <div className={quantitySuccessStyles['date']}>
            <div className={quantitySuccessStyles['date__group']}>
              <label className={quantitySuccessStyles['date__label']}>Ngày bắt đầu</label>
              <input
                type="date"
                className={quantitySuccessStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className={quantitySuccessStyles['date__group']}>
              <label className={quantitySuccessStyles['date__label']}>Ngày kết thúc</label>
              <input
                type="date"
                className={quantitySuccessStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <button className={quantitySuccessStyles['date__submit']} onClick={() => handleTab('date')}>
              Tìm
            </button>
          </div>
        )}
      </div>
      <div className={quantitySuccessStyles['main']}>
        <div style={{ width: '50%' }}>{data && <Line options={options} data={data} />}</div>
      </div>
    </>
  );
};

export default QuantitySuccess;
