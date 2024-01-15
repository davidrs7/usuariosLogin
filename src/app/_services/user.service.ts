import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionDTO, UserDTO } from '../dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = environment.apiUrl + 'User/';

  constructor(private http: HttpClient) { }

  private getUserFormData(user: UserDTO): FormData {
    var formData = new FormData();
    formData.append("userName", user.userName);
    formData.append("password", user.password);
    return formData;
  }

  loginEndpoint(user: UserDTO) {
    return this.http.post(this.baseUrl + 'Login', this.getUserFormData(user));
  }

  userByTokenEndpoint(token: string) {
    return this.http.get<UserDTO>(this.baseUrl + 'User/' + token);
  }

  userListEndpoint() {
    return this.http.get<UserDTO[]>(this.baseUrl + 'Users');
  }

  createSessionEndpoint(user: UserDTO) {
    return this.http.post<SessionDTO>(this.baseUrl + 'Session/Create', this.getUserFormData(user));
  }

  destroySessionEndpoint(token: string) {
    return this.http.get(this.baseUrl + 'Session/Destroy/' + token);
  }

}
