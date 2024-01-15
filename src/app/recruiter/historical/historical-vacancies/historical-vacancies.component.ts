import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';

@Component({
  selector: 'app-historical-vacancies',
  templateUrl: './historical-vacancies.component.html',
  styleUrls: ['./historical-vacancies.component.scss']
})
export class HistoricalVacanciesComponent implements OnInit {
  vacantList: VacantDTO[] = [];

  constructor(private vacantService: VacantService, private router: Router) { }

  ngOnInit(): void {
    this.initVacantList();
  }

  initVacantList() {
    this.vacantService.historicalVacantListEndpoint().subscribe(
      (vacantListResult: VacantDTO[]) => {
        this.vacantList = vacantListResult;
      }
    );
  }

  openView(vacantId: number) {
    this.router.navigateByUrl('recruiter/vacancy/edit/' + vacantId.toString());
  }

}
