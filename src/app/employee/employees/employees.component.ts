import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DepartmentDTO } from '../../dto/employee/department.dto';
import { EmployeeBasicDTO, EmployeeCriteriaDTO, EmployeeDownloadDTO } from '../../dto/employee/employee.dto';
import { DepartmentService } from '../../_services/employee/department.service';
import { EmployeeService } from '../../_services/employee/employee.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  employeeCriteria: EmployeeCriteriaDTO = { departmentId: 0, page: 1, activePaginator: true };
  employees: EmployeeBasicDTO[] = [];
  departments: DepartmentDTO[] = [];
  showEmployees: boolean = false;

  initPage: number = 0;
  lastPage: number = 0;
  totalDepartments: number = 0;
  pagesArray: number[] = [];

  employeeDoc: string = "";
  employeeSelect: string = "cedula";

  constructor(private modalService: NgbModal, private employeeService: EmployeeService, private departmentService: DepartmentService, private router: Router) { }

  ngOnInit(): void {
    this.employeesMethod(1);
  }

  searchEmployee() {
    if(this.employeeSelect == 'cedula') {
      this.perDoc(1);
    } else if(this.employeeSelect == 'nombre') {
      this.perName(1);
    }
  }

  employeesMethod(page: number) {
    
    this.canva = true;
    this.employeeCriteria.page = page;
    this.employees = [];
    this.pagesArray = [];
    this.employeeService.employeesEndpoint(this.employeeCriteria).subscribe(
      (employeesResponse: EmployeeBasicDTO[]) => {
        this.employees = employeesResponse;
        var loadDepartments:boolean = true;

        if(this.employees != null && this.employees.length > 0) {
          this.lastPage = this.employees[0].pages;
          if(this.employees.length == 1 && this.employeeCriteria.doc != null && this.employeeCriteria.doc != '') {
            this.router.navigateByUrl('employees/employee/view/' + this.employees[0].id.toString());
            loadDepartments = false;
          }
        }

        this.pagination();
        if(loadDepartments)
          this.departmentsMethod();
      }
    );
  }

  departmentsMethod() {
    this.departments = [];
    this.departmentService.departmentsEndpoint().subscribe(
      (departmentsResponse: DepartmentDTO[]) => {
        this.departments = departmentsResponse;
        this.totalDepartments = 0;
        for(var i = 0; i < this.departments.length; i++)
          this.totalDepartments += this.departments[i].employeesCount;
        this.canva = false;
      }
    );
  }

  pagination() {
    if((this.employeeCriteria.page - 2) > 0) {
      this.pagesArray.push(this.employeeCriteria.page - 2);
      this.pagesArray.push(this.employeeCriteria.page - 1);
      this.pagesArray.push(this.employeeCriteria.page);
    }else {
      if((this.employeeCriteria.page - 1) > 0) {
        this.pagesArray.push(this.employeeCriteria.page - 1);
        this.pagesArray.push(this.employeeCriteria.page);
      }else {
        this.pagesArray.push(this.employeeCriteria.page);
      }
    }
    if((this.employeeCriteria.page + 1) <= this.lastPage) {
      this.pagesArray.push(this.employeeCriteria.page + 1);
    }
    if((this.employeeCriteria.page + 2) <= this.lastPage) {
      this.pagesArray.push(this.employeeCriteria.page + 2);
    }
    this.showEmployees = true;
    console.log(this.pagesArray);
  }

  openModal(content: any) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    if(this.modalReference != null) {
      this.modalReference.close();
      this.employeeDoc = "";
      this.employeeSelect = "cedula";
    }
  }

  openEdit(employeeId: number) {
    this.router.navigateByUrl('employees/employee/view/' + employeeId.toString());
  }

  openAdd() {
    this.router.navigateByUrl('employees/employee/add');
  }

  classPerDepartment(departmentId: number) {
    var addClass = '';
    if(departmentId == this.employeeCriteria.departmentId)
      addClass += ' employees__people--person--selected';
    return 'employees__people--person' + addClass;
  }

  perDepartment(departmentId: number, page: number) {
    this.employeeCriteria.departmentId = departmentId;
    this.employeesMethod(page);
  }

  perName(page: number) {
    this.employeeCriteria.name = this.employeeDoc;
    this.employeesMethod(page);
  }

  perDoc(page: number) {
    this.employeeCriteria.doc = this.employeeDoc;
    this.employeesMethod(page);
  }

  clearFilters() {
    this.employeeCriteria.departmentId = 0;
    this.employeeCriteria.name = '';
    this.employeeCriteria.doc = '';
    this.employeesMethod(1);
  }

  exportData() {
    this.canva = true;
    this.employeeService.employeesDownloadEndpoint(this.employeeCriteria).subscribe(
      (employeesResponse: EmployeeDownloadDTO[]) => {
        this.downloadData(employeesResponse);
        this.canva = false;
      }
    );
  }

  downloadData(employees: EmployeeDownloadDTO[]) {
    let data:any[][] = [];

    data.push([
      'Tipo de identificación', 'Identificación', 'Fecha de expedición', 'Ciudad de expedición', 'Nombre',
      'Cargo', 'Departamento', 'Estado del funcionario', 'Celular corporativo', 'Celular',
      'Teléfono', 'Correo electrónico', 'Sexo', 'Fecha de nacimiento', 'RH',
      'Estado civil', 'Tipo de contrato', 'Ciudad de trabajo', 'Fecha de ingreso', 'Entidad bancaria',
      'No. cuenta bancaria', 'Tipo de cuenta bancaria', '¿Tiene vacuna?', 'Fabricante / Laboratorio', 'No. de dosis',
      '¿Tiene refuerzo?', 'Nombre contacto de emergencia', 'Teléfono contacto de emergencia', 'Parentesco contacto de emergencia', 'Dirección de residencia',
      'Barrio', 'Ciudad de residencia', 'Estrato', 'Tipo de vivienda', 'Tiempo en residencia (meses)',
      'Tipo de cotizante', 'Eps', 'Arl', 'Afp', 'Medio de transporte',
      'Placa del vehículo', 'Marca del vehículo', 'Modelo del vehículo', 'No. de licencia', 'Categoría de la licencia',
      'Vigencia de la licencia', 'Fecha de vencimiento del SOAT', 'Fecha de vencimiento de la Revisión Tecnico-Mecánica', 'Nombre del propietario del vehículo', 'Recomendado Por',
      'Descripción', 'Nivel de Estudios', 'Profesión'
    ]);

    for(var i = 0; i < employees.length; i++) {
      var register = [
        employees[i].docTypeName, employees[i].doc, employees[i].docIssueDate, employees[i].docIssueCityName, employees[i].name,
        employees[i].jobName, employees[i].departmentName, employees[i].statusName, employees[i].corpCellPhone, employees[i].cellPhone,
        employees[i].phone, employees[i].email, employees[i].sex, employees[i].birthDate, employees[i].rh,
        employees[i].maritalStatusName, employees[i].contractTypeName, employees[i].jobCityName, employees[i].employmentDate, employees[i].bankingEntityName,
        employees[i].bankAccount, employees[i].bankAccountType, employees[i].hasVaccine, employees[i].vaccineMaker, employees[i].vaccineDose,
        employees[i].hasVaccineBooster, employees[i].emergencyContactName, employees[i].emergencyContactPhone, employees[i].emergencyContactRelationship, employees[i].address,
        employees[i].neighborhood, employees[i].cityName, employees[i].socioeconomicStatus, employees[i].housingTypeName, employees[i].housingTime,
        employees[i].contributorType, employees[i].eps, employees[i].arl, employees[i].afp, employees[i].transportationName,
        employees[i].licensePlate, employees[i].vehicleMark, employees[i].vehicleModel, employees[i].licenseNumber, employees[i].licenseCategory,
        employees[i].licenseValidity, employees[i].soatExpirationDate, employees[i].rtmExpirationDate, employees[i].vehicleOwnerName, employees[i].recommendedBy,
        employees[i].description, employees[i].educationalLevelName, employees[i].career
      ];
      data.push(register);
    }

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'export.xlsx');
  }

}
