import dayjs from 'dayjs';

export const tokenName = 'token-seeding';

export function removeFirstItem(data) {
  try {
    const dataFinal = [];
    for (let i = 1; i < data.length; i++) {
      dataFinal.push(data[i]);
    }
    return dataFinal;
  } catch (error) {
    return [];
  }
}

export function removeLastItem(data) {
  try {
    const dataFinal = [];
    for (let i = 0; i < data.length - 1; i++) {
      dataFinal.push(data[i]);
    }
    return dataFinal;
  } catch (error) {
    return [];
  }
}

export function formatMoney(value) {
  if (value) {
    return Number(value).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  } else {
    return '0 VND';
  }
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.');
}

export function numberWithoutCommas(x) {
  return x.toString().replace(/\./g, '');
}

export function sortDate(data) {
  try {
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return [];
  }
}

export function removeAccents(str) {
  const string = str || '';
  return string
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function getDaysOfWeek() {
  try {
    const today = new Date();
    const date = new Date(today);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const firstDay = new Date(date.setDate(diff));
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    return { firstDay: dayjs(firstDay).format('YYYY-MM-DD'), lastDay: dayjs(lastDay).format('YYYY-MM-DD') };
  } catch (error) {
    return { firstDay: '', lastDay: '' };
  }
}

export function getDaysOfMonth() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay: dayjs(firstDay).format('YYYY-MM-DD'), lastDay: dayjs(lastDay).format('YYYY-MM-DD') };
  } catch (error) {
    return { firstDay: '', lastDay: '' };
  }
}

export function getDaysOfYear() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const firstDay = new Date(year, 0, 1);
    const lastDay = new Date(year, 11, 31);
    return { firstDay: dayjs(firstDay).format('YYYY-MM-DD'), lastDay: dayjs(lastDay).format('YYYY-MM-DD') };
  } catch (error) {
    return { firstDay: '', lastDay: '' };
  }
}
