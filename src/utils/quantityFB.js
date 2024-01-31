export const quantityWeek = (startDate, endDate, dataForm, dataBooking) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  const dayArr = [];
  const arrForm = [];
  const arrBooking = [];
  dateArray.forEach((item) => {
    dayArr.push(`${new Date(item).getDate()}/${new Date(item).getMonth() + 1}`);
    const dateArrForm = [];
    for (let i = 0; i < dataForm.length; i++) {
      if (new Date(dataForm[i].create_date).toDateString() === new Date(item).toDateString()) {
        dateArrForm.push(dataForm[i]);
      }
    }
    arrForm.push(dateArrForm.length);

    const dateArrBooking = [];
    for (let i = 0; i < dataBooking.length; i++) {
      if (new Date(dataBooking[i].create_date).toDateString() === new Date(item).toDateString()) {
        dateArrBooking.push(dataBooking[i]);
      }
    }
    arrBooking.push(dateArrBooking.length);
  });
  const data = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    datasets: [
      {
        label: 'Form',
        data: arrForm,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Booking',
        data: arrBooking,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return data;
};

export const quantityDate = (startDate, endDate, dataForm, dataBooking) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  const dayArr = [];
  const arrForm = [];
  const arrBooking = [];
  dateArray.forEach((item) => {
    dayArr.push(`${new Date(item).getDate()}/${new Date(item).getMonth() + 1}`);
    const dateArrForm = [];
    for (let i = 0; i < dataForm.length; i++) {
      if (new Date(dataForm[i].create_date).toDateString() === new Date(item).toDateString()) {
        dateArrForm.push(dataForm[i]);
      }
    }
    arrForm.push(dateArrForm.length);

    const dateArrBooking = [];
    for (let i = 0; i < dataBooking.length; i++) {
      if (new Date(dataBooking[i].create_date).toDateString() === new Date(item).toDateString()) {
        dateArrBooking.push(dataBooking[i]);
      }
    }
    arrBooking.push(dateArrBooking.length);
  });
  const data = {
    labels: dayArr,
    datasets: [
      {
        label: 'Form',
        data: arrForm,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Booking',
        data: arrBooking,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return data;
};

export const quantityYear = (startDate, endDate, dataForm, dataBooking) => {
  const labelArr = [];
  const dateArray = [];
  let currentDate = new Date(startDate);
  for (let i = currentDate.getMonth() + 1; i <= new Date(endDate).getMonth() + 1; i++) {
    dateArray.push(i);
    labelArr.push('Tháng ' + i);
  }

  const arrForm = [];
  const arrBooking = [];
  dateArray.forEach((item) => {
    const dateArrForm = [];
    for (let i = 0; i < dataForm.length; i++) {
      if (new Date(dataForm[i].create_date).getMonth() + 1 === item) {
        dateArrForm.push(dataForm[i]);
      }
    }
    arrForm.push(dateArrForm.length);

    const dateArrBooking = [];
    for (let i = 0; i < dataBooking.length; i++) {
      if (new Date(dataBooking[i].create_date).getMonth() + 1 === item) {
        dateArrBooking.push(dataBooking[i]);
      }
    }
    arrBooking.push(dateArrBooking.length);
  });
  const data = {
    labels: labelArr,
    datasets: [
      {
        label: 'Form',
        data: arrForm,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Booking',
        data: arrBooking,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return data;
};

export const quantityWeekForBrand = (dataForm, dataBooking) => {
  let formKN = 0;
  let formPR = 0;
  let formDA = 0;
  let formHH = 0;
  for (let i = 0; i < dataForm.length; i++) {
    if (dataForm[i].brand === 'KN') {
      formKN++;
    }
    if (dataForm[i].brand === 'PR') {
      formPR++;
    }
    if (dataForm[i].brand === 'DA') {
      formDA++;
    }
    if (dataForm[i].brand === 'HH') {
      formHH++;
    }
  }

  let bookingKN = 0;
  let bookingPR = 0;
  let bookingDA = 0;
  let bookingHH = 0;
  for (let i = 0; i < dataBooking.length; i++) {
    if (dataBooking[i].brand === 'Kangnam') {
      bookingKN++;
    }
    if (dataBooking[i].brand === 'Paris') {
      bookingPR++;
    }
    if (dataBooking[i].brand === 'Đông Á') {
      bookingDA++;
    }
    if (dataBooking[i].brand === 'Hồng Hà') {
      bookingHH++;
    }
  }

  return [
    {
      name: 'Kangnam',
      form: formKN,
      booking: bookingKN,
    },
    {
      name: 'Paris',
      form: formPR,
      booking: bookingPR,
    },
    {
      name: 'Đông Á',
      form: formDA,
      booking: bookingDA,
    },
    {
      name: 'Hồng Hà',
      form: formHH,
      booking: bookingHH,
    },
  ];
};
