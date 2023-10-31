import http from './http';

export const getFormFn = async (body) => {
  return await http.get(`/get-form?
  token=${body.token}&
  brand_id=${body.brand_id}&
  type=${body.type}&
  limit=${body.limit}&
  offset=${body.offset}&
  company_id=${body.company_id}&
  name_fb=${body.name_fb}&
  phone=${body.phone}&
  service=${body.service}&
  name=${body.name}&
  start_date=${body.start_date}&
  end_date=${body.end_date}&
  user_seeding=${body.user_seeding}`);
};
