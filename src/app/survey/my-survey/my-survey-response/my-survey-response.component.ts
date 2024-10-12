import { ApiResponse } from './../../../dto/loginTiindux/genericResponse';
import { loginTiinduxService } from './../../../_services/UserLogin/loginTiidux.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyFieldDTO, SurveyHeaderDTO } from 'src/app/dto/survey/survey.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminExtraForms, AdminMsgErrors, FormFieldConfigIndex, FormFieldIndex } from 'src/app/dto/utils.dto';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-survey-response',
  templateUrl: './my-survey-response.component.html',
  styleUrls: ['./my-survey-response.component.scss']
})
export class MySurveyResponseComponent implements OnInit {
  canva: boolean = true;
  surveyId: any;
  HeaderId: any;
  isAnswered: boolean = false;

  user!: UserDTO;
  fields: SurveyFieldDTO[] = [];
  survey!: SurveyHeaderDTO;
  urlSurveyResponses = 'SurveyResponses';
  fieldsForm: FormFieldIndex[] = [];
  forms: AdminExtraForms = new AdminExtraForms();
  errors: AdminMsgErrors = new AdminMsgErrors();
  formSurvey!: FormGroup;

  constructor(private loginTiinduxService: loginTiinduxService, private router: Router, private route: ActivatedRoute, private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get("id");
    this.HeaderId = this.route.snapshot.paramMap.get("idHeader");
  }

  getUser(user: UserDTO) {
    this.user = user;
    this.getSurvey();
  }

  initFormSurvey() { }

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
        var fieldsByForm: FormFieldIndex[] = this.forms.createSurveyFormConfigBase(this.fields);
        this.formSurvey = this.forms.createFormGroupByFields(fieldsByForm);
        this.fieldsForm = fieldsByForm;
        this.getResponses();
        this.canva = false;
      }
    );
  }

  getOptionList(config: FormFieldConfigIndex[] | undefined) {
    if (config != null && config.length > 0)
      for (let configField of config)
        if (configField.name == 'options') {
          if (configField.list != null && configField.list.length > 0)
            return configField.list;
          break;
        }
    return [];
  }

  getResponses() {
    this.isAnswered = true;
    this.loginTiinduxService.getDatabyId(this.urlSurveyResponses, this.user.id).subscribe((response: ApiResponse<any>) => {
      if (response.data.length > 0 && response.data.some(x => x.survey_id == this.surveyId) && response.data.some(x => x.survey_header_id == this.HeaderId)) {
        this.isAnswered = false;
        this.fillDataForm(response.data);
      }
    })

  }

  fillDataForm(SurveyResponses: any) {
    const formValues: any = {};
    SurveyResponses.forEach(item => {
      formValues[`field${item.field_id}`] = item.response_value;
    });
    this.formSurvey.patchValue(formValues);
    this.formSurvey.disable();

  }

  goBack() {
    this.router.navigateByUrl('survey/pending/list');
  }

 async saveForm() {
    this.canva = true;
    const formValues = this.formSurvey.value;
    const body: any[] = [];
    let estado = "";
    Object.keys(formValues).forEach((key) => {
      const fieldId = key.replace(/\D/g, '');
      const response = formValues[key];
      const responseString = response !== null && response !== undefined ? response.toString() : '';
      body.push({
        survey_id: Number(this.surveyId),
        field_id: Number(fieldId),
        user_id: this.user.id,
        survey_header_id: Number(this.HeaderId),
        response_value: responseString
      });
    });

    for (let i: number = 0; body.length > i; i++) {
      const respuesta = await this.loginTiinduxService.createData(this.urlSurveyResponses, body[i]).toPromise();
      estado = respuesta.estado.codigo.toString();
    }
    this.canva = false;
    if (estado == "200") {
      Swal.fire({
        icon: 'success',
        title: 'Encuesta completada con exito',
        text: ''
      }).then((res: any) => {
        this.router.navigateByUrl('survey/pending/list');
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Problemas para registrar las respuestas, intenta de nuevo.',
        text: ''
      })
    }
  }

  validateFormSurvey() { }

}
