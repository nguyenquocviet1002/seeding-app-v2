import http from './http';

export const getTargetFn = (body) => {
  return http.get(`/get-target?token=${body.token}&user_seeding=${body.user_seeding}`);
};

export const createTargetFn = (body) => {
  return http.get(
    `/create-target?token=${body.token}&kpi_date=${body.kpi_date}&kpi_target=${body.kpi_target}&user_seeding=${body.user_seeding}`,
  );
};

export const updateTargetFn = (body) => {
  return http.get(
    `/update-target?token=${body.token}&id=${body.id}&kpi_date=${body.kpi_date}&kpi_target=${body.kpi_target}&user_seeding=${body.user_seeding}`,
  );
};
