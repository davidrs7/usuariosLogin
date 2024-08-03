import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { StepDTO, StepFieldDTO } from "./recruiter/step.dto";
import { SurveyFieldDTO, SurveyHeaderDTO } from "./survey/survey.dto";
import { EmployeeFileTypeDTO } from "./employee/employee.dto";

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
      var hasOptions: boolean = false;
      var isAll: boolean = false;
      var score: number = 0;
      var listName: string = '';

      for(var i = 0; i < items.length; i++) {
        var set = items[i].split(':');
        var obj: FormFieldConfigIndex = { name: set[0], title: this.getTitleByName(set[0]), value: set[1] };

        var list = set[1].split(',');
        if(list.length > 1 || stepField.fieldType == 'list')
          obj.list = list;

        if(obj.name == 'options') {
          hasOptions = true;
          obj.score = score;
        }
        if(obj.name == 'score')
          score = obj.value == '' ? 0 : obj.value;
        if(obj.name == 'list')
          listName = obj.value;
        if(obj.name == 'content')
          isAll = (obj.value == 'all');

        configIndex.push(obj);
      }

      if(!hasOptions && isAll && stepField.fieldType == 'internal') {
        var objOption: FormFieldConfigIndex = { name: 'service', title: this.getTitleByName('service'), value: listName, score: score, list: [] };
        configIndex.push(objOption);
      }
    }
    return configIndex;
  }
}

export class AdminExtraCalendar {
  private calendar: CalendarAdmin = { selectedYear: 0, selectedMonth: 0, workdays: [ 0, 1, 2, 3, 4, 5, 6 ], selectedEvent: false, yearMode: false, holidays: {} };

  constructor() {
    var date = new Date();
    this.calendar.today = date;
    this.calendar.selectedYear = date.getFullYear();
    this.setSelectedMonth(date.getMonth());
    this.setLastYear(date.getFullYear() + 10);
    this.setFirstYear(date.getFullYear() - 10);
    this.calendar.lastMonth = 11;
    this.calendar.firstMonth = 0;
  }

  public setFirstYear(year: number): void {
    this.calendar.firstYear = year;
  }

  public setLastYear(year: number): void {
    this.calendar.lastYear = year;
  }

  public hasSelectedEvent(): boolean {
    return this.calendar.selectedEvent;
  }

  public setSelectedEvent(selectedEvent: boolean): void {
    this.calendar.selectedEvent = selectedEvent;
  }

  public isYearMode(): boolean {
    return this.calendar.yearMode;
  }

  public isMonthMode(): boolean {
    return !this.calendar.yearMode;
  }

  public setYearMode(): void {
    this.calendar.yearMode = true;
  }

  public setMonthMode(): void {
    this.calendar.yearMode = false;
  }

  public getSelectedYear(): number {
    return this.calendar.selectedYear;
  }

  public setSelectedYear(year: number): void {
    this.calendar.selectedYear = year;
    this.setNewMonthArray(year, this.getSelectedMonth());
  }

  public setSelectedYearNext(): number {
    if(this.getSelectedYear() < (this.calendar.lastYear ?? 0))
      this.setSelectedYear(this.getSelectedYear() + 1);
    return this.getSelectedYear();
  }

  public setSelectedYearBack(): number {
    if(this.getSelectedYear() > (this.calendar.firstYear ?? 0))
      this.setSelectedYear(this.getSelectedYear() - 1);
    return this.getSelectedYear();
  }

  public setSelectedYearFromSelectEvent(event: any): number {
    this.setSelectedYear(event.target.value);
    return this.getSelectedYear();
  }

  public getSelectedMonth(): number {
    return this.calendar.selectedMonth;
  }

  public setSelectedMonth(month: number): void {
    this.calendar.selectedMonth = month;
    this.setNewMonthArray(this.getSelectedYear(), month);
  }

  public setSelectedMonthNext(): void {
    if(this.getSelectedYear() < (this.calendar.lastYear ?? 0)) {
      if(this.getSelectedMonth() == 11) {
        this.calendar.selectedMonth = 0;
        this.setSelectedYear(this.getSelectedYear() + 1);
      } else {
        this.setSelectedMonth(this.getSelectedMonth() + 1);
      }
    }
  }

  public setSelectedMonthBack(): void {
    if(this.getSelectedYear() > (this.calendar.firstYear ?? 0)) {
      if(this.getSelectedMonth() == 0) {
        this.calendar.selectedMonth = 11;
        this.setSelectedYear(this.getSelectedYear() - 1);
      } else {
        this.setSelectedMonth(this.getSelectedMonth() - 1);
      }
    }
  }

  public setSelectedMonthFromSelectEvent(event: any): void {
    this.setSelectedMonth(event.target.value);
  }

