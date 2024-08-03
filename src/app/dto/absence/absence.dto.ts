export interface AbsenceDTO {
    id: number;
    absenceTypeId: number;
    absenceTypeName?: string;
    userId: number;
    userName?: string;
    userEmployeeName?: string;
    userPhotoUrl?: string;
    employeeId: number;
    employeeName?: string;
    employeePhotoUrl?: string;
    jobId: number;
    jobName?: string;
    departmentId?: number;
    departmentName?: string;
    reportJobId: number;
    created?: Date;
    updated?: Date;
    started: Date;
    finished: Date;
    businessDays: number;
    active: number;
    status: number;
    description?: string;
    approvalQuantity: number;
    statusClass?: string;
    statusName?: string;
}

export interface AbsenceUserDTO {
    id: number;
    userName: string;
    employeeId?: number;
    name?: string;
    jobId?: number;
    jobName?: string;
    departmentId?: number;
    departmentName?: string;
    cityId?: number;
    cityName?: string;
    reportJobId?: number;
    reportJobName?: string;
    photoUrl?: string;
};

export interface AbsenceApprovalDTO {
    id: number;
    absenceId: number;
    userId: number;
    userName?: string;
    userEmployeeName?: string;
    userPhotoUrl?: string;
    created?: Date;
    updated?: Date;
    approval: number;
    description?: string;
    isHRApproval: number;
}

export interface AbsenceFileDTO {
  id: number;
  absenceId: number;
  employeeId: number;
  department: string;
  name: string;
  city: string;
  level1: string;
  level2: string;
  level3: string;
  fileName: string;
  url: string;
  document?: File;
}
