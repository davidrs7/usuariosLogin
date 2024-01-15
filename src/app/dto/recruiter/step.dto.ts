export interface StepDTO {
    id: number;
    vacantId?: number;
    postulateId?: number;
    available: number;
    name: string;
    description?: string;
    active?: number;
    weight?: number;
    isRequired?: number;
    approved?: number;
    reason?: string;
    inserted?: boolean;
    updated?: boolean;
};

export interface StepFieldDTO {
    id: number;
    stepId?: number;
    vacantId?: number;
    postulateId?: number;
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