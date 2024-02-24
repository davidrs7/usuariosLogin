import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { reqPreguntas, reqrolespermisos } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-preguntas',
  templateUrl: './admin-preguntas.component.html',
  styleUrls: ['./admin-preguntas.component.scss']
})
export class AdminPreguntasComponent implements OnInit {

  preguntas: any[] = [];
  competencias: any[] = [];
  rutaApi: string = 'Preguntas' 
  @ViewChild('competenciaSelect') competenciaSelect!: ElementRef;



  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargalistas();
  }
 
 

  consultacompetencia(id: number){

    return this.competencias.filter(x => x.id == id)[0].competencia

  }

  cargalistas(){
    this.loginServices.GetAllData<any>('Preguntas').subscribe((respuesta: ApiResponse<any>) => {
      this.preguntas = respuesta.data; 
      console.log(respuesta.data); 
    });

    this.loginServices.GetAllData<any>('Competencias').subscribe((respuesta: ApiResponse<any>) => {
      this.competencias = respuesta.data;
      console.log(this.competencias)
    })

  }

  LimpiarFormulario(){
    this.cargalistas(); 
  } 

  async agregarPregunta(){
    const fecha = this.obtenerFechaActual();
    const textareaElement = document.getElementById("pregunta") as HTMLTextAreaElement;
    const competencia = this.competenciaSelect.nativeElement.value;
    console.log(competencia);
    if (Number(competencia) == 0) {
      Swal.fire({
        icon: 'info',
        title: 'Mensaje: Por favor selecciona una competencia',
        text: ''
      })
    } else {
      const body: reqPreguntas = {
        id: 0,
        idcompetencia: Number(competencia),
        pregunta : textareaElement.value,
        estado: true
      };
  
      this.loginServices.createData('Preguntas', body)
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

  eliminar(id: number){

    this.loginServices.eliminarDato(this.rutaApi, id)
    .subscribe(
      (respuesta: ApiResponse<any>) => {
        Swal.fire({
          icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
          title: respuesta.estado.codigo == "500" ? "Error: Usuarios asociados a este rol" : respuesta.estado.descripcion,
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

  editarpregunta(id: number){
    const textareaElement = document.getElementById(id.toString()) as HTMLTextAreaElement;
    console.log(textareaElement.value)
    const body: reqPreguntas = {
      id: id,
      idcompetencia: 1,
      pregunta : textareaElement.value,
      estado: true
    };

    this.loginServices.UpdateData('Preguntas',id, body)
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


  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();
    const fechaFormateada: string = `${fechaActual.getFullYear()}-${this.dosDigitos(fechaActual.getMonth() + 1)}-${this.dosDigitos(fechaActual.getDate())}`;
    return fechaFormateada;
  }

  convertirFormatoFecha(fechaISO: string): string {
    const fechaObj = new Date(fechaISO);

    const año = fechaObj.getFullYear();
    const mes = ('0' + (fechaObj.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaObj.getDate()).slice(-2);

    return `${año}-${mes}-${dia}`;
  }


  dosDigitos(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

}
