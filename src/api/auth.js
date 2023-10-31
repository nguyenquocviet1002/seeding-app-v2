import http from './http';

export const getTokenFn = async (body) => {
  return await http.get(`/get-token?login=${body.user}&password=${body.password}`);
};
