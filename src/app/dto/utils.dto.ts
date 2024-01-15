import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { StepDTO, StepFieldDTO } from "./recruiter/step.dto";
import { SurveyFieldDTO, SurveyHeaderDTO } from "./survey/survey.dto";

export class AdminMsgErrors {
  public getErrors(formControl: AbstractControl | null): string[] {
    var errors: string[] = [];

    if(formControl != null && formControl.errors != null)
      for(var index in formControl.errors)
        if(formControl.errors[index])
          switch(index) {
            case 'required':
              errors.push('Campo requerido.');
              break;
            case 'pattern':
              errors.push('Campo con formato no válido.');
              break;
            case 'email':
              errors.push('Debe ser un correo electrónico.');
              break;
            case 'min':
              if(formControl.errors[index].min >= 10000)
                errors.push('El número está fuera de rango.');
              else
                errors.push('Debe ser mayor o igual a ' + formControl.errors[index].min + '.');
              break;
            case 'max':
              if(formControl.errors[index].max >= 10000)
                errors.push('El número está fuera de rango.');
              else
                errors.push('Debe ser menor o igual a ' + formControl.errors[index].max + '.');
              break;
            default:
              errors.push('Error inesperado.');
              console.log(index);
          }
    return errors;
  }

  public validate(formControl: AbstractControl | null): boolean {
    return (formControl != null && formControl.invalid && (formControl.dirty || formControl.touched));
  }

  public mapping(object: any, formGroup: FormGroup): any {
    if(formGroup != null && formGroup.value != null)
      for(var item in formGroup.value)
        if(object[item] != undefined)
          object[item] = (formGroup.value[item] == null || formGroup.value[item] == 'NaN-NaN-NaN') ? '' : formGroup.value[item];
    return object;
  }

  public transformObjectToValidSetter(object: any) {
    Object.keys(object).forEach(key => {
      if(object[key] == null)
        object[key] = '';
    });
    return object;
  }

  public formatDate(dateValue?: any): string {
    var date: Date;
    if(typeof dateValue == 'string' && dateValue == '') return '';
    if(dateValue == null || dateValue == undefined) return '';
    date = new Date(dateValue);
    if(date.getFullYear() < 1800) return '';

    var dateString: string = date.getFullYear() + '-';
    var month: number = date.getMonth() + 1;

    if(month < 10)
      dateString += '0';
    dateString += month + '-';

    if(date.getDate() < 10)
      dateString += '0';
    dateString += date.getDate();

    return dateString;
  }
}

export class AdminExtraForms {
  public getStepFieldConfig(stepField: StepFieldDTO): FormFieldConfigIndex[] {
    return this.getFieldConfig(stepField);
  }

  public getSurveyFieldConfig(surveyField: SurveyFieldDTO): FormFieldConfigIndex[] {
    return this.getFieldConfig(surveyField);
  }

  public createStepFormConfigBase(step: StepDTO, fields: StepFieldDTO[], vacantId?: number): StepFormIndexKey {
    var configIndex: StepFormIndexKey = { step: step, fields: fields, fieldsForm: [], vacantId: vacantId, formGroup: new FormGroup({}), status: 'warning'};
    if(fields != null && fields != undefined && fields.length > 0) {
      var index: number = 0;
      for(let field of fields) {
        var fieldForm: FormFieldIndex = {
          fieldId: field.id, fieldName: 'field' + field.id, fieldType: field.fieldType,
          fieldValue: field.fieldValue, name: field.name, isRequired: field.isRequired, index: index,
          active: field.active == 1, weight: field.weight, config: this.getStepFieldConfig(field)
        };
        configIndex.fieldsForm.push(fieldForm);

        if(field.fieldValue != null && field.fieldValue != '') {
          configIndex.status = 'danger';
          field.updated = true;
        }
        index++;
      }
      configIndex.formGroup = this.createFormGroupByFields(configIndex.fieldsForm);
    }
    return configIndex;
  }

  public createSurveyFormConfigBase(fields: SurveyFieldDTO[]): FormFieldIndex[] {
    var fieldsForm: FormFieldIndex[] = [];
    if(fields != null && fields != undefined && fields.length > 0) {
      var index: number = 0;
      for(let field of fields) {
        var fieldForm: FormFieldIndex = {
          fieldId: field.id, fieldName: 'field' + field.id, fieldType: field.fieldType,
          fieldValue: field.fieldValue, name: field.name, isRequired: field.isRequired, index: index,
          active: field.active == 1, weight: field.weight, config: this.getSurveyFieldConfig(field)
        };
        fieldsForm.push(fieldForm);
      }
    }
    return fieldsForm;
  }

  public createFormGroupByFields(fields: FormFieldIndex[]): FormGroup {
    var formGroup = new FormGroup({});
    for(let field of fields) {
      var formControl = new FormControl(field.fieldValue);
      
      if(field.isRequired)
        formControl.addValidators(Validators.required);

      if(field.fieldType == 'number')
        formControl.addValidators(Validators.pattern('^[0-9]*$'));
      
      if(field.config != null && field.config.length > 0) {
        for(let configField of field.config) {
          switch(configField.name) {
            case 'min':
              formControl.addValidators(Validators.min(configField.value));
              break;
            case 'max':
              formControl.addValidators(Validators.max(configField.value));
              break;
          }
        }
      }

      formGroup.addControl(field.fieldName, formControl);
    }
    return formGroup;
  }

  private getTitleByName(name: string): string {
    switch(name) {
      case 'min': return 'Mínimo';
      case 'max': return 'Máximo';
      case 'options': return 'Lista de opciones';
      default: return name;
    }
  }

  private getFieldConfig(stepField: any): FormFieldConfigIndex[] {
    var configIndex: FormFieldConfigIndex[] = [];
    if(stepField.config != null && stepField.config != '') {
      var items = stepField.config.split('|');
      for(var i = 0; i < items.length; i++) {
        var set = items[i].split(':');
        var obj: FormFieldConfigIndex = { name: set[0], title: this.getTitleByName(set[0]), value: set[1] };
        
        var list = set[1].split(',');
        if(list.length > 1 || stepField.fieldType == 'list') {
          obj.list = list;
        }

        configIndex.push(obj);
      }
    }
    return configIndex;
  }
}

export interface NodeTree {
  id?: number;
  name: string;
  isFolder?: boolean;
  isUnknown?: boolean;
  url?: string;
  fileName?: string;
  key?: string;
  children?: NodeTree[];
}

export interface NodeIndex {
  [index: string]: NodeIndexKey;
}

export interface NodeIndexKey {
  name: string;
  parent?: string;
  found: boolean;
  children: NodeTree[];
}

export interface FileRel {
  level: string;
  file?: File;
}

export interface NavigateIndex {
  [index: string]: NavigateIndexKey[];
}

export interface NavigateIndexKey {
  name: string;
  title: string;
  faClass?: string;
  routing?: string;
  children?: NavigateIndexKey[];
}

export interface FormFieldIndex {
  fieldId: number;
  fieldName: string;
  fieldType: string;
  fieldValue?: string;
  name: string;
  isRequired: number;
  active: boolean;
  weight: number;
  index?: number;
  config?: FormFieldConfigIndex[];
}

export interface FormFieldConfigIndex {
  name: string;
  title: string;
  value: any;
  list?: any[];
}

export interface StepFormIndexKey {
  step: StepDTO;
  fields: StepFieldDTO[];
  fieldsForm: FormFieldIndex[];
  formGroup: FormGroup;
  vacantId?: number;
  status: string;
}

export interface StepFormIndex {
  [stepId: number]: StepFormIndexKey;
}
