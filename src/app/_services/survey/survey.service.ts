import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SurveyDTO, SurveyFieldDTO, SurveyHeaderDTO, SurveyUserDTO, SurveyUserRelDTO } from '../../dto/survey/survey.dto';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private baseUrl: string = environment.apiUrl + 'Survey/';

  constructor(private http: HttpClient) { }

  private stringValue(value: any): string {
    return (value != null && value != undefined) ? value.toString() : null;
  }

  private getSurveyFormData(survey: SurveyDTO): FormData {
    var formData = new FormData();
    formData.append("name", this.stringValue(survey.name));
    formData.append("available", this.stringValue(survey.available));
    formData.append("description", this.stringValue(survey.description));
    return formData;
  }

  private getSurveyHeaderFormData(survey: SurveyHeaderDTO): FormData {
    var formData = new FormData();
    formData.append("surveyId", this.stringValue(survey.surveyId));
    formData.append("title", this.stringValue(survey.title));
    formData.append("started", this.stringValue(survey.started));
    formData.append("finished", this.stringValue(survey.finished));
    return formData;
  }

  private getSurveyFieldFormData(surveyField: SurveyFieldDTO): FormData {
    var formData = new FormData();
    formData.append("name", this.stringValue(surveyField.name));
    formData.append("available", this.stringValue(surveyField.available));
    formData.append("fieldType", this.stringValue(surveyField.fieldType));
    formData.append("isRequired", this.stringValue(surveyField.isRequired));
    formData.append("config", this.stringValue(surveyField.config));
    return formData;
  }

  private getSurveyFieldRelFormData(surveyFieldMerge: SurveyFieldDTO): FormData {
    var formData = this.getSurveyFieldFormData(surveyFieldMerge);
    formData.append("id", surveyFieldMerge.id.toString());
    formData.append("surveyId", this.stringValue(surveyFieldMerge.surveyId));
    formData.append("active", this.stringValue(surveyFieldMerge.active));
    formData.append("weight", this.stringValue(surveyFieldMerge.weight));
    formData.append("config", this.stringValue(surveyFieldMerge.config));
    formData.append("inserted", surveyFieldMerge.inserted ? 'true' : 'false');
    formData.append("updated", surveyFieldMerge.updated ? 'true' : 'false');
    return formData;
  }

  surveyListEndpoint() {
    return this.http.get<SurveyDTO[]>(this.baseUrl + 'Surveys');
  }

  surveyListBySurveyEndpoint(surveyId: number) {
    return this.http.get<SurveyHeaderDTO[]>(this.baseUrl + 'Surveys/Header/Survey/' + surveyId);
  }

  surveyListByUserEndpoint(userId: number) {
    return this.http.get<SurveyHeaderDTO[]>(this.baseUrl + 'Surveys/Header/User/' + userId);
  }

  surveyEndpoint(surveyId: number) {
    return this.http.get<SurveyDTO>(this.baseUrl + surveyId);
  }

  surveyByUserEndpoint(userId: number, surveyId: number) {
    return this.http.get<SurveyHeaderDTO>(this.baseUrl + 'Surveys/Header/' + surveyId + '/' + userId);
  }

  editSurveyEndpoint(surveyEdit: SurveyDTO) {
    var formData = this.getSurveyFormData(surveyEdit);
    formData.append("id", surveyEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit', formData);
  }

  addSurveyEndpoint(surveyAdd: SurveyDTO) {
    return this.http.post<number>(this.baseUrl + 'Add', surveyAdd);
  }

  editSurveyHeaderEndpoint(surveyEdit: SurveyHeaderDTO) {
    var formData = this.getSurveyHeaderFormData(surveyEdit);
    formData.append("id", surveyEdit.id.toString());
    return this.http.put(this.baseUrl + 'Header/Edit', formData);
  }

  addSurveyHeaderEndpoint(surveyAdd: SurveyHeaderDTO) {
    return this.http.post<number>(this.baseUrl + 'Header/Add', surveyAdd);
  }

  surveyFieldsEndpoint() {
    return this.http.get<SurveyFieldDTO[]>(this.baseUrl + 'Fields');
  }

  surveyFieldByIdEndpoint(fieldId: number) {
    return this.http.get<SurveyFieldDTO>(this.baseUrl + 'Fields/' + fieldId);
  }

  surveyFieldBySurveyEndpoint(surveyId: number) {
    return this.http.get<SurveyFieldDTO[]>(this.baseUrl + 'FieldsBySurvey/' + surveyId);
  }

  surveyFieldBySurveyHeaderEndpoint(surveyHeaderId: number) {
    return this.http.get<SurveyFieldDTO[]>(this.baseUrl + 'FieldsBySurvey/Header/' + surveyHeaderId);
  }

  editSurveyFieldEndpoint(surveyFieldEdit: SurveyFieldDTO) {
    var formData = this.getSurveyFieldFormData(surveyFieldEdit);
    formData.append("id", surveyFieldEdit.id.toString());
    return this.http.put(this.baseUrl + 'Fields/Edit', formData);
  }

  addSurveyFieldEndpoint(surveyFieldAdd: SurveyFieldDTO) {
    return this.http.post(this.baseUrl + 'Fields/Add', surveyFieldAdd);
  }

  mergeSurveyFieldRelEndpoint(surveyFieldMerge: SurveyFieldDTO) {
    var formData = this.getSurveyFieldRelFormData(surveyFieldMerge);
    return this.http.put(this.baseUrl + 'Field/Rel/Merge', formData);
  }

  surveyUsersByHeaderEndpoint(headerId: number) {
    return this.http.get<SurveyUserDTO[]>(this.baseUrl + 'Users/' + headerId);
  }

  addSurveyUserRelEndpoint(surveyUserRel: SurveyUserRelDTO) {
    return this.http.post(this.baseUrl + 'Users/Rel/Add', surveyUserRel);
  }

  addSurveyUserRelByDepartmentEndpoint(surveyUserRel: SurveyUserRelDTO) {
    return this.http.post(this.baseUrl + 'Users/Rel/Add/Department', surveyUserRel);
  }

  addSurveyUserRelByJobEndpoint(surveyUserRel: SurveyUserRelDTO) {
    return this.http.post(this.baseUrl + 'Users/Rel/Add/Job', surveyUserRel);
  }

  addSurveyUserRelByCityEndpoint(surveyUserRel: SurveyUserRelDTO) {
    return this.http.post(this.baseUrl + 'Users/Rel/Add/City', surveyUserRel);
  }

  deleteSurveyUserRelEndpoint(surveyUserRel: SurveyUserRelDTO) {
    return this.http.post(this.baseUrl + 'Users/Rel/Delete', surveyUserRel);
  }
}
