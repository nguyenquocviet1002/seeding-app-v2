import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import expenseStyles from './Expense.module.scss';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  formatMoney,
  getDaysOfMonth,
  getDaysOfWeek,
  getDaysOfYear,
  removeAccents,
  removeFirstItem,
  removeLastItem,
  tokenName,
} from '@/utils/config';
import { useQuery } from '@tanstack/react-query';
import Loading from '../Loading';
import { getUserFn } from '@/api/user';
import SelectUser from '../SelectUser';
import { getBrandFn, getReportBrandFn, getReportFn } from '@/api/report';
import { expenseCustomerSuccess, expenseRevenueSuccessWeek, expenseRevenueSuccessYear } from '@/utils/expense';
import Select from '../Select';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const Expense = () => {
  const initialTarget = {
    kpi_now: 0,
    kpi_target: 0,
  };
  const [token] = useLocalStorage(tokenName, null);
  const initialDate = getDaysOfWeek();
  const [allUser, setAllUser] = useState([]);
  const [typeLabel, setTypeLabel] = useState({ label: 'Nhân viên', value: '' });
  const [bodyReport, setBodyReport] = useState({
    token: token,
    brand_id: '',
    group_service:
      'PR000003, PRP00002, PR000005, PR000006, PR000007, PRP00004, PRP00006, PRP00007, DAP00010, DAP00007, DAP00014, DAP00005, DAP00017, DAP00015, DAP00011, DAP00012, DAPL0002, DAPL0003, DAP00008, KNP00001, KNP00002, KNP00003, KNP00004, KNP00005, KNP00006, KNP00007, KNP00008, KNP00009, KNP00010, KNP00011, KNP00013, KNPL0027, HP011, HP013, HP002, HP014, HP005, HP007, HP012, HP018, HP008, HP030, HP031, HP032, KN00S046, PRP00005',
    limit: '',
    offset: '',
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user_seeding: typeLabel.value,
  });
  const [bodyReportBrand, setBodyReportBrand] = useState({
    token: token,
    start_date: initialDate.firstDay,
    end_date: initialDate.lastDay,
    user_seeding: typeLabel.value,
  });

  const [isActive, setIsActive] = useState('week');
  const [type, setType] = useState('week');
  const [dateInput, setDateInput] = useState({ startDate: '', endDate: '' });
  const [isDate, setIsDate] = useState(false);
  const [userFind, setUserFind] = useState({});
  const [table, setTable] = useState([]);
  const [data, setData] = useState([]);
  const [valueFilter, setValueFilter] = useState('');
  const [typeLabel2, setTypeLabel2] = useState({ label: 'Thương hiệu', code: '' });

  useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setAllUser(removeFirstItem(data.data.data));
    },
  });

  const queryReport = useQuery({
    queryKey: ['get-report', bodyReport],
    queryFn: () => getReportFn(bodyReport),
  });

  const queryGetReportBrand = useQuery({
    queryKey: ['get-report-brand', bodyReportBrand],
    queryFn: () => getReportBrandFn(bodyReportBrand),
  });

  const queryBrand = useQuery({
    queryKey: ['get-brand'],
    queryFn: () => getBrandFn(token),
  });

  useEffect(() => {
    const targetFind = allUser.filter(
      (item) => item.code_user === (typeLabel.value === '' ? 'US0000015' : typeLabel.value),
    );
    setUserFind(targetFind[0] ? targetFind[0] : initialTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUser, typeLabel]);

  useEffect(() => {
    try {
      if (type === 'week') {
        if (queryReport.isSuccess && queryGetReportBrand.isSuccess) {
          const date = getDaysOfWeek();
          setBodyReport((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyReportBrand((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const dataReport = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
          const dataReportBrand = expenseRevenueSuccessWeek(removeLastItem(queryGetReportBrand.data.data.data));

          setTable(dataReport);
          setData(dataReportBrand);
        }
      }
      if (type === 'month') {
        if (queryReport.isSuccess && queryGetReportBrand.isSuccess) {
          const date = getDaysOfMonth();
          setBodyReport((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyReportBrand((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const dataReport = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
          const dataReportBrand = expenseRevenueSuccessWeek(removeLastItem(queryGetReportBrand.data.data.data));

          setTable(dataReport);
          setData(dataReportBrand);
        }
      }
      if (type === 'year') {
        if (queryReport.isSuccess && queryGetReportBrand.isSuccess) {
          const date = getDaysOfYear();
          setBodyReport((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));
          setBodyReportBrand((prev) => ({ ...prev, start_date: date.firstDay, end_date: date.lastDay }));

          const dataReport = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
          const dataReportBrand = expenseRevenueSuccessYear(
            removeLastItem(queryGetReportBrand.data.data.data),
            date.firstDay,
            date.lastDay,
          );

          setTable(dataReport);
          setData(dataReportBrand);
        }
      }
      if (type === 'date') {
        if (queryReport.isSuccess && queryGetReportBrand.isSuccess) {
          setBodyReport((prev) => ({ ...prev, start_date: dateInput.startDate, end_date: dateInput.endDate }));
          setBodyReportBrand((prev) => ({ ...prev, start_date: dateInput.startDate, end_date: dateInput.endDate }));

          const dataReport = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
          const dataReportBrand = expenseRevenueSuccessWeek(removeLastItem(queryGetReportBrand.data.data.data));

          setTable(dataReport);
          setData(dataReportBrand);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    initialDate.firstDay,
    initialDate.lastDay,
    queryGetReportBrand.isSuccess,
    queryGetReportBrand.data,
    queryReport.isSuccess,
    queryReport.data,
    type,
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
    setBodyReport((prev) => ({ ...prev, user_seeding: e.target.id }));
    setBodyReportBrand((prev) => ({ ...prev, user_seeding: e.target.id }));
  };

  const setLabel = (e) => {
    setTypeLabel2({ label: e.target.textContent, value: e.target.id });
    setBodyReport((prev) => ({ ...prev, brand_id: e.target.id }));
  };

  const searchByName = (e) => {
    if (e.target.value) {
      setValueFilter(e.target.value);
      const result = queryReport.data.data.data.filter(
        (item) => removeAccents(item.group_service).search(removeAccents(e.target.value)) !== -1,
      );
      setTable(result.sort((a, b) => b.so_luong - a.so_luong));
    } else {
      setValueFilter('');
      const table = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
      setTable(table);
    }
  };

  const getPercent = () => {
    let percent = ((userFind.kpi_now / userFind.kpi_target) * 100).toFixed(1);
    return percent;
  };

  const dataBrand = {
    labels: data.labels,
    datasets: [
      {
        label: 'Tất cả',
        data: data.all,
        backgroundColor: '#ff6384',
      },
      {
        label: 'Kangnam',
        data: data.kn,
        backgroundColor: '#ff9f40',
      },
      {
        label: 'Đông Á',
        data: data.da,
        backgroundColor: '#4bc0c0',
      },
      {
        label: 'Hồng Hà',
        data: data.hh,
        backgroundColor: '#9966ff',
      },
      {
        label: 'Paris',
        data: data.pr,
        backgroundColor: '#36a2eb',
      },
    ],
  };

  return (
    <>
      <div className={expenseStyles['top']}>
        <div className={expenseStyles['head']}>
          <div className={expenseStyles['title']}>Báo Cáo Chi Phí</div>
          <div className={expenseStyles['action']}>
            <button
              className={`${expenseStyles['cta']} ${isActive === 'week' ? expenseStyles['active'] : ''}`}
              onClick={() => {
                handleTab('week');
                handleActive('week');
                setIsDate(false);
              }}
            >
              Tuần
            </button>
            <button
              className={`${expenseStyles['cta']} ${isActive === 'month' ? expenseStyles['active'] : ''}`}
              onClick={() => {
                handleTab('month');
                handleActive('month');
                setIsDate(false);
              }}
            >
              Tháng
            </button>
            <button
              className={`${expenseStyles['cta']} ${isActive === 'year' ? expenseStyles['active'] : ''}`}
              onClick={() => {
                handleTab('year');
                handleActive('year');
                setIsDate(false);
              }}
            >
              Năm
            </button>
            <button
              className={`${expenseStyles['cta']} ${isActive === 'date' ? expenseStyles['active'] : ''}`}
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
          <div className={expenseStyles['date']}>
            <div className={expenseStyles['date__group']}>
              <label className={expenseStyles['date__label']}>Ngày bắt đầu</label>
              <input
                type="date"
                className={expenseStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className={expenseStyles['date__group']}>
              <label className={expenseStyles['date__label']}>Ngày kết thúc</label>
              <input
                type="date"
                className={expenseStyles['date__input']}
                onChange={(e) => setDateInput((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <button className={expenseStyles['date__submit']} onClick={() => handleTab('date')}>
              Tìm
            </button>
          </div>
        )}
      </div>
      <div className={expenseStyles['main']}>
        <div className={expenseStyles['target']}>
          <div className={expenseStyles['subtitle']}>Mục Tiêu</div>
          <div className={expenseStyles['process']}>
            <div className={expenseStyles['end']}>{formatMoney(userFind.kpi_target)}</div>
            <div className={expenseStyles['back']}>
              <div className={expenseStyles['front']} style={{ width: `${getPercent() > 100 ? 100 : getPercent()}%` }}>
                <span>{getPercent()}%</span>
              </div>
            </div>
            <div className={expenseStyles['result']}>
              <div className={expenseStyles['sub']}></div>
              <span className={expenseStyles['content']}>Doanh số đã đạt: {formatMoney(userFind.kpi_now)}</span>
            </div>
            <div className={expenseStyles['result']}>
              <div className={`${expenseStyles['sub']} ${expenseStyles['sub-1']}`}></div>
              <span className={expenseStyles['content']}>
                Doanh số chưa đạt:{' '}
                {formatMoney(userFind.kpi_target - userFind.kpi_now < 0 ? 0 : userFind.kpi_target - userFind.kpi_now)}
              </span>
            </div>
          </div>
        </div>
        <div className={expenseStyles['data']}>
          <div className={expenseStyles['table']}>
            <div className={expenseStyles['subtitle']}>Mục Tiêu</div>
            <div className={expenseStyles['filter']}>
              <div className={expenseStyles['search']}>
                <input type="text" value={valueFilter} onChange={searchByName} placeholder="Tìm theo tên dịch vụ..." />
                {valueFilter && (
                  <button
                    className={expenseStyles['reset']}
                    onClick={() => {
                      setValueFilter('');
                      const table = expenseCustomerSuccess(removeLastItem(queryReport.data.data.data));
                      setTable(table);
                    }}
                  >
                    &#10005;
                  </button>
                )}
              </div>
              {queryBrand.isSuccess && (
                <Select
                  labelIndex={typeLabel2}
                  data={queryBrand.data.data.data}
                  eventClick={setLabel}
                  keyData="name"
                  code="code"
                  all={true}
                />
              )}
            </div>
            {table && (
              <div className={expenseStyles['box']}>
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
                        <td>{formatMoney(item.tong_tien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={expenseStyles['chart']}>
            <div className={expenseStyles['subtitle']}>Mục Tiêu</div>
            <Bar options={options} data={dataBrand} />
          </div>
        </div>
      </div>
      {queryReport.isLoading && queryGetReportBrand.isLoading && <Loading />}
    </>
  );
};

export default Expense;
