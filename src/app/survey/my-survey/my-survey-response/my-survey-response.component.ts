import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyFieldDTO, SurveyHeaderDTO } from 'src/app/dto/survey/survey.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminExtraForms, AdminMsgErrors, FormFieldConfigIndex, FormFieldIndex } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-my-survey-response',
  templateUrl: './my-survey-response.component.html',
  styleUrls: ['./my-survey-response.component.scss']
})
export class MySurveyResponseComponent implements OnInit {
  canva: boolean = true;
  surveyId: any;

  user!: UserDTO;
  fields: SurveyFieldDTO[] = [];
  survey!: SurveyHeaderDTO ;

  fieldsForm: FormFieldIndex[] = [];
  forms: AdminExtraForms = new AdminExtraForms();
  errors: AdminMsgErrors = new AdminMsgErrors();
  formSurvey!: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get("id");
  }

  getUser(user: UserDTO) {
    this.user = user;
    this.getSurvey();
  }

  initFormSurvey() {}

  getSurvey() {
    this.surveyService.surveyByUserEndpoint(this.user.id, this.surveyId).subscribe(
      (surveyResult: SurveyHeaderDTO) => {
        this.survey = surveyResult;
        this.getSurveyFields();
      }
    );
  }

  getSurveyFields() {
    this.surveyService.surveyFieldBySurveyEndpoint(this.surveyId).subscribe(
      (fieldsBysurveyResponse: SurveyFieldDTO[]) => {
        this.fields = fieldsBysurveyResponse;
        console.log(this.fields);
        var fieldsByForm: FormFieldIndex[] = this.forms.createSurveyFormConfigBase(this.fields);
        console.log(fieldsByForm)
        this.formSurvey = this.forms.createFormGroupByFields(fieldsByForm);
        console.log(this.formSurvey)
        this.fieldsForm = fieldsByForm;
        this.canva = false;
      }
    );
  }

  getOptionList(config: FormFieldConfigIndex[] | undefined) {
    console.log(config);
    if(config != null && config.length > 0)
      for(let configField of config)
        if(configField.name == 'options') {
          if(configField.list != null && configField.list.length > 0)
            return configField.list;
          break;
        }
    return [];
  }

  goBack() {
    this.router.navigateByUrl('survey/pending/list');
  }

  validateFormSurvey() {}

}