  public getWeekdays(): string[] {
    return [ 'LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO' ];
  }

  public getWeekdaysFull(): string[] {
    return [ 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo' ];
  }

  public getMonths(): string[] {
    return [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
  }

  public getWorkdayIndex(dayOfWeek: number, dateIndex?: string): string {
    if(dateIndex != null && this.calendar.holidays[dateIndex] != undefined && this.calendar.holidays[dateIndex].date != null)
      return '-1';
    return (this.calendar.workdays[dayOfWeek] != undefined && this.calendar.workdays[dayOfWeek] < 0) ? '-1' : 'work';
  }

  public setWorkdays(workdays: number[]): void {
    if(workdays.length == 7)
      this.calendar.workdays = workdays;
  }

  public getYears(): number[] {
    var years: number[] = [];

    if(this.calendar.firstYear == undefined)
      this.calendar.firstYear = 1900;

    if(this.calendar.lastYear == undefined)
      this.calendar.lastYear = 2100;

    for(var i = this.calendar.firstYear; i <= this.calendar.lastYear; i++)
      years.push(i);
    return years;
  }

  public getCalendarMonths(): number[] {
    return this.isYearMode() ? [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] : [ this.getSelectedMonth() ];
  }

  public getCalendarWeeks(month: number): CalendarAdminWeek[] {
    if(this.calendar.years == undefined)
      this.calendar.years = [];
    if(this.calendar.years[this.getSelectedYear()].months[month] == undefined)
      this.setNewMonthArray(this.getSelectedYear(), month);
    return this.calendar.years[this.getSelectedYear()].months[month].weeks;
  }

  public selectedEvent(month: number, week: number, day: number): CalendarAdminDay|null {
    if(day > 0) {
      var selectedYear = this.getSelectedYear();
      this.setSelectedMonth(month);

      if(this.calendar.years != undefined && this.calendar.years[selectedYear].months[month].weeks[week].days != undefined)
        for(var i = 0; i < this.calendar.years[selectedYear].months[month].weeks[week].days.length; i++)
          if(this.calendar.years[selectedYear].months[month].weeks[week].days[i].day == day) {
            if(this.hasSelectedEvent())
              this.calendar.years[selectedYear].months[month].weeks[week].days[i].selected = !this.calendar.years[selectedYear].months[month].weeks[week].days[i].selected;
            return this.calendar.years[selectedYear].months[month].weeks[week].days[i];
          }
    }
    return null;
  }

  public getSelectedDayIndex(date: Date): string {
    return (date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear());
  }

  public getSelectedDays(): CalendarAdminDayAssoc {
    var selectedDays: CalendarAdminDayAssoc = {};
    if(this.calendar.years != undefined)
      for(let year in this.calendar.years)
        for(let month in this.calendar.years[year].months)
          for(let week of this.calendar.years[year].months[month].weeks)
            for(let day of week.days)
              if(day.selected && day.date != undefined)
                selectedDays[day.dateIndex] = day;
    return selectedDays;
  }

  public addHoliday(dateIndex: string): boolean {
    if(this.calendar.holidays[dateIndex] == undefined) {
      var day: CalendarAdminDay|null = this.addSelectedDayByIndex(dateIndex, false);
      if(day != null) {
        this.calendar.holidays[dateIndex] = day;
        return true;
      }
    }
    return false;
  }

  public addSelectedDayByIndex(index: string, selected: boolean, content?: any[]): CalendarAdminDay|null {
    var indexArr: string[] = index.split('-');
    if(indexArr.length != 3)
      return null;

    var day: number = Number(indexArr[0]);
    var month: number = Number(indexArr[1]);
    var year: number = Number(indexArr[2]);
    if(isNaN(day) || isNaN(month) || isNaN(year))
      return null;

    return this.addSelectedDay(year, month, day, selected, content);
  }

  public addSelectedDay(year: number, month: number, day: number, selected: boolean, content?: any[]): CalendarAdminDay|null {
    if(this.calendar.years == undefined)
      return null;

    var weeks: CalendarAdminWeek[] = this.setNewMonthArray(year, month);
    var selectedFound: CalendarAdminDay|null = null;

    for(var i = 0; i < weeks.length; i++) {
      for(var j = 0; j < weeks[i].days.length; j++)
        if(weeks[i].days[j].day == day) {
          this.calendar.years[year].months[month].weeks[i].days[j].selected = selected;
          if(content != null && content.length > 0)
            if(this.calendar.years[year].months[month].weeks[i].days[j].content.length > 0) {
              for(let obj of content)
                this.calendar.years[year].months[month].weeks[i].days[j].content.push(obj);
            } else {
              this.calendar.years[year].months[month].weeks[i].days[j].content = content;
            }
          selectedFound = this.calendar.years[year].months[month].weeks[i].days[j];
          break;
        }

      if(selectedFound != null)
        break;
    }

    return selectedFound;
  }

  private setNewMonthArray(selectedYear: number, selectedMonth: number): CalendarAdminWeek[] {
    if(this.calendar.years == undefined)
      this.calendar.years = {};

    if(this.calendar.years[selectedYear] == undefined)
      this.calendar.years[selectedYear] = { year: selectedYear, months: {} };

    if(this.calendar.years[selectedYear].months[selectedMonth] == undefined) {
      this.calendar.years[selectedYear].months[selectedMonth] = { month: selectedMonth, weeks: [] };
      var selectedDay: number = 1;
      var selectedMonthTmp: number = selectedMonth;
      var date: Date = new Date(selectedYear, selectedMonthTmp, selectedDay, 0, 0, 0, 0);
      var dayOfWeek: number = date.getDay() == 0 ? 6 : (date.getDay() - 1);
      var week: number = 0;

      if(dayOfWeek > 0) {
        this.calendar.years[selectedYear].months[selectedMonth].weeks.push({ week: week, days: [] });
        for(var i = 0; i < dayOfWeek; i++)
          this.calendar.years[selectedYear].months[selectedMonth].weeks[week].days.push({
            day: 0, month: 0, year: 0, week: week, dayOfWeek: i, selected: false, isToday: false, dateIndex: '', content: []
          });
      }

      while(selectedMonthTmp == selectedMonth) {
        if(this.calendar.years[selectedYear].months[selectedMonth].weeks[week] == undefined)
          this.calendar.years[selectedYear].months[selectedMonth].weeks.push({ week: week, days: [] });
        this.calendar.years[selectedYear].months[selectedMonth].weeks[week].days.push({
          day: selectedDay, month: selectedMonth, year: selectedYear, week: week, dayOfWeek: dayOfWeek,
          date: date, selected: false, isToday: (
            selectedYear == this.calendar.today?.getFullYear() &&
            selectedMonth == this.calendar.today.getMonth() && selectedDay == this.calendar.today.getDate()
          ), dateIndex: this.getSelectedDayIndex(date), content: []
        });

        selectedDay++;
        date = new Date(selectedYear, selectedMonthTmp, selectedDay, 0, 0, 0, 0);
        dayOfWeek = date.getDay() == 0 ? 6 : (date.getDay() - 1);
        selectedMonthTmp = date.getMonth();
        if(dayOfWeek == 0)
          week++;
      }

      if(dayOfWeek > 0 && dayOfWeek <= 6)
        for(var j = dayOfWeek; j <= 6; j++)
          this.calendar.years[selectedYear].months[selectedMonth].weeks[week].days.push({
            day: 0, month: 0, year: 0, week: week, dayOfWeek: j, selected: false, isToday: false, dateIndex: '', content: []
          });
    }

    return this.calendar.years[selectedYear].months[selectedMonth].weeks;
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
  score?: number;
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

export interface AbsenceFileConfig {
  [id: number]: AbsenceFileConfigKey;
}

export interface AbsenceFileConfigKey {
  id: number;
  name: string;
  selectedLevel1: number;
  labelSelectedLevel1?: string;
  selectedLevel2: number;
  labelSelectedLevel2?: string;
  selectedLevel3: number;
  labelSelectedLevel3?: string;
  paramFileTypesLevel1: EmployeeFileTypeDTO[];
  paramFileTypesLevel2: EmployeeFileTypeDTO[];
  paramFileTypesLevel3: EmployeeFileTypeDTO[];
  active: boolean;
}

export interface CalendarAdmin {
  today?: Date;
  selectedYear: number;
  selectedMonth: number;
  firstYear?: number;
  lastYear?: number;
  firstMonth?: number;
  lastMonth?: number;
  workdays: number[];
  holidays: CalendarAdminDayAssoc;
  selectedEvent: boolean;
  yearMode: boolean;
  years?: CalendarAdminYear;
}

export interface CalendarAdminYear {
  [year: number]: CalendarAdminYearKey;
}

export interface CalendarAdminYearKey {
  year: number;
  months: CalendarAdminMonth;
}

export interface CalendarAdminMonth {
  [month: number]: CalendarAdminMonthKey;
}

export interface CalendarAdminMonthKey {
  month: number;
  weeks: CalendarAdminWeek[];
}

export interface CalendarAdminWeek {
  week: number;
  days: CalendarAdminDay[];
}

export interface CalendarAdminDay {
  day: number;
  month: number;
  year: number;
  week: number;
  dayOfWeek: number;
  date?: Date;
  dateIndex: string;
  selected: boolean;
  isToday: boolean;
  content: any[];
}

export interface CalendarAdminDayAssoc {
  [dateString: string]: CalendarAdminDay;
}
