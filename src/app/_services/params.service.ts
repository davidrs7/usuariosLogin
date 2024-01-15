import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParamOptionDTO, ParamsDTO } from '../dto/params.dto';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {
  private baseUrl: string = environment.apiUrl + 'ParamList/';

  constructor(private http: HttpClient) { }

  docTypeEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'DocType');
  }

  cityEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'City');
  }

  maritalStatusEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'MaritalStatus');
  }

  housingTypeEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'PrmHousingType');
  }

  educationalLevelEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'EducationalLevel');
  }

  employeeStatusEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'EmployeeStatus');
  }

  contractTypeEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'ContractType');
  }

  bankingEntityEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'BankingEntity');
  }

  transportationEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'Transportation');
  }

  vacantStatusEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'VacantStatus');
  }

  postulateFindOutEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'PostulateFindOut');
  }

  jobSkillsEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'JobSkills');
  }

  departmentEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'Department');
  }

  jobEndpoint() {
    return this.http.get<ParamsDTO[]>(this.baseUrl + 'Job');
  }

  paramsDefaultEndpoint(endpoint: string) {
    switch(endpoint) {
      case 'docType': return this.docTypeEndpoint();
      case 'city': return this.cityEndpoint();
      case 'maritalStatus': return this.maritalStatusEndpoint();
      case 'housingType': return this.housingTypeEndpoint();
      case 'educationalLevel': return this.educationalLevelEndpoint();
      case 'contractType': return this.contractTypeEndpoint();
      case 'bankingEntity': return this.bankingEntityEndpoint();
      case 'transportation': return this.transportationEndpoint();
      case 'vacantStatus': return this.vacantStatusEndpoint();
      case 'postulateFindOut': return this.postulateFindOutEndpoint();
      case 'jobSkills': return this.jobSkillsEndpoint();
      case 'department': return this.departmentEndpoint();
      case 'job': return this.jobEndpoint();
      default: return this.employeeStatusEndpoint();
    }
  }

  optionListFromParams(availableOnly?: boolean, sortByTitle?: boolean): ParamOptionDTO[] {
    var options: ParamOptionDTO[] = [
      { value: 'docType', available: true,  title: 'Tipo de documento' },
      { value: 'city', available: true,  title: 'Ciudad' },
      { value: 'maritalStatus', available: true,  title: 'Estado civil' },
      { value: 'housingType', available: true,  title: 'Tipo de vivienda' },
      { value: 'educationalLevel', available: true,  title: 'Nivel educativo' },
      { value: 'employeeStatus', available: false,  title: 'Estado del empleado' },
      { value: 'contractType', available: true,  title: 'Tipo de contrato' },
      { value: 'bankingEntity', available: true,  title: 'Entidad bancaria' },
      { value: 'transportation', available: true,  title: 'Tipo de trasporte' },
      { value: 'vacantStatus', available: false,  title: 'Estado de vacante' },
      { value: 'postulateFindOut', available: true,  title: 'Encontrado a través de...' },
      { value: 'jobSkills', available: true,  title: 'Habilidades' },
      { value: 'department', available: true,  title: 'Departamentos' },
      { value: 'job', available: true,  title: 'Cargos' }
    ];

    if(sortByTitle)
      options.sort((a, b) => (a.title > b.title) ? 1 : -1);

    if(availableOnly)
      options = options.filter((option) => option.available);

    return options;
  }

}
