import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentDTO } from '../../../dto/employee/department.dto';
import { JobBasicDTO, JobDTO } from '../../../dto/employee/job.dto';
import { AdminMsgErrors } from '../../../dto/utils.dto';
import { DepartmentService } from '../../../_services/employee/department.service';
import { JobService } from '../../../_services/employee/job.service';

@Component({
  selector: 'app-job-add',
  templateUrl: './job-add.component.html',
  styleUrls: ['./job-add.component.scss']
})
export class JobAddComponent implements OnInit {
  canva: boolean = true;
  jobId: any;
  departments: DepartmentDTO[] = [];
  jobs: JobBasicDTO[] = [];
  jobAdd: JobDTO = { id: 0, departmentId: 0, approveId: 0, reportId: 0, name: '', profile: '', functions: '' };

  errors: AdminMsgErrors = new AdminMsgErrors();
  formJob!: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private departmentService: DepartmentService, private jobService: JobService) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get("id");
    this.paramLists();
    this.formJob = new FormGroup({
      name: new FormControl(null, Validators.required),
      approveId: new FormControl(null),
      departmentId: new FormControl(null, Validators.required),
      reportId: new FormControl(null),
      profile: new FormControl(null, Validators.required),
      functions: new FormControl(null, Validators.required)
    });

    if(this.jobId != null)
      this.jobMethod();
    else
      this.canva = false;
  }

  get name() { return this.formJob.get('name'); }
  get approveId() { return this.formJob.get('approveId'); }
  get departmentId() { return this.formJob.get('departmentId'); }
  get reportId() { return this.formJob.get('reportId'); }
  get profile() { return this.formJob.get('profile'); }
  get functions() { return this.formJob.get('functions'); }

  jobMethod() {
    this.jobService.jobByIdEndpoint(this.jobId).subscribe(
      (jobResponse: JobDTO) => {
        this.jobAdd = jobResponse;
        this.name?.setValue(this.jobAdd.name);
        this.approveId?.setValue(this.jobAdd.approveId);
        this.departmentId?.setValue(this.jobAdd.departmentId);
        this.reportId?.setValue(this.jobAdd.reportId);
        this.profile?.setValue(this.jobAdd.profile);
        this.functions?.setValue(this.jobAdd.functions);
        this.canva = false;
      }
    );
  }

  paramLists() {
    this.departmentService.departmentsEndpoint().subscribe(
      (departmentResponse: DepartmentDTO[]) => {
        this.departments = departmentResponse;
      }
    );
    this.jobService.jobsEndpoint().subscribe(
      (jobResponse: JobBasicDTO[]) => {
        this.jobs = jobResponse;
      }
    );
  }

  addMethod() {
    if(this.jobId == null) {
      this.jobService.addEndpoint(this.jobAdd).subscribe(
        () => {
          this.canva = false;
          this.cancel();
        }
      );
    } else {
      this.jobService.editEndpoint(this.jobAdd).subscribe(
        (rsp: any) => {
          this.canva = false;
          this.cancel();
        }
      );
    }
  }

  cancel() {
    this.router.navigateByUrl('employees/job/list');
  }

  validateFormJob() {
    this.formJob.markAllAsTouched();
    if(this.formJob.status == 'VALID') {
      this.canva = true;
      this.jobAdd = this.errors.mapping(this.jobAdd, this.formJob);
      this.jobAdd.id = this.jobId == null ? 0 : this.jobId;
      this.addMethod();
    }
  }
}
