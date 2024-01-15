import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentDTO } from '../../../dto/employee/department.dto';
import { AdminMsgErrors } from '../../../dto/utils.dto';
import { DepartmentService } from '../../../_services/employee/department.service';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {
  canva: boolean = true;
  departmentId: any;
  department: DepartmentDTO = { id: 0, name: '', colorHex: '', employeesCount: 0 };

  errors: AdminMsgErrors = new AdminMsgErrors();
  formEdit!: FormGroup;

  constructor(private departmentService: DepartmentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initFormEdit();
    this.departmentId = this.route.snapshot.paramMap.get("id");
    this.departmentsMethod();
  }

  get name() { return this.formEdit.get('name'); }
  get colorHex() { return this.formEdit.get('colorHex'); }

  initFormEdit() {
    this.formEdit = new FormGroup({
      name: new FormControl(null, Validators.required),
      colorHex: new FormControl(null, Validators.required)
    });
  }

  departmentsMethod() {
    this.departmentService.departmentByIdEndpoint(this.departmentId).subscribe(
      (departmentResponse: DepartmentDTO) => {
        this.department = departmentResponse;
        this.name?.setValue(this.department.name);
        this.colorHex?.setValue(this.department.colorHex);
        this.canva = false;
      }
    );
  }

  cancel() {
    this.router.navigateByUrl('employees/department/list');
  }

  validateFormEdit() {
    this.formEdit.markAllAsTouched();
    if(this.formEdit.status == 'VALID') {
      this.canva = true;
      var colorHex = this.department.colorHex;
      this.department = this.errors.mapping(this.department, this.formEdit);
      this.department.colorHex = this.department.colorHex.toUpperCase();
      this.department.changeColorHex = (colorHex != this.department.colorHex);

      this.departmentService.editEndpoint(this.department).subscribe(
        (rsp: any) => {
          this.canva = false;
          this.cancel();
        }
      );
    }
  }

}
