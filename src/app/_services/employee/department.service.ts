import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DepartmentDTO } from '../../dto/employee/department.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl: string = environment.apiUrl + 'Department/';

  constructor(private http: HttpClient) { }

  departmentsEndpoint() {
    console.log(this.baseUrl + 'Departments');
    return this.http.get<DepartmentDTO[]>(this.baseUrl + 'Departments');
  }

  departmentByIdEndpoint(departmentId: number) {
    return this.http.get<DepartmentDTO>(this.baseUrl + 'Id/' + departmentId);
  }

  addEndpoint(departmentAdd: DepartmentDTO) {
    return this.http.post(this.baseUrl + 'Add', departmentAdd);
  }

  editEndpoint(departmentEdit: DepartmentDTO) {
    var formData = new FormData();
    formData.append("name", departmentEdit.name);
    formData.append("colorHex", departmentEdit.colorHex);
    formData.append("changeColorHex", departmentEdit.changeColorHex ? 'true' : 'false');
    formData.append("employeesCount", departmentEdit.employeesCount.toString());
    formData.append("id", departmentEdit.id.toString());
    return this.http.put(this.baseUrl + 'Edit', formData);
  }

}
