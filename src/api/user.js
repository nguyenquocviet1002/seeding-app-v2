import http from './http';

export const getNameFn = async (token) => {
  return await http.get(`/get-name?token=${token}`);
};

export const getUserFn = (body) => {
  return http.get(`/get-user?token=${body.token}&code_user=${body.code_user}`);
};

export const updatePasswordFn = async (body) => {
  return await http.get(`/update-password?token=${body.token}&password=${body.password}`);
};

export const updateActiveUserFn = (body) => {
  return http.get(`/update-active-user?token=${body.token}&code_user=${body.code_user}&active=${body.active}`);
};

export const updatePasswordMemberFn = (body) => {
  return http.get(`/update-password-member?token=${body.token}&login=${body.login}&password=${body.password}`);
};
