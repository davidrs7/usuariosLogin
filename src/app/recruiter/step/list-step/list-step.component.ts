import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StepDTO } from '../../../dto/recruiter/step.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';
import { StepService } from 'src/app/_services/recruiter/step.service';

@Component({
  selector: 'app-list-step',
  templateUrl: './list-step.component.html',
  styleUrls: ['./list-step.component.scss']
})
export class ListStepComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  stepList: StepDTO[] = [];
  
  errors: AdminMsgErrors = new AdminMsgErrors();
  formStep!: FormGroup;

  constructor(private modalService: NgbModal, private stepService: StepService, private router: Router) {}

  ngOnInit(): void {
    this.initFormStep();
    this.initSteps();
  }

  get name() { return this.formStep.get('name'); }
  get description() { return this.formStep.get('description'); }

  initFormStep() {
    this.formStep = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    });
  }

  initSteps() {
    this.stepService.stepListEndpoint().subscribe(
    (responseSteps: StepDTO[]) => {
      this.stepList = responseSteps;
      this.canva = false;
    });
  }

  openAdd() {
    this.router.navigateByUrl('recruiter/step/add');
  }

  openEdit(stepId: number) {
    this.router.navigateByUrl('recruiter/step/edit/' + stepId.toString());
  }

}
