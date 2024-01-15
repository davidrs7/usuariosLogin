import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyDTO } from 'src/app/dto/survey/survey.dto';

@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrls: ['./list-survey.component.scss']
})
export class ListSurveyComponent implements OnInit {
  canva: boolean = true;
  surveyList: SurveyDTO[] = [];
  
  constructor(private surveyService: SurveyService, private router: Router) { }

  ngOnInit(): void {
    this.initListsurvey();
  }

  initListsurvey() {
    this.surveyService.surveyListEndpoint().subscribe(
      (surveyListResult: SurveyDTO[]) => {
        this.surveyList = surveyListResult;
        this.canva = false;
      }
    );
  }

  newSurvey() {
    this.router.navigateByUrl('survey/survey/add');
  }

  openEdit(surveyId: number) {
    this.router.navigateByUrl('survey/survey/edit/' + surveyId.toString());
  }

  openConfig(surveyId: number) {
    this.router.navigateByUrl('survey/survey/config/' + surveyId.toString());
  }
}
