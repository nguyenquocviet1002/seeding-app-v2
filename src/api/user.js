import http from './http';

export const getUserFn = async (token) => {
  return await http.get(`/get-name?token=${token}`);
};

export const getAllUserFn = (body) => {
  return http.get(`/get-user?token=${body.token}&code_user=${body.code_user}`);
};

export const updatePasswordFn = async (body) => {
  return await http.get(`/update-password?token=${body.token}&password=${body.password}`);
};
