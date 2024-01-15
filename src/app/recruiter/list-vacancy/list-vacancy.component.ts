import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';

@Component({
  selector: 'app-list-vacancy',
  templateUrl: './list-vacancy.component.html',
  styleUrls: ['./list-vacancy.component.scss']
})
export class ListVacancyComponent implements OnInit {
  vacantList: VacantDTO[] = [];

  constructor(private vacantService: VacantService, private router: Router) { }

  ngOnInit(): void {
    this.initVacantList();
  }

  initVacantList() {
    this.vacantService.vacantListEndpoint().subscribe(
      (vacantListResult: VacantDTO[]) => {
        this.vacantList = vacantListResult;
      }
    );
  }

  openPostulates(vacantId: number) {
    this.router.navigateByUrl('recruiter/vacancy/assign/' + vacantId.toString());
  }

  openEdit(vacantId: number) {
    this.router.navigateByUrl('recruiter/vacancy/edit/' + vacantId.toString());
  }

  openAdd() {
    this.router.navigateByUrl('recruiter/vacancy/add');
  }

}
