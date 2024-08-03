import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbsenceApprovalDTO, AbsenceDTO, AbsenceFileDTO, AbsenceUserDTO } from 'src/app/dto/absence/absence.dto';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private baseUrl: string = environment.apiUrl + 'Absence/';

  constructor(private http: HttpClient) { }

  private stringValue(value: any): string {
    return (value != null && value != undefined) ? value.toString() : null;
  }

  private getGenericFormData(absence: AbsenceDTO): FormData {
    var formData = new FormData();
    formData.append("absenceTypeId", this.stringValue(absence.absenceTypeId));
    formData.append("userId", this.stringValue(absence.userId));
    formData.append("employeeId", this.stringValue(absence.employeeId));
    formData.append("jobId", this.stringValue(absence.jobId));
    formData.append("created", this.stringValue(absence.created));
    formData.append("updated", this.stringValue(absence.updated));
    formData.append("started", this.stringValue(absence.started));
    formData.append("finished", this.stringValue(absence.finished));
    formData.append("businessDays", this.stringValue(absence.businessDays));
    formData.append("active", this.stringValue(absence.active));
    formData.append("status", this.stringValue(absence.status));
    formData.append("description", this.stringValue(absence.description));
    formData.append("approvalQuantity", this.stringValue(absence.approvalQuantity));
    return formData;
  }

  private getGenericApprovalFormData(approval: AbsenceApprovalDTO): FormData {
    var formData = new FormData();
    formData.append("absenceId", this.stringValue(approval.absenceId));
    formData.append("userId", this.stringValue(approval.userId));
    formData.append("created", this.stringValue(approval.created));
    formData.append("updated", this.stringValue(approval.updated));
    formData.append("approval", this.stringValue(approval.approval));
    formData.append("description", this.stringValue(approval.description));
    formData.append("isHRApproval", this.stringValue(approval.isHRApproval));
    return formData;
  }

  userListEndpoint(userId: number) {
    return this.http.get<AbsenceUserDTO[]>(this.baseUrl + 'Users/' + userId.toString());
  }

  userEndpoint(employeeId: number) {
    return this.http.get<AbsenceUserDTO>(this.baseUrl + 'User/' + employeeId.toString());
  }

  absenceListEndpoint(employeeId: number) {
    return this.http.get<AbsenceDTO[]>(this.baseUrl + 'Absences/' + employeeId.toString());
  }

  absenceEndpoint(id: number) {
    return this.http.get<AbsenceDTO>(this.baseUrl + id.toString());
  }

  addEndpoint(absenceAdd: AbsenceDTO) {
    var formData = this.getGenericFormData(absenceAdd);
    return this.http.post(this.baseUrl + 'Add', formData);
  }

  editEndpoint(absenceEdit: AbsenceDTO) {
    var formData = this.getGenericFormData(absenceEdit);
    formData.append("id", absenceEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit', formData);
  }

  approvalListEndpoint(absenceId: number) {
    return this.http.get<AbsenceApprovalDTO[]>(this.baseUrl + 'Approvals/' + absenceId.toString());
  }

  addApprovalEndpoint(approvalAdd: AbsenceApprovalDTO) {
    var formData = this.getGenericApprovalFormData(approvalAdd);
    return this.http.post(this.baseUrl + 'Approval/Add', formData);
  }

  editApprovalEndpoint(approvalEdit: AbsenceApprovalDTO) {
    var formData = this.getGenericApprovalFormData(approvalEdit);
    formData.append("id", approvalEdit.id.toString());
    return this.http.put(this.baseUrl + 'Approval/Edit', formData);
  }

  fileListEndpoint(absenceId: number) {
    return this.http.get<AbsenceFileDTO[]>(this.baseUrl + 'Files/' + absenceId.toString());
  }

  addFileEndpoint(absenceFile: AbsenceFileDTO) {
    var formData = new FormData();
    formData.append("employeeId", absenceFile.employeeId.toString());
    formData.append("absenceId", absenceFile.absenceId.toString());
    formData.append("department", absenceFile.department);
    formData.append("city", absenceFile.city);
    formData.append("level1", absenceFile.level1);
    formData.append("level2", absenceFile.level2);
    formData.append("level3", absenceFile.level3);
    formData.append("name", absenceFile.name);

    if(absenceFile.document != undefined)
      formData.append("document", absenceFile.document);
    return this.http.post(this.baseUrl + 'Add/File', formData);
  }

}
