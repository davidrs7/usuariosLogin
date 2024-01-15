import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StepDTO, StepFieldDTO } from 'src/app/dto/recruiter/step.dto';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StepService {
    private baseUrl: string = environment.apiUrl + 'Step/';

    constructor(private http: HttpClient) {}

    private stringValue(value: any): string {
      return (value != null && value != undefined) ? value.toString() : null;
    }

    private getStepFormData(step: StepDTO): FormData {
      var formData = new FormData();
      formData.append("name", this.stringValue(step.name));
      formData.append("available", this.stringValue(step.available));
      formData.append("description", this.stringValue(step.description));
      return formData;
    }

    private getStepFieldFormData(stepField: StepFieldDTO): FormData {
      var formData = new FormData();
      formData.append("name", this.stringValue(stepField.name));
      formData.append("available", this.stringValue(stepField.available));
      formData.append("fieldType", this.stringValue(stepField.fieldType));
      formData.append("isRequired", this.stringValue(stepField.isRequired));
      formData.append("config", this.stringValue(stepField.config));
      return formData;
    }

    private getStepFieldRelFormData(stepFieldMerge: StepFieldDTO): FormData {
      var formData = this.getStepFieldFormData(stepFieldMerge);
      formData.append("id", stepFieldMerge.id.toString());
      formData.append("stepId", this.stringValue(stepFieldMerge.stepId));
      formData.append("active", this.stringValue(stepFieldMerge.active));
      formData.append("weight", this.stringValue(stepFieldMerge.weight));
      formData.append("config", this.stringValue(stepFieldMerge.config));
      formData.append("inserted", stepFieldMerge.inserted ? 'true' : 'false');
      formData.append("updated", stepFieldMerge.updated ? 'true' : 'false');
      return formData;
    }

    stepListEndpoint() {
      return this.http.get<StepDTO[]>(this.baseUrl + 'Steps');
    }

    stepEndpoint(stepId: number) {
      return this.http.get<StepDTO>(this.baseUrl + stepId);
    }

    stepFieldEndpoint(){ 
      return this.http.get<StepFieldDTO[]>(this.baseUrl + 'Fields');
    }

    stepFieldByIdEndpoint(fieldId: number) {
      return this.http.get<StepFieldDTO>(this.baseUrl + 'Fields/' + fieldId);
    }

    stepFieldByStepEndpoint(stepId: number) {
      return this.http.get<StepFieldDTO[]>(this.baseUrl + 'FieldsByStep/' + stepId);
    }

    stepFieldByStepWithValueEndpoint(stepId: number, vacantId: number, postulateId: number) {
      return this.http.get<StepFieldDTO[]>(this.baseUrl + 'FieldsByStepRel/' + stepId + '/' + vacantId + '/' + postulateId);
    }

    editStepEndpoint(stepEdit: StepDTO) {
      var formData = this.getStepFormData(stepEdit);
      formData.append("id", stepEdit.id.toString());
      return this.http.put(this.baseUrl + 'Edit', formData);
    }

    addStepEndpoint(stepAdd: StepDTO) {
      return this.http.post<number>(this.baseUrl + 'Add', stepAdd);
    }

    editStepFieldEndpoint(stepFieldEdit: StepFieldDTO) {
      var formData = this.getStepFieldFormData(stepFieldEdit);
      formData.append("id", stepFieldEdit.id.toString());
      return this.http.put(this.baseUrl + 'Field/Edit', formData);
    }

    addStepFieldEndpoint(stepFieldAdd: StepFieldDTO) {
      return this.http.post(this.baseUrl + 'Field/Add', stepFieldAdd);
    }

    mergeStepFieldRelEndpoint(stepFieldMerge: StepFieldDTO) {
      var formData = this.getStepFieldRelFormData(stepFieldMerge);
      return this.http.put(this.baseUrl + 'Field/Rel/Merge', formData);
    }

    mergeStepFieldPostulateRelEndpoint(stepFieldMerge: StepFieldDTO) {
      var formData = this.getStepFieldRelFormData(stepFieldMerge);
      formData.append("fieldValue", this.stringValue(stepFieldMerge.fieldValue));
      formData.append("postulateId", this.stringValue(stepFieldMerge.postulateId));
      formData.append("vacantId", this.stringValue(stepFieldMerge.vacantId));
      return this.http.put(this.baseUrl + 'Field/Postulate/Rel/Merge', formData);
    }

}
