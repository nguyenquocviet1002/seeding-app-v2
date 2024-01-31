export const MENU = (role) => {
  if (role === 'admin') {
    return [
      {
        link: 'form',
        title: 'Form',
        icon: 'table-solid.svg',
      },
      {
        link: 'lead-booking',
        title: 'Lead/Booking',
        icon: 'calendar-regular.svg',
      },
      {
        link: 'quantity-fb',
        title: 'Báo cáo số lượng form/booking',
        icon: 'chart-column-solid.svg',
      },
      {
        link: 'quantity-success',
        title: 'Báo cáo số lượng khách hàng thành công',
        icon: 'chart-line-solid.svg',
      },
      {
        link: 'expense',
        title: 'Báo cáo chi phí',
        icon: 'sack-dollar-solid.svg',
      },
      {
        link: 'staff',
        title: 'Nhân viên',
        icon: 'user-group-solid.svg',
      },
      {
        link: 'check-data',
        title: 'Kiểm tra dữ liệu',
        icon: 'database-solid.svg',
      },
    ];
  } else {
    return [
      {
        link: 'form',
        title: 'Form',
        icon: 'table-solid.svg',
      },
      {
        link: 'lead-booking',
        title: 'Lead/Booking',
        icon: 'calendar-regular.svg',
      },
      {
        link: 'quantity-fb',
        title: 'Báo cáo số lượng form/booking',
        icon: 'chart-column-solid.svg',
      },
      {
        link: 'quantity-success',
        title: 'Báo cáo số lượng khách hàng thành công',
        icon: 'chart-line-solid.svg',
      },
      {
        link: 'expense',
        title: 'Báo cáo chi phí',
        icon: 'sack-dollar-solid.svg',
      },
      {
        link: 'check-data',
        title: 'Kiểm tra dữ liệu',
        icon: 'database-solid.svg',
      },
    ];
  }
};
