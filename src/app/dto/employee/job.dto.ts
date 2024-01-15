export interface JobBasicDTO {
    id: number;
    name: string;
    employees: number;
    employeesInprocess: number;
};

export interface JobDTO {
  id: number;
  departmentId: number;
  departmentName?: string;
  approveId: number;
  reportId: number;
  name: string;
  profile: string;
  functions: string;
};
