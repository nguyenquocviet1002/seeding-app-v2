
import { images } from '../assets/images.jsx';

export const MENU = (role) => {
  if (role === 'admin') {
    return [
      {
        link: 'form',
        title: 'Form',
        icon: images.table_solid,
      },
      {
        link: 'lead-booking',
        title: 'Lead/Booking',
        icon: images.calendar_regular,
      },
      {
        link: 'quantity-fb',
        title: 'Báo cáo số lượng form/booking',
        icon: images.chart_column_solid,
      },
      {
        link: 'quantity-success',
        title: 'Báo cáo số lượng khách hàng thành công',
        icon: images.chart_line_solid,
      },
      {
        link: 'expense',
        title: 'Báo cáo chi phí',
        icon: images.sack_dollar_solid,
      },
      {
        link: 'staff',
        title: 'Nhân viên',
        icon: images.user_group_solid,
      },
      {
        link: 'check-data',
        title: 'Kiểm tra dữ liệu',
        icon: images.database_solid,
      },
    ];
  } else {
    return [
      {
        link: 'form',
        title: 'Form',
        icon: images.table_solid,
      },
      {
        link: 'lead-booking',
        title: 'Lead/Booking',
        icon: images.calendar_regular,
      },
      {
        link: 'quantity-fb',
        title: 'Báo cáo số lượng form/booking',
        icon: images.chart_column_solid,
      },
      {
        link: 'quantity-success',
        title: 'Báo cáo số lượng khách hàng thành công',
        icon: images.chart_line_solid,
      },
      {
        link: 'expense',
        title: 'Báo cáo chi phí',
        icon: images.sack_dollar_solid,
      },
      {
        link: 'check-data',
        title: 'Kiểm tra dữ liệu',
        icon: images.database_solid,
      },
    ];
  }
};
