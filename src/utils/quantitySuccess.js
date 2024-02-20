export const successWeek = (dataReportBooking) => {
  const all = [];
  const kn = [];
  const pr = [];
  const da = [];
  const hh = [];
  for (let i = 0; i < dataReportBooking.length; i++) {
    all.push(dataReportBooking[i].sl_ngay);
    kn.push(dataReportBooking[i].kn);
    pr.push(dataReportBooking[i].pr);
    da.push(dataReportBooking[i].da);
    hh.push(dataReportBooking[i].hh);
  }
  const data = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    datasets: [
      {
        label: 'Tất cả',
        data: all,
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
      },
      {
        label: 'Kangnam',
        data: kn,
        backgroundColor: '#ff9f40',
        borderColor: '#ff9f40',
        hidden: true,
      },
      {
        label: 'Đông Á',
        data: da,
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
        hidden: true,
      },
      {
        label: 'Hồng Hà',
        data: hh,
        backgroundColor: '#9966ff',
        borderColor: '#9966ff',
        hidden: true,
      },
      {
        label: 'Paris',
        data: pr,
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
        hidden: true,
      },
    ],
  };
  return data;
};

export const successDate = (dataReportBooking) => {
  const all = [];
  const kn = [];
  const pr = [];
  const da = [];
  const hh = [];
  const labels = [];
  for (let i = 0; i < dataReportBooking.length; i++) {
    all.push(dataReportBooking[i].sl_ngay);
    kn.push(dataReportBooking[i].kn);
    pr.push(dataReportBooking[i].pr);
    da.push(dataReportBooking[i].da);
    hh.push(dataReportBooking[i].hh);
    labels.push(
      `${new Date(dataReportBooking[i].date).getDate()}/${new Date(dataReportBooking[i].date).getMonth() + 1}`,
    );
  }
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Tất cả',
        data: all,
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
      },
      {
        label: 'Kangnam',
        data: kn,
        backgroundColor: '#ff9f40',
        borderColor: '#ff9f40',
        hidden: true,
      },
      {
        label: 'Đông Á',
        data: da,
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
        hidden: true,
      },
      {
        label: 'Hồng Hà',
        data: hh,
        backgroundColor: '#9966ff',
        borderColor: '#9966ff',
        hidden: true,
      },
      {
        label: 'Paris',
        data: pr,
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
        hidden: true,
      },
    ],
  };
  return data;
};

export const customerSuccess = (dataReport) => {
  return {
    so_luong: dataReport.sort((a, b) => b.so_luong - a.so_luong),
    tong_tien: dataReport.sort((a, b) => b.tong_tien - a.tong_tien),
  };
};
