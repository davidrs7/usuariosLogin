import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PostulateDTO, PostulateBasicDTO, PostulateCriteriaDTO } from '../../dto/recruiter/postulate.dto';


@Injectable({
    providedIn: 'root'
  })
  export class PostulateService {

    private baseUrl: string = environment.apiUrl + 'Postulate/';

    constructor(private http: HttpClient) { }

    private stringValue(value: any): string {
        return (value != null && value != undefined) ? value.toString() : null;
    }

    private getPostulateFormDataCriteria(postulateCriteria: PostulateCriteriaDTO): FormData {
      var formData = new FormData();
      formData.append("vacantId", this.stringValue(postulateCriteria.vacantId));
      formData.append("name", this.stringValue(postulateCriteria.name));
      formData.append("doc", this.stringValue(postulateCriteria.doc));
      formData.append("page", this.stringValue(postulateCriteria.page));
      formData.append("activePaginator", postulateCriteria.activePaginator ? 'true' : 'false');
      return formData;
    }

    private getPostulateFormData(postulate: PostulateDTO): FormData {
      var formData = new FormData();
      formData.append("recruiterUserId", this.stringValue(postulate.recruiterUserId));
      formData.append("findOutId", this.stringValue(postulate.findOutId));
      formData.append("docTypeId", this.stringValue(postulate.docTypeId));
      formData.append("educationalLevelId", this.stringValue(postulate.educationalLevelId));
      formData.append("offeredSalary", this.stringValue(postulate.offeredSalary));
      formData.append("expectedSalary", this.stringValue(postulate.expectedSalary));
      formData.append("doc", this.stringValue(postulate.doc));
      formData.append("firstName", this.stringValue(postulate.firstName));
      formData.append("lastName", this.stringValue(postulate.lastName));
      formData.append("sex", this.stringValue(postulate.sex));
      formData.append("birthDate", this.stringValue(postulate.birthDate));
      formData.append("rh", this.stringValue(postulate.rh));
      formData.append("cellPhone", this.stringValue(postulate.cellPhone));
      formData.append("phone", this.stringValue(postulate.phone));
      formData.append("email", this.stringValue(postulate.email));
      formData.append("career", this.stringValue(postulate.career));
      formData.append("description", this.stringValue(postulate.description));

      if(postulate.photo != null) {
        const fileToUpload = postulate.photo as File;
        formData.append("photo", fileToUpload, postulate.doc);
      }
      return formData;
    }

    postulateAllEndpoint() {
      return this.http.get<PostulateBasicDTO[]>(this.baseUrl + 'Postulates');
    }

    postulateListEndpoint(postulateCriteria: PostulateCriteriaDTO) {
      var formData = this.getPostulateFormDataCriteria(postulateCriteria);
      return this.http.post<PostulateBasicDTO[]>(this.baseUrl + 'Postulates/Criteria', formData);
    }

    postulateByIdEndpoint(postulateId: number) {
      return this.http.get<PostulateDTO>(this.baseUrl + postulateId.toString());
    }

    editPostulateEndpoint(postulateEdit: PostulateDTO) {
      var formData = this.getPostulateFormData(postulateEdit);
      formData.append("id", postulateEdit.id.toString());
      return this.http.put(this.baseUrl + 'Edit', formData);
    }

    addPostulateEndpoint(postulateAdd: PostulateDTO) {
      var formData = this.getPostulateFormData(postulateAdd);
      return this.http.post(this.baseUrl + 'Add', formData);
    }

    postulateToEmployeeEndpoint(postulateId: number, vacantId: number, employeeId: number) {
      var formData = new FormData();
      formData.append("id", postulateId.toString());
      formData.append("vacantId", vacantId.toString());
      formData.append("employeeId", employeeId.toString());
      return this.http.put(this.baseUrl + 'ToEmployee', formData);
    }
    
  }
