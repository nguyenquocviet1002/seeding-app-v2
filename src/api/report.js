import http from './http';

export const getBrandFn = async (token) => {
  return await http.get(`/get-brand?token=${token}`);
};

export const getReportBookingFn = async (body) => {
  return await http.get(
    `/get-report-booking?token=${body.token}&start_date=${body.start_date}&end_date=${body.end_date}&user_seeding=${body.user}`,
  );
};

export const getReportFn = async (body) => {
  return await http.get(
    `/get-report?token=${body.token}&brand_id=${body.brand_id}&group_service=${body.group_service}&limit=${body.limit}&offset=${body.offset}&start_date=${body.start_date}&end_date=${body.end_date}&user_seeding=${body.user_seeding}`,
  );
};

export const getCheckDataFn = async (body) => {
  return await http.get(
    `/get-check-seeding?token=${body.token}&start_date=${body.start_date}&end_date=${body.end_date}&phone=${body.phone}&user_seeding=${body.user_seeding}`,
  );
};
