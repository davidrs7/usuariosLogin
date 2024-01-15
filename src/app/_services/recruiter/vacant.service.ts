import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';
import { StepDTO } from 'src/app/dto/recruiter/step.dto';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VacantService {
    private baseUrl: string = environment.apiUrl + 'Vacant/';

    constructor(private http: HttpClient) {}

    private stringValue(value: any): string {
      return (value != null && value != undefined) ? value.toString() : null;
    }

    private getVacantFormData(vacant: VacantDTO): FormData {
      var formData = new FormData();
      formData.append("vacantStatusId", this.stringValue(vacant.vacantStatusId));
      formData.append("contractTypeId", this.stringValue(vacant.contractTypeId));
      formData.append("jobId", this.stringValue(vacant.jobId));
      formData.append("userId", this.stringValue(vacant.userId));
      formData.append("vacantNum", this.stringValue(vacant.vacantNum));
      formData.append("description", this.stringValue(vacant.description));
      return formData;
    }

    private getStepFormData(stepMerge: StepDTO): FormData {
      var formData = new FormData();
      formData.append("id", stepMerge.id.toString());
      formData.append("vacantId", this.stringValue(stepMerge.vacantId));
      formData.append("name", this.stringValue(stepMerge.name));
      formData.append("available", this.stringValue(stepMerge.available));
      formData.append("description", this.stringValue(stepMerge.description));
      formData.append("active", this.stringValue(stepMerge.active));
      formData.append("weight", this.stringValue(stepMerge.weight));
      formData.append("isRequired", this.stringValue(stepMerge.isRequired));
      formData.append("inserted", stepMerge.inserted ? 'true' : 'false');
      formData.append("updated", stepMerge.updated ? 'true' : 'false');
      return formData;
    }

    vacantListEndpoint() {
      return this.http.get<VacantDTO[]>(this.baseUrl + 'Vacants');
    }

    vacantByIdEndpoint(vacantId: number) {
      return this.http.get<VacantDTO>(this.baseUrl + vacantId.toString());
    }

    editVacantEndpoint(vacantEdit: VacantDTO) {
      var formData = this.getVacantFormData(vacantEdit);
      formData.append("id", vacantEdit.id.toString());
      return this.http.put(this.baseUrl + 'Edit', formData);
    }

    addVacantEndpoint(vacantAdd: VacantDTO) {
      return this.http.post(this.baseUrl + 'Add', vacantAdd);
    }

    vacantStepsEndpoint(vacantId: number) {
      return this.http.get<StepDTO[]>(this.baseUrl + 'Steps/' + vacantId.toString());
    }

    vacantStepsWithValueEndpoint(vacantId: number, posulateId: number) {
      return this.http.get<StepDTO[]>(this.baseUrl + 'StepsByPostRel/' + vacantId.toString() + '/' + posulateId.toString());
    }

    vacantsByPostulateIdEndpoint(posulateId: number) {
      return this.http.get<VacantDTO[]>(this.baseUrl + 'Postulate/' + posulateId.toString());
    }

    vacantsByPostulateRelEndpoint(vacantId: number) {
      return this.http.get<VacantDTO[]>(this.baseUrl + 'PostulateByVacant/' + vacantId.toString());
    }

    mergeVacantStepRelEndpoint(stepMerge: StepDTO) {
      var formData = this.getStepFormData(stepMerge);
      return this.http.put(this.baseUrl + 'Step/Rel/Merge', formData);
    }

    mergeVacantStepPostulateRelEndpoint(stepMerge: StepDTO) {
      var formData = this.getStepFormData(stepMerge);
      formData.append("postulateId", this.stringValue(stepMerge.postulateId));
      formData.append("approved", this.stringValue(stepMerge.approved));
      formData.append("reason", this.stringValue(stepMerge.reason));
      return this.http.put(this.baseUrl + 'Step/Postulate/Rel/Merge', formData);
    }

    addVacantPostulateRelEndpoint(vacant: VacantDTO) {
      return this.http.post(this.baseUrl + 'Postulate/Add', vacant);
    }

    historicalVacantListEndpoint() {
      return this.http.get<VacantDTO[]>(this.baseUrl + 'Historical/Vacants');
    }

    historicalVacantByIdEndpoint(vacantId: number) {
      return this.http.get<VacantDTO>(this.baseUrl + 'Historical/' + vacantId.toString());
    }

}
