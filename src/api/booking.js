import http from './http';

export const getBookingFn = async (body) => {
  return await http.get(
    `/get-booking?token=${body.token}&type=${body.type}&check=${body.check}&limit=${body.limit}&offset=${body.offset}&start_date=${body.start_date}&end_date=${body.end_date}&name=${body.name}&phone=${body.phone}&code=${body.code}&user_seeding=${body.user_seeding}`,
  );
};
