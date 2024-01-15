import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';
import { StepDTO } from 'src/app/dto/recruiter/step.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';
import { JobBasicDTO } from 'src/app/dto/employee/job.dto';
import { JobService } from 'src/app/_services/employee/job.service';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { ParamsService } from 'src/app/_services/params.service';
import { StepService } from 'src/app/_services/recruiter/step.service';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss']
})
export class AddVacancyComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  vacantId: any;

  weightList: number[] = [];
  stepsSelected: boolean = false;
  vacantFinish: boolean = false;
  paramJob: JobBasicDTO[] = [];
  paramContractType: ParamsDTO[] = [];
  paramVacantStatus: ParamsDTO[] = [];
  stepList: StepDTO[] = [];
  
  stepsSelectedError: boolean = false;
  errors: AdminMsgErrors = new AdminMsgErrors();
  vacant: VacantDTO = { id: 0, vacantStatusId: 0, contractTypeId: 0, jobId: 0, userId: 1, vacantNum: 0, description: '' };
  formVacant!: FormGroup;

  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute, private stepService: StepService, private vacantService: VacantService, private jobService: JobService, private paramsService: ParamsService) { }

  ngOnInit(): void {
    this.initFormVacant();

    this.vacantId = this.route.snapshot.paramMap.get("id");
    if(this.vacantId != null) {
      this.initVacant();
    } else {
      this.vacantId = -1;
      this.initStepList();
    }
    
    this.initParams();
  }

  get vacantStatusId() { return this.formVacant.get('vacantStatusId'); }
  get contractTypeId() { return this.formVacant.get('contractTypeId'); }
  get jobId() { return this.formVacant.get('jobId'); }
  get vacantNum() { return this.formVacant.get('vacantNum'); }
  get description() { return this.formVacant.get('description'); }

  initFormVacant() {
    this.formVacant = new FormGroup({
      vacantStatusId: new FormControl(null, Validators.required),
      contractTypeId: new FormControl(null, Validators.required),
      jobId: new FormControl(null, Validators.required),
      vacantNum: new FormControl(null, [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1) ]),
      description: new FormControl(null)
    });
  }

  resetVacantNumValidators(minValueNum: number) {
    this.vacantNum?.clearValidators();
    this.vacantNum?.addValidators([ Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(minValueNum) ]);
  }

  initParams() {
    this.jobService.jobsEndpoint().subscribe(
      (jobResponse: JobBasicDTO[]) => {
        this.paramJob = jobResponse;
        this.canva = false;
      }
    );

    this.paramsService.contractTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramContractType = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.vacantStatusEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramVacantStatus = paramResponse;
        this.canva = false;
      }
    );
  }

  initVacant() {
    this.vacantService.vacantByIdEndpoint(this.vacantId).subscribe(
      (vacantResult: VacantDTO) => {
        if(vacantResult != null) {
          this.vacant = vacantResult;
          var employeeCount: number = this.vacant.employeesCount ?? 0;
          this.vacantFinish = employeeCount >= this.vacant.vacantNum;

          if(this.vacantFinish && employeeCount > 1)
            this.resetVacantNumValidators(employeeCount);
          this.setValuesFormVacant();
          this.initStepList();
        }
      }
    );
  }

  initStepList() {
    this.stepService.stepListEndpoint().subscribe(
      (stepListResponse: StepDTO[]) => {
        this.stepList = stepListResponse;
        for(var j = 0; j < this.stepList.length; j++) {
          this.stepList[j].inserted = false;
          this.stepList[j].updated = false;
        }

        this.initWeightList();
        if(this.vacantId != null && this.vacantId > 0) {
          this.vacantService.vacantStepsEndpoint(this.vacantId).subscribe(
            (vacantSteps: StepDTO[]) => {
              if(vacantSteps != null)
                for(var i = 0; i < vacantSteps.length; i++)
                  for(var j = 0; j < this.stepList.length; j++)
                    if(vacantSteps[i].id == this.stepList[j].id) {
                      this.stepList[j].vacantId = this.vacantId;
                      this.stepList[j].active = vacantSteps[i].active;
                      this.stepList[j].weight = vacantSteps[i].weight;
                      this.stepList[j].isRequired = vacantSteps[i].isRequired;
                      this.stepList[j].updated = true;
                      this.stepsSelected = true;
                      break;
                    }
              this.sortStep();
              this.canva = false;
            }
          );
        } else {
          this.canva = false;
          this.stepsSelected = false;
        }
      }
    );
  }

  setValuesFormVacant() {
    this.vacantStatusId?.setValue(this.vacant.vacantStatusId == 0 ? '' : this.vacant.vacantStatusId);
    this.contractTypeId?.setValue(this.vacant.contractTypeId == 0 ? '' : this.vacant.contractTypeId);
    this.jobId?.setValue(this.vacant.jobId == 0 ? '' : this.vacant.jobId);
    this.vacantNum?.setValue(this.vacant.vacantNum);
    this.description?.setValue(this.vacant.description);
  }

  initWeightList() {
    this.weightList = [];
    var length: number = this.stepList.length - 1;
    for(var i = (length * -1); i <= length; i++)
      this.weightList.push(i);
  }

  openModal(content:any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  toggleStep(stepId: number) {
    this.stepsSelected = false;
    this.stepsSelectedError = false;
    for(var i = 0; i < this.stepList.length; i++) {
      if(this.stepList[i].id == stepId) {
        this.stepList[i].vacantId = this.stepList[i].vacantId == this.vacantId ? 0 : this.vacantId;
        this.stepList[i].inserted = true;
        if(this.stepList[i].active == null)
          this.stepList[i].active = 1;
        if(this.stepList[i].weight == null)
          this.stepList[i].weight = 0;
        if(this.stepList[i].isRequired == null)
          this.stepList[i].isRequired = 0;
      }

      if(this.stepList[i].vacantId == this.vacantId)
        this.stepsSelected = true;
    }
    this.sortStep();
  }

  changeActiveInStep(stepId: number) {
    for(var i = 0; i < this.stepList.length; i++)
      if(this.stepList[i].id == stepId) {
        this.stepList[i].active = this.stepList[i].active == 1 ? 0 : 1;
        break;
      }
  }

  changeWeightInStep(stepId: number, value: any) {
    this.canva = true;
    for(var i = 0; i < this.stepList.length; i++)
      if(this.stepList[i].id == stepId) {
        this.stepList[i].weight = value.target.value;
        break;
      }
    this.sortStep();
  }

  changeIsRequiredInStep(stepId: number) {
    for(var i = 0; i < this.stepList.length; i++)
      if(this.stepList[i].id == stepId) {
        this.stepList[i].isRequired = this.stepList[i].isRequired == 1 ? 0 : 1;
        break;
      }
  }

  sortStep() {
    this.stepList.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
    this.canva = false;
  }

  showVacantStatusWarn() {
    var show: boolean = false;
    if(this.vacantStatusId?.value != null && this.vacantStatusId?.value != '')
      for(let vacantStatus of this.paramVacantStatus)
        if(vacantStatus.id == this.vacantStatusId?.value) {
          show = !vacantStatus.available;
          break;
        }
    return show;
  }

  validateFormVacant() {
    this.formVacant.markAllAsTouched();
    this.stepsSelectedError = !this.stepsSelected;
    if(this.formVacant.status == 'VALID' && this.stepsSelected) {
      this.canva = true;
      this.vacant = this.errors.mapping(this.vacant, this.formVacant);
      this.saveVacant();
    }
  }

  saveVacant() {
    if(this.vacant.id == 0) {
      this.vacantService.addVacantEndpoint(this.vacant).subscribe(
        (vacantId: any) => {
          this.vacantId = vacantId;
          this.saveVacantSteps();
          this.cancel();
        }
      );
    } else {
      this.vacantService.editVacantEndpoint(this.vacant).subscribe(
        (rsp: any) => {
          this.saveVacantSteps();
          this.cancel();
        }
      );
    }
  }

  saveVacantSteps() {
    for(var i = 0; i < this.stepList.length; i++)
      if(this.stepList[i].vacantId != null && this.stepList[i].vacantId != 0) {
        this.stepList[i].vacantId = this.vacantId;
        console.log(this.stepList[i]);
        this.vacantService.mergeVacantStepRelEndpoint(this.stepList[i]).subscribe();
      }
  }

  cancel() {
    this.router.navigateByUrl('recruiter/vacancy/list');
  }

}
