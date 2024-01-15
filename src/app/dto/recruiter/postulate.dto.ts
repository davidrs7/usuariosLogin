export interface PostulateBasicDTO {
    id: number;
    educationalLevelName: string;
    expectedSalary: number;
    colorHex: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string;
	career?: string;
    description?: string;
    photoUrl: string;
    pages: number;
    active?: number;
};

export interface PostulateCriteriaDTO {
  vacantId?: number;
  name?: string;
  doc?: string;
  page: number;
  activePaginator: boolean;
};

export interface PostulateDTO {
    id: number;
    recruiterUserId: number;
    findOutId: number;
    findOutName?: string;
    docTypeId: number;
    docTypeName?: string;
	educationalLevelId: number;
	educationalLevelName?: string;
    offeredSalary?: number;
    expectedSalary: number;
    doc: string;
    firstName: string;
    lastName: string;
    sex?: string;
    birthDate?: Date;
    rh?: string;
    cellPhone?: string;
    phone?: string;
    email?: string;
	career?: string;
    description?: string;
    photoUrl?: string;
    colorHex?: string;
    photo?: File;
}
