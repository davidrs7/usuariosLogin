export interface EmployeeBasicDTO {
    id: number;
    departmentName: string;
    jobName: string;
    colorHex: string;
    name: string;
    cellPhone: string;
    email: string;
    photoUrl: string;
    pages: number;
};

export interface EmployeeCriteriaDTO {
  departmentId?: number;
  name?: string;
  doc?: string;
  page: number;
  activePaginator: boolean;
};

export interface EmployeeDTO {
  id: number;
  department: string;
  jobId: number;
  jobName?: string;
  jobProfile?: string;
  generalId?: number;
  academicId?: number;
  statusId: number;
  statusName?: string;
  maritalStatusId?: number;
  maritalStatusName?: string;
  docTypeId: number;
  docTypeName?: string;
  docIssueCityId?: number;
  docIssueCityName?: string;
  contractTypeId: number;
  contractTypeName?: string;
  jobCityId?: number;
  jobCityName?: string;
  bankingEntityId?: number;
  bankingEntityName?: string;
  doc: string;
  docIssueDate?: Date;
  name: string;
  sex: string;
  birthDate?: Date;
  rh: string;
  corpCellPhone: string;
  cellPhone: string;
  phone: string;
  email: string;
  employmentDate?: Date;
  bankAccount: string;
  bankAccountType: string;
  hasVaccine: boolean;
  vaccineMaker: string;
  vaccineDose: number;
  hasVaccineBooster: boolean;
  photoUrl?: string;
  colorHex: string;
  photo?: File;
};

export interface EmployeeGeneralDTO {
  id: number;
  employeeId: number;
	cityId: number;
	cityName: string;
	housingTypeId: number;
	housingTypeName?: string;
	transportationId: number;
	transportationName?: string;
	emergencyContactName: string;
	emergencyContactPhone: string;
	emergencyContactRelationship: string;
	dependents: number;
	dependentsUnder9: number;
  dependentBirthDate?: Date;
	address: string;
	neighborhood: string;
	housingTime: number;
	socioeconomicStatus: number;
  licensePlate: string;
  vehicleMark: string;
  vehicleModel: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseValidity?: Date;
  soatExpirationDate?: Date;
  rtmExpirationDate?: Date;
  vehicleOwnerName: string;
  contributorType: string;
	eps: string;
	arl: string;
	afp: string;
	recommendedBy: string;
	description: string;
}

export interface EmployeeAcademicDTO {
  id: number;
  employeeId: number;
	educationalLevelId: number;
	educationalLevelName?: string;
	career: string;
}

export interface EmployeeSkillDTO {
  employeeId: number;
  skillId: number;
  skillName: string;
  active: boolean;
  rate: number;
  inserted: boolean;
  updated: boolean;
  exist: boolean;
}

export interface EmployeeKnowledgeDTO {
  employeeId: number;
  knowledgeId: number;
  knowledgeName: string;
  active: boolean;
  rate: number;
  inserted: boolean;
  updated: boolean;
  exist: boolean;
}

export interface EmployeeFileTypeDTO {
  id: number;
  levelId: number;
	name: string;
}

export interface EmployeeFileDTO {
  id: number;
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

export interface EmployeeDownloadDTO {
  id: number;
  jobName: string;
  departmentName: string;
  statusName: string;
  maritalStatusName: string;
  docTypeName: string;
  docIssueCityName: string;
  contractTypeName: string;
  bankingEntityName: string;
  jobCityName: string;
  doc: string;
  docIssueDate: Date;
  name: string;
  sex: string;
  birthDate: Date;
  rh: string;
  corpCellPhone: string;
  cellPhone: string;
  phone: string;
  email: string;
  employmentDate: Date;
  bankAccount: string;
  bankAccountType: string;
  hasVaccine: boolean;
  vaccineMaker: string;
  vaccineDose: number;
  hasVaccineBooster: boolean;
  cityName: string;
  housingTypeName: string;
  transportationName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  address: string;
  neighborhood: string;
  housingTime: number;
  socioeconomicStatus: number;
  licensePlate: string;
  vehicleMark: string;
  vehicleModel: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseValidity: Date;
  soatExpirationDate: Date;
  rtmExpirationDate: Date;
  vehicleOwnerName: string;
  contributorType: string;
  eps: string;
  arl: string;
  afp: string;
  recommendedBy: string;
  description: string;
  educationalLevelName: string;
  career: string;
}
/*
*Almacena Hijos, fecha de nacimiento y el calculo de la edad
*/
export interface EmployeeSonsDTO{
  id?: number;
  employeeGeneralId?: number;
  sonBornDate?: Date;
  sonName?: string;
  age?: number;
}
