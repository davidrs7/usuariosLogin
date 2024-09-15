import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyFieldDTO } from 'src/app/dto/survey/survey.dto';
import { AdminExtraForms } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-field-survey',
  templateUrl: './field-survey.component.html',
  styleUrls: ['./field-survey.component.scss']
})
export class FieldSurveyComponent implements OnInit {
  canva: boolean = true;

  forms: AdminExtraForms = new AdminExtraForms();
  surveyFields: SurveyFieldDTO[] = [];

  constructor(private router: Router, private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.surveyService.surveyFieldsEndpoint().subscribe(
      (fieldsResponse: SurveyFieldDTO[]) => {
        this.surveyFields = fieldsResponse;
        this.canva = false;
      }
    );
  }

  newField() {
    this.router.navigateByUrl('survey/survey/add-field');
  }

  openEdit(fieldId: number) {
    this.router.navigateByUrl('survey/survey/edit-field/' + fieldId);
  }

}
