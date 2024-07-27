import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeeBasicDTO, EmployeeDTO, EmployeeSkillDTO, EmployeeKnowledgeDTO, EmployeeGeneralDTO, EmployeeAcademicDTO, EmployeeFileTypeDTO, EmployeeFileDTO, EmployeeCriteriaDTO, EmployeeDownloadDTO, EmployeeSonsDTO } from '../../dto/employee/employee.dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl: string = environment.apiUrl + 'Employee/';

  constructor(private http: HttpClient) { }

  private stringValue(value: any): string {
    return (value != null && value != undefined) ? value.toString() : null;
  }

  private getGenericFormData(employee: EmployeeDTO): FormData {
    var formData = new FormData();

    formData.append("jobId", this.stringValue(employee.jobId));
    formData.append("statusId", this.stringValue(employee.statusId));
    formData.append("docTypeId", this.stringValue(employee.docTypeId));
    formData.append("contractTypeId", this.stringValue(employee.contractTypeId));
    formData.append("hasVaccine", this.stringValue(employee.hasVaccine));
    formData.append("vaccineDose", this.stringValue(employee.vaccineDose));
    formData.append("hasVaccineBooster", this.stringValue(employee.hasVaccineBooster));

    formData.append("doc", this.stringValue(employee.doc));
    formData.append("name", this.stringValue(employee.name));
    formData.append("sex", this.stringValue(employee.sex));
    formData.append("rh", this.stringValue(employee.rh));
    formData.append("corpCellPhone", this.stringValue(employee.corpCellPhone));
    formData.append("cellPhone", this.stringValue(employee.cellPhone));
    formData.append("phone", this.stringValue(employee.phone));
    formData.append("email", this.stringValue(employee.email));
    formData.append("bankAccount", this.stringValue(employee.bankAccount));
    formData.append("bankAccountType", this.stringValue(employee.bankAccountType));
    formData.append("vaccineMaker", this.stringValue(employee.vaccineMaker));

    if(employee.maritalStatusId != null)
      formData.append("maritalStatusId", this.stringValue(employee.maritalStatusId));
    if(employee.docIssueCityId != null)
      formData.append("docIssueCityId", this.stringValue(employee.docIssueCityId));
    if(employee.jobCityId != null)
      formData.append("jobCityId", this.stringValue(employee.jobCityId));
    if(employee.bankingEntityId != null)
      formData.append("bankingEntityId", this.stringValue(employee.bankingEntityId));

    if(employee.birthDate != null)
      formData.append("birthDate", this.stringValue(employee.birthDate));
    if(employee.employmentDate != null)
      formData.append("employmentDate", this.stringValue(employee.employmentDate));
    if(employee.docIssueDate != null)
      formData.append("docIssueDate", this.stringValue(employee.docIssueDate));

    if(employee.photo != null) {
      const fileToUpload = employee.photo as File;
      formData.append("photo", fileToUpload, employee.doc);
    }
    return formData;
  }

  private getGenericFormDataGeneral(employeeGeneral: EmployeeGeneralDTO): FormData {
    var formData = new FormData();

    formData.append("cityId", this.stringValue(employeeGeneral.cityId));
    formData.append("housingTypeId", this.stringValue(employeeGeneral.housingTypeId));
    formData.append("dependents", this.stringValue(employeeGeneral.dependents));
    formData.append("dependentsUnder9", this.stringValue(employeeGeneral.dependentsUnder9));
    formData.append("housingTime", this.stringValue(employeeGeneral.housingTime));
    formData.append("socioeconomicStatus", this.stringValue(employeeGeneral.socioeconomicStatus));
    formData.append("transportationId", this.stringValue(employeeGeneral.transportationId));

    formData.append("employeeId", this.stringValue(employeeGeneral.employeeId));
    formData.append("emergencyContactName", this.stringValue(employeeGeneral.emergencyContactName));
    formData.append("emergencyContactPhone", this.stringValue(employeeGeneral.emergencyContactPhone));
    formData.append("emergencyContactRelationship", this.stringValue(employeeGeneral.emergencyContactRelationship));
    formData.append("address", this.stringValue(employeeGeneral.address));
    formData.append("neighborhood", this.stringValue(employeeGeneral.neighborhood));
    formData.append("eps", this.stringValue(employeeGeneral.eps));
    formData.append("arl", this.stringValue(employeeGeneral.arl));
    formData.append("afp", this.stringValue(employeeGeneral.afp));
    formData.append("recommendedBy", this.stringValue(employeeGeneral.recommendedBy));
    formData.append("description", this.stringValue(employeeGeneral.description));

    formData.append("licensePlate", this.stringValue(employeeGeneral.licensePlate));
    formData.append("vehicleMark", this.stringValue(employeeGeneral.vehicleMark));
    formData.append("vehicleModel", this.stringValue(employeeGeneral.vehicleModel));
    formData.append("licenseNumber", this.stringValue(employeeGeneral.licenseNumber));
    formData.append("licenseCategory", this.stringValue(employeeGeneral.licenseCategory));
    formData.append("vehicleOwnerName", this.stringValue(employeeGeneral.vehicleOwnerName));
    formData.append("contributorType", this.stringValue(employeeGeneral.contributorType));

    if(employeeGeneral.dependentBirthDate != null)
      formData.append("dependentBirthDate", this.stringValue(employeeGeneral.dependentBirthDate));
    if(employeeGeneral.licenseValidity != null)
      formData.append("licenseValidity", this.stringValue(employeeGeneral.licenseValidity));
    if(employeeGeneral.rtmExpirationDate != null)
      formData.append("rtmExpirationDate", this.stringValue(employeeGeneral.rtmExpirationDate));
    if(employeeGeneral.soatExpirationDate != null)
      formData.append("soatExpirationDate", this.stringValue(employeeGeneral.soatExpirationDate));

    return formData;
  }

  private getGenericFormDataAcademic(employeeAcademic: EmployeeAcademicDTO): FormData {
    var formData = new FormData();
    formData.append("educationalLevelId", this.stringValue(employeeAcademic.educationalLevelId));
    formData.append("employeeId", this.stringValue(employeeAcademic.employeeId));
    formData.append("career", this.stringValue(employeeAcademic.career));
    return formData;
  }

  private getGenericFormDataCriteria(employeeCriteria: EmployeeCriteriaDTO): FormData {


    var formData = new FormData();
    formData.append("departmentId", this.stringValue(employeeCriteria.departmentId));
    formData.append("name", this.stringValue(employeeCriteria.name || ''));
    formData.append("doc", this.stringValue(employeeCriteria.doc || ''));
    formData.append("page", this.stringValue(employeeCriteria.page));
    formData.append("activePaginator", employeeCriteria.activePaginator ? 'true' : 'false');
    return formData;
  }

  employeesEndpoint(employeeCriteria: EmployeeCriteriaDTO) {
    var formData = this.getGenericFormDataCriteria(employeeCriteria);
    return this.http.post<EmployeeBasicDTO[]>(this.baseUrl + 'Employees/Criteria', formData);
  }

  employeesDownloadEndpoint(employeeCriteria: EmployeeCriteriaDTO) {
    var formData = this.getGenericFormDataCriteria(employeeCriteria);
    return this.http.post<EmployeeDownloadDTO[]>(this.baseUrl + 'Employees/Download', formData);
  }

  employeesWithoutPagesEndpoint(excludeEmployeeId: number) {
    if(excludeEmployeeId == null)
      excludeEmployeeId = 0;
    return this.http.get<EmployeeBasicDTO[]>(this.baseUrl + 'EmployeesWithoutPages/' + excludeEmployeeId);
  }

  employeeEndpoint(employeeId: number) {
    return this.http.get<EmployeeDTO>(this.baseUrl + employeeId.toString());
  }

  employeeGeneralEndpoint(employeeId: number) {
    return this.http.get<EmployeeGeneralDTO>(this.baseUrl + 'EmpGeneral/' + employeeId.toString());
  }

  employeeAcademicEndpoint(employeeId: number) {
    return this.http.get<EmployeeAcademicDTO>(this.baseUrl + 'Academic/' + employeeId.toString());
  }

  editEndpoint(employeeEdit: EmployeeDTO) {
    var formData = this.getGenericFormData(employeeEdit);
    formData.append("id", employeeEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit', formData);
  }

  addEndpoint(employeeAdd: EmployeeDTO) {
    var formData = this.getGenericFormData(employeeAdd);
    return this.http.post(this.baseUrl + 'Add', formData);
  }

  editGeneralEndpoint(employeeGeneralEdit: EmployeeGeneralDTO) {
    var formData = this.getGenericFormDataGeneral(employeeGeneralEdit);
    formData.append("id", employeeGeneralEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit/General', formData);
  }

  addGeneralEndpoint(employeeGeneralAdd: EmployeeGeneralDTO) {
    var formData = this.getGenericFormDataGeneral(employeeGeneralAdd);
    return this.http.post(this.baseUrl + 'Add/General', formData);
  }

  editAcademicEndpoint(employeeAcademicEdit: EmployeeAcademicDTO) {
    var formData = this.getGenericFormDataAcademic(employeeAcademicEdit);
    formData.append("id", employeeAcademicEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit/Academic', formData);
  }

  addAcademicEndpoint(employeeAcademicAdd: EmployeeAcademicDTO) {
    var formData = this.getGenericFormDataAcademic(employeeAcademicAdd);
    return this.http.post(this.baseUrl + 'Add/Academic', formData);
  }

  addFileEndpoint(employeeFile: EmployeeFileDTO, document?: File) {
    var formData = new FormData();
    formData.append("employeeId", employeeFile.employeeId.toString());
    formData.append("department", employeeFile.department);
    formData.append("city", employeeFile.city);
    formData.append("level1", employeeFile.level1);
    formData.append("level2", employeeFile.level2);
    formData.append("level3", employeeFile.level3);
    formData.append("name", employeeFile.name);

    if(document != undefined)
      formData.append("document", document);
    return this.http.post(this.baseUrl + 'Add/File', formData);
  }

  addKnowledgeEndpoint(employeeKnowledge: EmployeeKnowledgeDTO) {
    var formData = new FormData();
    formData.append("employeeId", employeeKnowledge.employeeId.toString());
    formData.append("knowledgeId", employeeKnowledge.knowledgeId.toString());
    formData.append("active", employeeKnowledge.active ? 'true' : 'false');
    formData.append("rate", employeeKnowledge.rate.toString());
    formData.append("inserted", employeeKnowledge.inserted ? 'true' : 'false');
    formData.append("updated", employeeKnowledge.updated ? 'true' : 'false');
    return this.http.post(this.baseUrl + 'Add/EmpKnowledge', formData);
  }

  addSkillEndpoint(employeeSkill: EmployeeSkillDTO) {
    var formData = new FormData();
    formData.append("employeeId", employeeSkill.employeeId.toString());
    formData.append("skillId", employeeSkill.skillId.toString());
    formData.append("active", employeeSkill.active ? 'true' : 'false');
    formData.append("rate", employeeSkill.rate.toString());
    formData.append("inserted", employeeSkill.inserted ? 'true' : 'false');
    formData.append("updated", employeeSkill.updated ? 'true' : 'false');
    return this.http.post(this.baseUrl + 'Add/EmpSkill', formData);
  }

  updateSonDataEndPoint(sonData: EmployeeSonsDTO){
    var formData=new FormData();
    formData.append("id",sonData.id!.toString());
    formData.append("sonName",sonData.sonName!.toString());
    formData.append("sonBornDate",sonData.sonBornDate!.toString());
    formData.append("EmployeeGeneralId",sonData.employeeGeneralId!.toString());
    return this.http.post(this.baseUrl + 'Add/EmpSon', formData);
  }

  deleteSonEndPoint(sonId?: number){
    var formData=new FormData();
    formData.append("id",sonId!.toString());
    return this.http.post(this.baseUrl + 'Del/EmpSon', formData);
  }

  skillsEndpoint(employeeId: number) {
    return this.http.get<EmployeeSkillDTO[]>(this.baseUrl + 'Skills/' + employeeId);
  }

  skillsNewEndpoint() {
    return this.http.get<EmployeeSkillDTO[]>(this.baseUrl + 'Skills');
  }

  knowledgesEndpoint(employeeId: number) {
    return this.http.get<EmployeeKnowledgeDTO[]>(this.baseUrl + 'Knowledges/' + employeeId);
  }

  knowledgesNewEndpoint() {
    return this.http.get<EmployeeKnowledgeDTO[]>(this.baseUrl + 'Knowledges');
  }
  /** retrive Sons data */
  sonsEndpoint(employeeId: number){
    return this.http.get<EmployeeSonsDTO[]>(this.baseUrl+'Sons/'+employeeId);

  }

  fileTypesEndpoint() {
    return this.http.get<EmployeeFileTypeDTO[]>(this.baseUrl + 'FileTypes');
  }

  filesEndpoint(employeeId: number) {
    return this.http.get<EmployeeFileDTO[]>(this.baseUrl + 'Files/' + employeeId);
  }
}
