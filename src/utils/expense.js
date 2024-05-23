export const expenseCustomerSuccess = (data) => {
  return data.sort((a, b) => b.tong_tien - a.tong_tien);
};

export const expenseRevenueSuccessWeek = (data) => {
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
  return { all: all, kn: kn, pr: pr, da: da, hh: hh, labels: date };
};

export const expenseRevenueSuccessYear = (data, startDate, endDate) => {
  const labelArr = [];
  const dateArray = [];
  let currentDate = new Date(startDate);
  for (let i = currentDate.getMonth() + 1; i <= new Date(endDate).getMonth() + 1; i++) {
    dateArray.push(i);
    labelArr.push('Tháng ' + i);
  }
  console.log('labelArr: ', labelArr);
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
    all: arrAll,
    da: arrDA,
    hh: arrHH,
    kn: arrKN,
    pr: arrPR,
  };
};
