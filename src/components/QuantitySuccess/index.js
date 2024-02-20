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
import { getDaysOfMonth, getDaysOfWeek, removeFirstItem, removeLastItem, tokenName } from '@/utils/config';
import { getAllUserFn } from '@/api/user';
import { getReportBookingFn, getReportFn } from '@/api/report';
import { customerSuccess, successDate, successWeek } from '@/utils/quantitySuccess';
import Loading from '../Loading';

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
  const [table, setTable] = useState();
  const [bodyReportBooking, setBodyReportBooking] = useState({
    token: token,
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user: typeLabel.code,
  });
  const [bodyReport, setBodyReport] = useState({
    token: token,
    brand_id: '',
    group_service:
      'PR000003, PRP00002, PR000005, PR000006, PR000007, PRP00004, PRP00006, PRP00007, DAP00010, DAP00007, DAP00014, DAP00005, DAP00017, DAP00015, DAP00011, DAP00012, DAPL0002, DAPL0003, DAP00008, KNP00001, KNP00002, KNP00003, KNP00004, KNP00005, KNP00006, KNP00007, KNP00008, KNP00009, KNP00010, KNP00011, KNP00013, KNPL0027, HP011, HP013, HP002, HP014, HP005, HP007, HP012, HP018, HP008, HP030, HP031, HP032, KN00S046, PRP00005',
    limit: '',
    offset: '',
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user_seeding: typeLabel.code,
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

  const queryReport = useQuery({
    queryKey: ['get-report', bodyReport],
    queryFn: () => getReportFn(bodyReport),
  });

  useEffect(() => {
    try {
      if (type === 'week') {
        if (queryReportBooking.isSuccess && queryReport.isSuccess) {
          const date = getDaysOfWeek();
          setBodyReportBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyReport((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const data = successWeek(removeLastItem(queryReportBooking.data.data.data));
          const table = customerSuccess(removeLastItem(queryReport.data.data.data));
          setData(data);
          setTable(table.so_luong);
        }
      }
      if (type === 'month') {
        if (queryReportBooking.isSuccess && queryReport.isSuccess) {
          const date = getDaysOfMonth();
          setBodyReportBooking((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyReport((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const data = successDate(removeLastItem(queryReportBooking.data.data.data));
          const table = customerSuccess(removeLastItem(queryReport.data.data.data));
          setData(data);
          setTable(table.so_luong);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    initialDate.firstDay,
    initialDate.lastDay,
    queryReport.data,
    queryReport.isSuccess,
    queryReportBooking.data,
    queryReportBooking.isSuccess,
    type,
  ]);

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
        <div style={{ width: '50%' }}>
          {table && (
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Dịch vụ</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {table.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.group_service}</td>
                    <td>{item.so_luong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {queryReport.isLoading && <Loading />}
    </>
  );
};

export default QuantitySuccess;
