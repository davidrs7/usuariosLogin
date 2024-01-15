export interface SurveyDTO {
    id: number;
    available: number;
    name: string;
    description: string;
    active?: number;
}

export interface SurveyHeaderDTO {
    id: number;
    surveyId?: number;
    available: number;
    name: string;
    description: string;
    started: Date;
    finished: Date;
    title: string;
    isAnswered: number;
    draft?: number;
    active?: number;
}

export interface SurveyFieldDTO {
    id: number;
    surveyId?: number;
    available: number;
    name: string;
    fieldType: string;
    isRequired: number;
    config?: string;
    active: number;
    weight: number;
    fieldValue?: string;
    inserted: boolean;
    updated: boolean;
}

export interface SurveyUserDTO {
    id: number;
    surveyId?: number;
    headerId?: number;
    responseId?: number;
    createAt?: Date;
    available?: boolean;
    userName: string;
    password: string;
    employeeId?: number;
    name?: string;
    jobName?: string;
    departmentName?: string;
    photoUrl?: string;
};

export interface SurveyUserRelDTO {
    userId?: number;
    surveyId?: number;
    headerId: number;
    paramId?: number;
};
