export interface VacantDTO {
    id: number;
    postulateId?: number;
    vacantStatusId: number;
    vacantStatusName?: string;
    contractTypeId: number;
    contractTypeName?: string;
    jobId: number;
    jobName?: string;
    jobColorHex?: string;
    userId: number;
    created?: Date;
    updated?: Date;
    vacantNum: number;
    description?: string;
    vacantsCount?: number;
    employeesCount?: number;
    active?: number;
}
