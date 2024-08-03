export interface ConfigurationItemDTO {
    configKey: string;
    userId: number;
    updated: Date;
    value1: string;
    value2: string;
    listType: string;
    listItem: string;
    listValue: string;
};

export interface ConfigurationDTO {
    configKey: string;
    userId: number;
    updated: Date;
    value1: string;
    value2: string;
    listType: string;
};

export interface ConfigurationUserDTO {
    id: number;
    userName: string;
    employeeId: number;
    name: string;
    photoUrl: string;
    jobId: number;
    jobName: string;
    departmentId: number;
    departmentName: string;
    isSelected: number;
    insert?: boolean;
};
