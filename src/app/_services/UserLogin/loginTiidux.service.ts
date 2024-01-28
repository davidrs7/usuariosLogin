import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  ApiResponse } from '../../dto/loginTiindux/genericResponse'; 

import { Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

  export class loginTiinduxService {
    private baseApiUrl = environment.apiUrlTiidux + 'api';
    constructor(private http: HttpClient) { }

    Login<T>(ruta:string,datos: T): Observable<ApiResponse<T>>{
      const url = `${this.baseApiUrl}/${ruta}`; 
      return this.http.post<ApiResponse<T>>(url,datos);
    }

    GetAllData<T>(ruta: string): Observable<ApiResponse<T>> {
      const url = `${this.baseApiUrl}/${ruta}`; 
      return this.http.get<ApiResponse<T>>(url);
    }

    UpdateData<T>(ruta: string,id: number,datos: T):Observable<ApiResponse<T>> {
      console.log(datos);
      const url = `${this.baseApiUrl}/${ruta}/${id}`; 
      return this.http.put<ApiResponse<T>>(url,datos);
    }

    createData<T>(ruta: string, datos: T): Observable<ApiResponse<T>> {
      console.log(datos);
      const url = `${this.baseApiUrl}/${ruta}`;
      return this.http.post<ApiResponse<T>>(url, datos);
    }

    eliminarDato<T>(ruta: string, id: number): Observable<ApiResponse<T>> {
      const url = `${this.baseApiUrl}/${ruta}/${id}`;
      return this.http.delete<ApiResponse<T>>(url);
    }

    getDatabyId<T>(ruta: string,id: number): Observable<ApiResponse<T>>{
      const url = `${this.baseApiUrl}/${ruta}/${id}`;
      return this.http.get<ApiResponse<T>>(url);
    } 

    tokenSesion<T>(ruta: string, token: string): Observable<ApiResponse<T>> {
      const url = `${this.baseApiUrl}/${ruta}/${token}`;
      return this.http.get<ApiResponse<T>>(url);
    }

    getUsersByBoss<T>(ruta: string, id: number): Observable<ApiResponse<T>>{
      const url = `${this.baseApiUrl}/${ruta}/${id}`;
      return this.http.get<ApiResponse<T>>(url);
    }

    getAccionesObjetivosxIdusuario<T>(ruta: string, id: number): Observable<ApiResponse<T>>{
      const url = `${this.baseApiUrl}/${ruta}/${id}`;
      return this.http.get<ApiResponse<T>>(url);
    }
      
  }


