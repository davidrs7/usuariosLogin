import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyDTO, SurveyFieldDTO } from 'src/app/dto/survey/survey.dto';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})

export class CreateSurveyComponent implements OnInit {
  canva: boolean = true;
  modalReference!: any;
  surveyId: any;

  weightList: number[] = [];
  fieldsSelected: boolean = false;
  fields: SurveyFieldDTO[] = [];
  survey: SurveyDTO = { id: 0, available: 0, name: '', description: '', active: 0 };

  errors: AdminMsgErrors = new AdminMsgErrors();
  formSurvey!: FormGroup;
  
  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.initFormSurvey();

    this.surveyId = this.route.snapshot.paramMap.get("id");
    if(this.surveyId != null) {
      this.getSurvey();
    } else {
      this.surveyId = -1;
      this.getSurveyFields();
    }
  }

  get name() { return this.formSurvey.get('name'); }
  get description() { return this.formSurvey.get('description'); }
  get available() { return this.formSurvey.get('available'); }

  initFormSurvey() {
    this.formSurvey = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      available: new FormControl(1, Validators.required)
    });
  }

  setValuesFormSurvey() {
    this.name?.setValue(this.survey?.name);
    this.description?.setValue(this.survey?.description);
    this.available?.setValue(this.survey?.available);
  }

  getSurvey() {
    this.surveyService.surveyEndpoint(this.surveyId).subscribe(
      (surveyResponse: SurveyDTO) => {
        if(surveyResponse != null) {
          this.survey = surveyResponse;
          this.setValuesFormSurvey();
          this.getSurveyFields();
        } else {
          this.canva = false;
          this.fieldsSelected = false;
        }
      }
    );
  }

  getSurveyFields() {
    this.surveyService.surveyFieldsEndpoint().subscribe(
      (fieldsResponse: SurveyFieldDTO[]) => {
        this.fields = fieldsResponse;
        for(var j = 0; j < this.fields.length; j++) {
          this.fields[j].inserted = false;
          this.fields[j].updated = false;
        }

        this.initWeightList();
        if(this.surveyId != null && this.surveyId > 0) {
          this.surveyService.surveyFieldBySurveyEndpoint(this.surveyId).subscribe(
            (fieldsBysurveyResponse: SurveyFieldDTO[]) => {
              if(this.fields.length > 0 && fieldsBysurveyResponse.length > 0)
                for(var i = 0; i < fieldsBysurveyResponse.length; i++)
                  for(var j = 0; j < this.fields.length; j++)
                    if(this.fields[j].id == fieldsBysurveyResponse[i].id) {
                      this.fields[j].surveyId = this.surveyId;
                      this.fields[j].active = fieldsBysurveyResponse[i].active;
                      this.fields[j].weight = fieldsBysurveyResponse[i].weight;
                      this.fields[j].updated = true;
                      this.fieldsSelected = true;
                      break;
                    }
              this.sortFields();
              this.canva = false;
            }
          );
        } else {
          this.canva = false;
          this.fieldsSelected = false;
        }
      }
    );
  }

  initWeightList() {
    this.weightList = [];
    var length: number = this.fields.length - 1;
    for(var i = (length * -1); i <= length; i++)
      this.weightList.push(i);
  }

  toggleField(fieldId: number) {
    this.fieldsSelected = false;
    for(var i = 0; i < this.fields.length; i++) {
      if(this.fields[i].id == fieldId) {
        this.fields[i].surveyId = this.fields[i].surveyId == this.surveyId ? 0 : this.surveyId;
        this.fields[i].inserted = true;
        if(this.fields[i].active == null)
          this.fields[i].active = 1;
        if(this.fields[i].weight == null)
          this.fields[i].weight = 0;
      }
      
      if(this.fields[i].surveyId == this.surveyId)
        this.fieldsSelected = true;
    }
    this.sortFields();
  }

  changeActiveInField(fieldId: number) {
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].id == fieldId) {
        this.fields[i].active = this.fields[i].active == 1 ? 0 : 1;
        break;
      }
  }

  changeWeightInField(fieldId: number, value: any) {
    this.canva = true;
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].id == fieldId) {
        this.fields[i].weight = value.target.value;
        break;
      }
    this.sortFields();
  }

  sortFields() {
    this.fields.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
    this.canva = false;
  }

  goBack() {
    this.router.navigateByUrl('survey/survey/list');
  }

  openModal(content:any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  validateFormSurvey() {
    this.formSurvey.markAllAsTouched();
    if(this.formSurvey.status == 'VALID') {
      this.canva = true;
      this.survey = this.errors.mapping(this.survey, this.formSurvey);
      this.saveSurvey();
    }
  }

  saveSurvey() {
    if(this.surveyId > 0) {
      this.surveyService.editSurveyEndpoint(this.survey).subscribe(
        (rsp: any) => {
          this.saveStepFields();
          this.goBack();
        }
      );
    } else {
      this.surveyService.addSurveyEndpoint(this.survey).subscribe(
        (surveyId: any) => {
          this.surveyId = surveyId;
          this.saveStepFields();
          this.goBack();
        }
      );
    }
  }

  saveStepFields() {
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].surveyId != null && this.fields[i].surveyId != 0) {
        this.fields[i].surveyId = this.surveyId;
        if(this.fields[i].config == null || this.fields[i].config == '')
          this.fields[i].config = 'empty';
        this.surveyService.mergeSurveyFieldRelEndpoint(this.fields[i]).subscribe();
      }
  }

}
