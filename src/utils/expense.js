export const expenseCustomerSuccess = (data) => {
  return data.sort((a, b) => b.tong_tien - a.tong_tien);
};

export const expenseRevenueSuccessWeek = (data, type) => {
  const all = [];
  const kn = [];
  const pr = [];
  const da = [];
  const hh = [];
  const date = [];
  for (let i = 0; i < data.length; i++) {
    all.push(data[i].tong_tien_all_day);
    kn.push(data[i].tong_tien_KN);
    pr.push(data[i].tong_tien_PR);
    da.push(data[i].tong_tien_DA);
    hh.push(data[i].tong_tien_HN);
    date.push(`${new Date(data[i].date).getDate()}/${new Date(data[i].date).getMonth() + 1}`);
  }
  return {
    labels: type === 'week' ? ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'] : date,
    datasets: [
      {
        label: 'Tất cả',
        data: all,
        backgroundColor: '#ff6384',
      },
      {
        label: 'Kangnam',
        data: kn,
        backgroundColor: '#ff9f40',
      },
      {
        label: 'Đông Á',
        data: da,
        backgroundColor: '#4bc0c0',
      },
      {
        label: 'Hồng Hà',
        data: hh,
        backgroundColor: '#9966ff',
      },
      {
        label: 'Paris',
        data: pr,
        backgroundColor: '#36a2eb',
      },
    ],
  };
};

export const expenseRevenueSuccessYear = (data, startDate, endDate) => {
  const labelArr = [];
  const dateArray = [];
  let currentDate = new Date(startDate);
  for (let i = currentDate.getMonth() + 1; i <= new Date(endDate).getMonth() + 1; i++) {
    dateArray.push(i);
    labelArr.push('Tháng ' + i);
  }
  const arrAll = [];
  const arrDA = [];
  const arrHH = [];
  const arrKN = [];
  const arrPR = [];
  dateArray.forEach((item) => {
    let all = 0;
    let da = 0;
    let hh = 0;
    let kn = 0;
    let pr = 0;
    for (let i = 0; i < data.length; i++) {
      if (new Date(data[i].date).getMonth() + 1 === item) {
        all += data[i].tong_tien_all_day;
        da += data[i].tong_tien_DA;
        hh += data[i].tong_tien_HN;
        kn += data[i].tong_tien_KN;
        pr += data[i].tong_tien_PR;
      }
    }
    arrAll.push(all);
    arrDA.push(da);
    arrHH.push(hh);
    arrKN.push(kn);
    arrPR.push(pr);
  });
  return {
    labels: labelArr,
    datasets: [
      {
        label: 'Tất cả',
        data: arrAll,
        backgroundColor: '#ff6384',
      },
      {
        label: 'Kangnam',
        data: arrKN,
        backgroundColor: '#ff9f40',
      },
      {
        label: 'Đông Á',
        data: arrDA,
        backgroundColor: '#4bc0c0',
      },
      {
        label: 'Hồng Hà',
        data: arrHH,
        backgroundColor: '#9966ff',
      },
      {
        label: 'Paris',
        data: arrPR,
        backgroundColor: '#36a2eb',
      },
    ],
  };
};
