import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { SurveyHeaderDTO } from 'src/app/dto/survey/survey.dto';
import { UserDTO } from 'src/app/dto/user.dto';

@Component({
  selector: 'app-my-survey',
  templateUrl: './my-survey.component.html',
  styleUrls: ['./my-survey.component.scss']
})
export class MySurveyComponent implements OnInit {
  canva: boolean = true;
  surveyList: SurveyHeaderDTO[] = [];
  user!: UserDTO;

  constructor(private surveyService: SurveyService, private router: Router) { }

  ngOnInit(): void {}

  getUser(user: UserDTO) {
    this.user = user;
    this.initListsurvey();
  }

  initListsurvey() {
    this.surveyService.surveyListByUserEndpoint(this.user.id).subscribe(
      (surveyListResult: SurveyHeaderDTO[]) => {
        this.surveyList = surveyListResult;
        this.canva = false;
      }
    );
  }

  openEdit(surveyId: number,headerId: number) {
    this.router.navigateByUrl('survey/pending/response/' + surveyId.toString() + '/'+headerId.toString());
  }

}
