import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepDTO, StepFieldDTO } from '../../../dto/recruiter/step.dto';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';
import { StepService } from 'src/app/_services/recruiter/step.service';

@Component({
  selector: 'app-add-stage',
  templateUrl: './add-stage.component.html',
  styleUrls: ['./add-stage.component.scss']
})
export class AddStageComponent implements OnInit {
  canva: boolean = true;
  modalReference!: any;
  stepId: any;

  weightList: number[] = [];
  fieldsSelected: boolean = false;
  fields: StepFieldDTO[] = [];
  step: StepDTO = { id: 0, available: 0, name: '', description: '', active: 0 };

  errors: AdminMsgErrors = new AdminMsgErrors();
  formStep!: FormGroup;

  constructor(private stepService: StepService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initFormStep();

    this.stepId = this.route.snapshot.paramMap.get("id");
    if(this.stepId != null) {
      this.getStep();
    } else {
      this.stepId = -1;
      this.getStepFields();
    }
  }

  get name() { return this.formStep.get('name'); }
  get description() { return this.formStep.get('description'); }
  get available() { return this.formStep.get('available'); }

  initFormStep() {
    this.formStep = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      available: new FormControl(1, Validators.required)
    });
  }

  setValuesFormStep() {
    this.name?.setValue(this.step?.name);
    this.description?.setValue(this.step?.description);
    this.available?.setValue(this.step?.available);
  }

  goBack() {
    this.router.navigateByUrl('recruiter/step/list');
  }

  openModal(content:any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  toggleField(fieldId: number) {
    this.fieldsSelected = false;
    for(var i = 0; i < this.fields.length; i++) {
      if(this.fields[i].id == fieldId) {
        this.fields[i].stepId = this.fields[i].stepId == this.stepId ? 0 : this.stepId;
        this.fields[i].inserted = true;
        if(this.fields[i].active == null)
          this.fields[i].active = 1;
        if(this.fields[i].weight == null)
          this.fields[i].weight = 0;
      }
      
      if(this.fields[i].stepId == this.stepId)
        this.fieldsSelected = true;
    }
    this.sortFields();
  }

  changeActiveInField(fieldId: number) {
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].id == fieldId) {
        this.fields[i].active = this.fields[i].active == 1 ? 0 : 1;
        break;
      }
  }

  changeWeightInField(fieldId: number, value: any) {
    this.canva = true;
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].id == fieldId) {
        this.fields[i].weight = value.target.value;
        break;
      }
    this.sortFields();
  }

  sortFields() {
    this.fields.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
    this.canva = false;
  }

  getStep() {
    this.stepService.stepEndpoint(this.stepId).subscribe(
      (stepResponse: StepDTO) => {
        if(stepResponse != null) {
          this.step = stepResponse;
          this.setValuesFormStep();
          this.getStepFields();
        } else {
          this.canva = false;
          this.fieldsSelected = false;
        }
      }
    );
  }

  getStepFields() {
    this.stepService.stepFieldEndpoint().subscribe(
      (fieldsResponse: StepFieldDTO[]) => {
        this.fields = fieldsResponse;
        for(var j = 0; j < this.fields.length; j++) {
          this.fields[j].inserted = false;
          this.fields[j].updated = false;
        }

        this.initWeightList();
        if(this.stepId != null && this.stepId > 0) {
          this.stepService.stepFieldByStepEndpoint(this.stepId).subscribe(
            (fieldsByStepResponse: StepFieldDTO[]) => {
              if(this.fields.length > 0 && fieldsByStepResponse.length > 0)
                for(var i = 0; i < fieldsByStepResponse.length; i++)
                  for(var j = 0; j < this.fields.length; j++)
                    if(this.fields[j].id == fieldsByStepResponse[i].id) {
                      this.fields[j].stepId = this.stepId;
                      this.fields[j].active = fieldsByStepResponse[i].active;
                      this.fields[j].weight = fieldsByStepResponse[i].weight;
                      this.fields[j].updated = true;
                      this.fieldsSelected = true;
                      break;
                    }
              this.sortFields();
              this.canva = false;
            }
          );
        } else {
          this.canva = false;
          this.fieldsSelected = false;
        }
      }
    );
  }

  initWeightList() {
    this.weightList = [];
    var length: number = this.fields.length - 1;
    for(var i = (length * -1); i <= length; i++)
      this.weightList.push(i);
  }

  validateFormStep() {
    this.formStep.markAllAsTouched();
    if(this.formStep.status == 'VALID') {
      this.canva = true;
      this.step = this.errors.mapping(this.step, this.formStep);
      this.saveStep();
    }
  }

  saveStep() {
    if(this.stepId > 0) {
      this.stepService.editStepEndpoint(this.step).subscribe(
        (rsp: any) => {
          this.saveStepFields();
          this.goBack();
        }
      );
    } else {
      this.stepService.addStepEndpoint(this.step).subscribe(
        (stepId: any) => {
          this.stepId = stepId;
          this.saveStepFields();
          this.goBack();
        }
      );
    }
  }

  saveStepFields() {
    for(var i = 0; i < this.fields.length; i++)
      if(this.fields[i].stepId != null && this.fields[i].stepId != 0) {
        this.fields[i].stepId = this.stepId;
        if(this.fields[i].config == null || this.fields[i].config == '')
          this.fields[i].config = 'empty';
        this.stepService.mergeStepFieldRelEndpoint(this.fields[i]).subscribe();
      }
  }

}
