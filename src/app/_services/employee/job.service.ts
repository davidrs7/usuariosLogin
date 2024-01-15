import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JobBasicDTO, JobDTO } from '../../dto/employee/job.dto';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private baseUrl: string = environment.apiUrl + 'Job/';

  constructor(private http: HttpClient) { }

  private getGenericFormData(job: JobDTO): FormData {
    var formData = new FormData();
    formData.append("departmentId", job.departmentId.toString());
    formData.append("name", job.name);
    formData.append("profile", job.profile);
    formData.append("functions", job.functions);

    if(job.approveId != 0)
      formData.append("approveId", job.approveId.toString());

    if(job.reportId != 0)
      formData.append("reportId", job.reportId.toString());

    return formData;
  }

  jobsEndpoint() {
    return this.http.get<JobBasicDTO[]>(this.baseUrl + 'Jobs');
  }

  jobByIdEndpoint(jobId: number) {
    return this.http.get<JobDTO>(this.baseUrl + 'Id/' + jobId);
  }

  addEndpoint(jobAdd: JobDTO) {
    var formData = this.getGenericFormData(jobAdd);
    return this.http.post(this.baseUrl + 'Add', formData);
  }

  editEndpoint(jobEdit: JobDTO) {
    var formData = this.getGenericFormData(jobEdit);
    formData.append("id", jobEdit.id.toString());
    return this.http.post(this.baseUrl + 'Edit', formData);
  }

}
