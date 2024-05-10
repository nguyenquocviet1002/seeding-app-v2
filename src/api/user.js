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

export const createUserFn = (body) => {
  return http.get(
    `/create-user?token=${body.token}&name=${body.name}&phone=${body.phone}&mobile=${body.mobile}&date_of_birth=${body.date_of_birth}`,
  );
};

export const updateActiveUserFn = (body) => {
  return http.get(`/update-active-user?token=${body.token}&code_user=${body.code_user}&active=${body.active}`);
};

export const updatePasswordMemberFn = (body) => {
  return http.get(`/update-password-member?token=${body.token}&login=${body.login}&password=${body.password}`);
};
