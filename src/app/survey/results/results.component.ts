import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  resultados: string[][]=[
    ['nombre encuesta 1', '32', '#'], 
    ['nombre encuesta 2', '20', '#'], 
    ['nombre encuesta 3', '50', '#'], 
    ['nombre encuesta 4', '45', '#'],
    ['nombre encuesta 5', '120', '#'],
    ['nombre encuesta 6', '20', '#'],
    ['nombre encuesta 7', '55', '#'],
  ];

  constructor(private SurveyService: SurveyService, private router: Router) { }

  ngOnInit(): void {
    this.initResulSurvey();
  }

  initResulSurvey(){
    //this.ResulSurvey = this.SurveyService.tmpResulSuvivorDataMock();
  }

}
