import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from 'src/app/_services/params.service';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { ParamOptionDTO, ParamsDTO } from 'src/app/dto/params.dto';
import { SurveyFieldDTO } from 'src/app/dto/survey/survey.dto';
import { AdminExtraForms, AdminMsgErrors, FormFieldConfigIndex } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-field-survey-add',
  templateUrl: './field-survey-add.component.html',
  styleUrls: ['./field-survey-add.component.scss']
})
export class FieldSurveyAddComponent implements OnInit {
  canva: boolean = true;
  paramsAll: boolean = true;
  paramOptions: ParamOptionDTO[] = [];
  params: ParamsDTO[] = [];

  forms: AdminExtraForms = new AdminExtraForms();
  errors: AdminMsgErrors = new AdminMsgErrors();
  field: SurveyFieldDTO = { id: 0, available: 1, name: '', fieldType: '', isRequired: 0, active: 1, weight: 0, inserted: false, updated: false };
  formField!: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private surveyService: SurveyService, private paramsService: ParamsService) { }

  ngOnInit(): void {
    this.initFormField();
    this.paramOptions = this.paramsService.optionListFromParams(true, true);

    var fieldId = this.route.snapshot.paramMap.get("id");
    if(fieldId != null)
      this.initField(fieldId);
    else
      this.canva = false;
  }

  get available() { return this.formField.get('available'); }
  get name() { return this.formField.get('name'); }
  get fieldType() { return this.formField.get('fieldType'); }
  get isRequired() { return this.formField.get('isRequired'); }
  get numMin() { return this.formField.get('numMin'); }
  get numMax() { return this.formField.get('numMax'); }
  get options() { return this.formField.get('options'); }
  get systemList() { return this.formField.get('systemList'); }
  get score() { return this.formField.get('score'); }

  initFormField() {
    this.formField = new FormGroup({
      available: new FormControl(1, Validators.required),
      name: new FormControl(null, Validators.required),
      fieldType: new FormControl(null, Validators.required),
      isRequired: new FormControl(0, Validators.required),
      numMin: new FormControl(null, Validators.pattern('^[0-9]*$')),
      numMax: new FormControl(null, Validators.pattern('^[0-9]*$')),
      options: new FormControl(null),
      systemList: new FormControl(null),
      score: new FormControl("")
    });
  }

  initField(fieldId: any) {
    this.surveyService.surveyFieldByIdEndpoint(fieldId).subscribe(
      (fieldResponse: SurveyFieldDTO) => {
        this.field = fieldResponse;
        this.setFormField();
        this.canva = false;
      }
    );
  }

  setFormField() {
    this.available?.setValue(this.field.available);
    this.name?.setValue(this.field.name);
    this.fieldType?.setValue(this.field.fieldType);
    this.isRequired?.setValue(this.field.isRequired);

    var configList: any[] = [];
    var config: FormFieldConfigIndex[] = this.forms.getSurveyFieldConfig(this.field);
    for(var i = 0; i < config.length; i++)
      switch(config[i].name) {
        case 'min':
          this.numMin?.setValue(config[i].value);
          break;
        case 'max':
          this.numMax?.setValue(config[i].value);
          break;
        case 'options':
          this.options?.setValue(config[i].value);
          if(this.field.fieldType == 'internal')
            configList = config[i].list ?? [];
          break;
        case 'list':
          this.systemList?.setValue(config[i].value);
          break;
        case 'score':
          this.score?.setValue(config[i].value);
          break;
      }

    if(this.field.fieldType == 'internal')
      this.changeInternalList(configList);
  }

  changeInternalList(configList?: any[]) {
    this.params = [];
    if(this.systemList?.value != '') {
      this.canva = true;
      this.paramsService.paramsDefaultEndpoint(this.systemList?.value).subscribe(
        (paramsResponse: ParamsDTO[]) => {
          this.params = paramsResponse;

          if(configList != null && configList.length > 0) {
            for(let param of this.params) {
              param.available = (configList.indexOf(param.name) >= 0);
              if(!param.available)
                this.paramsAll = false;
            }
          } else {
            for(let param of this.params)
              param.available = true;
          }
          this.canva = false;
        }
      );
    }
  }

  changeInternalParam(paramId: number) {
    this.paramsAll = true;
    for(let param of this.params)
      if(param.id == paramId) {
        param.available = !param.available;
        if(!param.available) {
          this.paramsAll = false;
          break;
        }
      } else if(!param.available) {
        this.paramsAll = false;
      }
  }

  changeInternalAll() {
    for(let param of this.params)
      param.available = !this.paramsAll;
    this.paramsAll = !this.paramsAll;
  }

  validateFormField() {
    this.formField.markAllAsTouched();
    if(this.formField.status == 'VALID') {
      this.canva = true;
      this.field = this.errors.mapping(this.field, this.formField);
      this.setConfigToField();
      this.saveField();
    }
  }

  setConfigToField() {
    var config = '';
    switch(this.fieldType?.value) {
      case 'number':
        var separated = false;
        if(this.numMin?.value != null && this.numMin?.value != '') {
          config += 'min:' + this.numMin?.value;
          separated = true;
        }
        if(this.numMax?.value != null && this.numMax?.value != '') {
          if(separated)
            config += '|';
          config += 'max:' + this.numMax?.value;
        }
        break;
      case 'list':
        if(this.options?.value != null && this.options?.value != '')
          config += 'options:' + this.options?.value;
        config += 'score:' + this.score?.value;
        break;
      case 'internal':
        config += 'score:' + this.score?.value + '|list:' + this.systemList?.value;
        if(this.paramsAll) {
          config += '|content:all';
        } else {
          config += '|options:';
          var first: boolean = true;
          for(let param of this.params)
            if(param.available) {
              if(!first)
                config += ',';
              config += param.name;
              first = false;
            }
        }
        break;
    }
    this.field.config = config;
  }

  saveField() {
    if(this.field.id == 0) {
      this.surveyService.addSurveyFieldEndpoint(this.field).subscribe(
        (response: any) => {
          this.cancel();
        }
      );
    } else {
      this.surveyService.editSurveyFieldEndpoint(this.field).subscribe(
        (response: any) => {
          this.cancel();
        }
      );
    }
  }

  cancel() {
    this.router.navigateByUrl('survey/survey/fields');
  }

}
