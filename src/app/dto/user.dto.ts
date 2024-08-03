export interface UserDTO {
    id: number;
    createAt?: Date;
    available?: boolean;
    userName: string;
    password: string;
    employeeId?: number;
    name?: string;
    jobId?: number;

    jobName?: string;
    departmentName?: string;
    photoUrl?: string;
};

export interface SessionDTO {
    token: string;
    userId: number;
    created: Date;
    reload: Date;
    ipAddress: string;
};
