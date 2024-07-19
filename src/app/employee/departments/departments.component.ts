import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DepartmentDTO } from '../../dto/employee/department.dto';
import { DepartmentService } from '../../_services/employee/department.service';
import { AdminMsgErrors } from '../../dto/utils.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  saveDepartments: boolean = false;

  departments: DepartmentDTO[] = [];
  addDepartment: DepartmentDTO = { id: 0, name: '', colorHex: '', employeesCount: 0 };

  errors: AdminMsgErrors = new AdminMsgErrors();
  formAdd!: FormGroup;

  constructor(private modalService: NgbModal, private departmentService: DepartmentService, private router: Router) { }

  ngOnInit(): void {
    this.initFormAdd();
    this.departmentsMethod();
  }

  get name() { return this.formAdd.get('name'); }

  initFormAdd() {
    this.formAdd = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
  }

  departmentsMethod() {
    this.departments = [];
    this.addDepartment.name = '';
    this.departmentService.departmentsEndpoint().subscribe(
      (departmentResponse: DepartmentDTO[]) => {
        this.departments = departmentResponse;
        this.canva = false;
      }
    );
  }

  validateFormAdd() {
    this.formAdd.markAllAsTouched();
    if(this.formAdd.status == 'VALID') {
      this.canva = true;
      this.addDepartment = this.errors.mapping(this.addDepartment, this.formAdd);
      this.departments.push(this.addDepartment);
      this.closeModal();
      this.initFormAdd();
      this.saveDepartments = true;
    }
  }

  saveMethod() {
    debugger;
    this.addDepartment.colorHex = this.getRandomColor();
    this.departmentService.addEndpoint(this.addDepartment).subscribe(
      (response: any) => {
        this.departmentsMethod();
        this.saveDepartments = false;
      }
    );
  }

  cancelMethod() {
    this.addDepartment.name = '';
    this.addDepartment.employeesCount = 0;
    this.departmentsMethod();
    this.saveDepartments = false;
  }

  editMethod(id: number) {
    this.router.navigateByUrl('employees/department/edit/' + id);
  }

  openModal(content: any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  getRandomColor(): string {
    var r = Math.abs(Math.floor(Math.random() * 251)).toString(16);
    var g = Math.abs(Math.floor(Math.random() * 252)).toString(16);
    var b = Math.abs(Math.floor(Math.random() * 253)).toString(16);

    if(r.length == 1)
      r = '0' + r;
    if(g.length == 1)
      g = '0' + g;
    if(b.length == 1)
      b = '0' + b;

    var color = "#" + r + g + b;
    return color.toUpperCase();
  }

}
