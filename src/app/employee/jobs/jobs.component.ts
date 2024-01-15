import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobBasicDTO } from '../../dto/employee/job.dto';
import { JobService } from '../../_services/employee/job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  canva: boolean = true;
  jobs: JobBasicDTO[] = [];

  constructor(private jobsService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.jobsMethod();
  }

  jobsMethod() {
    this.jobsService.jobsEndpoint().subscribe(
      (jobResponse: JobBasicDTO[]) => {
        this.jobs = jobResponse;
        this.canva = false;
      }
    );
  }

  openAdd() {
    this.router.navigateByUrl('employees/job/add');
  }

  openEdit(id: number) {
    this.router.navigateByUrl('employees/job/edit/' + id);
  }

}
