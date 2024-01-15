import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StepService } from 'src/app/_services/recruiter/step.service';
import { StepFieldDTO } from 'src/app/dto/recruiter/step.dto';
import { AdminExtraForms, AdminMsgErrors, FormFieldConfigIndex } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss']
})
export class AddFieldComponent implements OnInit {
  canva: boolean = true;

  forms: AdminExtraForms = new AdminExtraForms();
  errors: AdminMsgErrors = new AdminMsgErrors();
  field: StepFieldDTO = { id: 0, available: 1, name: '', fieldType: '', isRequired: 0, active: 1, weight: 0, inserted: false, updated: false };
  formField!: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private stepService: StepService) {}

  ngOnInit(): void {
    this.initFormField();

    var fieldId = this.route.snapshot.paramMap.get("id");
    if(fieldId != null)
      this.initField(fieldId);
    else
      this.canva = false;
  }

  get available() { return this.formField.get('available'); }
  get name() { return this.formField.get('name'); }
  get fieldType() { return this.formField.get('fieldType'); }
  get isRequired() { return this.formField.get('isRequired'); }
  get numMin() { return this.formField.get('numMin'); }
  get numMax() { return this.formField.get('numMax'); }
  get options() { return this.formField.get('options'); }

  initFormField() {
    this.formField = new FormGroup({
      available: new FormControl(1, Validators.required),
      name: new FormControl(null, Validators.required),
      fieldType: new FormControl(null, Validators.required),
      isRequired: new FormControl(0, Validators.required),
      numMin: new FormControl(null, Validators.pattern('^[0-9]*$')),
      numMax: new FormControl(null, Validators.pattern('^[0-9]*$')),
      options: new FormControl(null)
    });
  }

  initField(fieldId: any) {
    this.stepService.stepFieldByIdEndpoint(fieldId).subscribe(
      (fieldResponse: StepFieldDTO) => {
        this.field = fieldResponse;
        this.setFormField();
        this.canva = false;
      }
    );
  }

  setFormField() {
    this.available?.setValue(this.field.available);
    this.name?.setValue(this.field.name);
    this.fieldType?.setValue(this.field.fieldType);
    this.isRequired?.setValue(this.field.isRequired);

    var config: FormFieldConfigIndex[] = this.forms.getStepFieldConfig(this.field);
    for(var i = 0; i < config.length; i++)
      switch(config[i].name) {
        case 'min':
          this.numMin?.setValue(config[i].value);
          break;
        case 'max':
          this.numMax?.setValue(config[i].value);
          break;
        case 'options':
          this.options?.setValue(config[i].value);
          break;
      }
  }

  validateFormField() {
    this.formField.markAllAsTouched();
    if(this.formField.status == 'VALID') {
      this.canva = true;
      this.field = this.errors.mapping(this.field, this.formField);
      this.setConfigToField();
      this.saveField();
    }
  }

  setConfigToField() {
    var config = '';
    switch(this.fieldType?.value) {
      case 'number':
        var separated = false;
        if(this.numMin?.value != null && this.numMin?.value != '') {
          config += 'min:' + this.numMin?.value;
          separated = true;
        }
        if(this.numMax?.value != null && this.numMax?.value != '') {
          if(separated)
            config += '|';
          config += 'max:' + this.numMax?.value;
        }
        break;
      case 'list':
        if(this.options?.value != null && this.options?.value != '')
          config += 'options:' + this.options?.value;
        break;
    }
    this.field.config = config;
  }

  saveField() {
    if(this.field.id == 0) {
      this.stepService.addStepFieldEndpoint(this.field).subscribe(
        (response: any) => {
          this.cancel();
        }
      );
    } else {
      this.stepService.editStepFieldEndpoint(this.field).subscribe(
        (response: any) => {
          this.cancel();
        }
      );
    }
  }

  cancel() {
    this.router.navigateByUrl('recruiter/step/fields');
  }

}
