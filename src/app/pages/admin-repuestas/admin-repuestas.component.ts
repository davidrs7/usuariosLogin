import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { reqRespuestas } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import  Swal  from "sweetalert2"


@Component({
  selector: 'app-admin-repuestas',
  templateUrl: './admin-repuestas.component.html',
  styleUrls: ['./admin-repuestas.component.scss']
})
export class AdminRepuestasComponent implements OnInit {

  respuestas:any[] = []
  cargoToEdit = false;
  rutaApi = 'opciones_respuesta';
  respuestasForm: FormGroup = this.fb.group({
    id: [0, []],
    idpregunta: ['', Validators.required],
    descripcion: ['', [Validators.required]], 
    peso: [0, [Validators.required]], 
    estado: [true, []]
  });

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista(): void {
    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.respuestas = respuesta.data;
      console.log(this.respuestas)
    });
  }

  editarrespuesta(id:number){
    console.log('editar id- ' + id.toString())
    const descripcion = document.getElementById(id.toString()) as HTMLTextAreaElement;
    const peso = document.getElementById('peso-'+id.toString()) as HTMLTextAreaElement;
    const body: reqRespuestas  = {
      id: id,
      idpregunta: 1,
      descripcion: descripcion.value,
      estado: true,
      peso:  Number(peso.value)
    }
    this.loginServices.UpdateData(this.rutaApi, id, body)
    .subscribe(
      (respuesta: ApiResponse<any>) => {
        Swal.fire({
          icon: 'success',
          title: 'Mensaje: ' + respuesta.estado.descripcion,
          text: 'Codigo: ' + respuesta.estado.codigo
        }).then((res:any) => {
          this.LimpiarFormulario();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
        });
        this.LimpiarFormulario();
      }
    );
  }

  eliminarrespuesta(id:number){
    console.log('eliminar id- ' + id.toString())
    this.loginServices.eliminarDato(this.rutaApi, id)
    .subscribe(
      (respuesta: ApiResponse<any>) => {
        Swal.fire({
          icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
          title: respuesta.estado.codigo == "500" ? "Info: Respuesta asociada a preguntas" : respuesta.estado.descripcion,
          text: 'Codigo: ' + respuesta.estado.codigo
        }).then((res:any) => {
          this.LimpiarFormulario();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
        });
        this.LimpiarFormulario();
      }
    );
  }

  LimpiarFormulario(){
    this.respuestasForm.get('id')?.setValue(0);
    this.respuestasForm.get('idpregunta')?.setValue(0);
    this.respuestasForm.get('descripcion')?.setValue('');
    this.respuestasForm.get('peso')?.setValue(0);
    this.cargarLista();
  }

  agregarRespuesta(){
    const body: reqRespuestas  = {
      id: 0,
      idpregunta: 1,
      descripcion:  this.respuestasForm.get('descripcion')?.value,
      estado: true,
      peso:  this.respuestasForm.get('peso')?.value
    }

    this.loginServices.createData(this.rutaApi, body)
    .subscribe(
      (respuesta: ApiResponse<any>) => {
        Swal.fire({
          icon: 'success',
          title: 'Mensaje: ' + respuesta.estado.descripcion,
          text: 'Codigo: ' + respuesta.estado.codigo
        }).then((res:any) => {
          this.LimpiarFormulario();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
        });
        this.LimpiarFormulario();
      }
    );

  } 

}
