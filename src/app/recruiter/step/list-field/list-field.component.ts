import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/recruiter/step.service';
import { Router } from '@angular/router';
import { StepFieldDTO } from 'src/app/dto/recruiter/step.dto';
import { AdminExtraForms } from 'src/app/dto/utils.dto';


@Component({
  selector: 'app-list-field',
  templateUrl: './list-field.component.html',
  styleUrls: ['./list-field.component.scss'],
})
export class ListFieldComponent implements OnInit {
  canva: boolean = true;

  forms: AdminExtraForms = new AdminExtraForms();
  stepFields: StepFieldDTO[] = [];

  constructor(private router: Router, private stepService: StepService) {}

  ngOnInit(): void {
    this.initStepFields();
  }

  initStepFields() {
    this.stepService.stepFieldEndpoint().subscribe(
      (fieldsResponse: StepFieldDTO[]) => {
        this.stepFields = fieldsResponse;
        this.canva = false;
      }
    );
  }

  newField() {
    this.router.navigateByUrl('recruiter/step/add-field');
  }

  openEdit(fieldId: number) {
    this.router.navigateByUrl('recruiter/step/edit-field/' + fieldId);
  }
}
