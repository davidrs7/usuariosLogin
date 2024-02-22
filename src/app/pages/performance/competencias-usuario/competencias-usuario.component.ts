import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { reqPreguntas, reqRespuestasUser, reqrolespermisos } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';



@Component({
  selector: 'app-competencias-usuario',
  templateUrl: './competencias-usuario.component.html',
  styleUrls: ['./competencias-usuario.component.scss']
})
export class CompetenciasUsuarioComponent implements OnInit {

  preguntas: any[] = [];
  pregunta: any = {};
  respuestas: any[] = [];
  respuesta: any = {};
  usuarios: any[] = [];
  usuario: any;
  usuarioJefe: any;
  usuariosxJefe: any[] = [];
  usuarioxJefe: any;
  idusuario: number = 0;
  respuestasUser: any[] = [];
  usuarioSel: boolean = false;
  asignacion: string = "";
  apiUrl: string = "respuestas_usuario";
  numPreguntas: number = 0;
  numRespuestas: number = 0;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargalistas()
  }
  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }
  async cargalistas() {

    this.usuarios = [];
    this.idusuario = Number(localStorage.getItem('SEUID'));


    await this.loginServices.getUsersByBoss<any>('User/hierarchy', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data;
    });

    /*
    await this.loginServices.getDatabyId<any>('User', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      if (this.usuarios.filter(x => x.usuarioId == this.idusuario).length == 0) {
        this.usuarios.push(respuesta.data);
      }
    }); */

    await this.obtenerUsuarioPromise();

    this.loginServices.GetAllData<any>('Preguntas').subscribe((respuesta: ApiResponse<any>) => {
      this.preguntas = respuesta.data;
    });

    this.loginServices.GetAllData<any>('opciones_respuesta').subscribe((respuesta: ApiResponse<any>) => {
      this.respuestas = respuesta.data;
    });


  }

  Asingacion(id: number) {
    let asignacion = ""
    const idusuario = this.idusuario;
    const usuario = this.usuarios.filter(x => x.usuarioId == this.idusuario)

    if (usuario.length > 0) {
      let idjefe = this.usuarios.filter(x => x.usuarioId == this.idusuario)[0].jefeId
      if (id == idjefe) {
        asignacion = "(Lider)"
      }
      if (id == this.idusuario) {
        asignacion = "(Autoevaluación)"
      }
      if (id != idjefe && id != this.idusuario) {
        asignacion = "(Colaborador)"
      }
    }

    return asignacion;

  }

  obtenerUsuarioPromise() {
    new Promise<void>((resolve, reject) => { 
      const subscription = this.loginServices.getDatabyId<any>('User', this.idusuario).subscribe(
        (respuesta: ApiResponse<any>) => { 
          if (this.usuarios.filter(x => x.usuarioId == this.idusuario).length == 0) { 
            this.usuarios.push(respuesta.data);
          } 
          resolve(); 
          subscription.unsubscribe();
        },
        (error) => { 
          reject(error);
        }
      );
    });
  }


  async guardarRespuesta(opcion: any, idpregunta: number) {

    const idUsuarioCalifica = this.usuarioJefe.usuarioId
    const idUsuarioCalificado = Number(this.idusuario)
    const comentario = document.getElementById('comentario-' + idpregunta.toString()) as HTMLTextAreaElement;
    let existeRta: boolean = false
    await this.obtenerrespuestasUsuario(this.usuario.usuarioId);
    const body: reqRespuestasUser = {
      id: 0,
      id_pregunta: idpregunta,
      id_respuesta: opcion.id,
      comentarios: comentario.value,
      id_usuario_califica: Number(this.idusuario),
      id_usuario_calificado: this.usuario.usuarioId
    }

    console.log(this.respuestasUser);
    if (this.respuestasUser != undefined) {
      for (let i = 0; i < this.respuestasUser.length; i++) {
        if (this.respuestasUser[i].id_pregunta == idpregunta && this.respuestasUser[i].id_usuario_calificado == this.usuario.usuarioId) {
          existeRta = true;
          body.id = this.respuestasUser[i].id;
        }
      }
    }


    existeRta ? this.actualizardatos(body) : this.crearDatos(body);
  }

  crearDatos(body: any) {
    this.loginServices.createData(this.apiUrl, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.validaExiste()
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
        }
      );
  }

  actualizardatos(body: any) {
    this.loginServices.UpdateData(this.apiUrl, body.id, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.validaExiste()
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
        }
      );
  }

  async rolSelect(event: any) {
    this.usuarioSel = true;

    const idseleccionado = event?.target?.value;
    this.usuario = this.usuarios.filter(x => x.usuarioId == idseleccionado)[0];

    //this.obtenerrespuestasUsuario(idseleccionado);
    this.validaExiste();

    if (this.usuario != undefined) {
      this.usuarioJefe = this.usuarios.filter(x => x.usuarioId == this.usuario.jefeId)[0];

    } else {
      this.usuarioSel = false;

    }
  }


  async obtenerrespuestasUsuario(idseleccionado: number) {
    return new Promise<void>((resolve, reject) => {
      this.respuestasUser = [];
      this.loginServices.getDatabyId<any>(this.apiUrl, idseleccionado).subscribe(
        (respuesta: ApiResponse<any>) => {
          this.respuestasUser = respuesta.data;
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }

  async validaExiste() {
    let existe: boolean = false
    await this.obtenerrespuestasUsuario(this.usuario.usuarioId);
    this.limpiarFormulario()

    this.numPreguntas = this.preguntas.length;
    this.numRespuestas = this.respuestasUser.length;

    if (this.respuestasUser != undefined) {
      for (let i = 0; i < this.respuestasUser.length; i++) {
        const pregunta: HTMLInputElement = document.getElementById('pregunta-' + this.respuestasUser[i].id_pregunta + '|' + 'respuesta-' + this.respuestasUser[i].id_respuesta) as HTMLInputElement;
        pregunta.checked = true;
        const comentario = document.getElementById('comentario-' + this.preguntas[i].id.toString()) as HTMLTextAreaElement;
        comentario.value = this.respuestasUser[i].comentarios || '';
      }
    }

  }


  limpiarFormulario() {

    this.numPreguntas = 0;
    this.numRespuestas = 0;

    if (this.preguntas != undefined && this.respuestas != undefined) {
      for (let i = 0; i < this.preguntas.length; i++) {
        for (let j = 0; j < this.respuestas.length; j++) {
          const pregunta: HTMLInputElement = document.getElementById('pregunta-' + this.preguntas[i].id.toString() + '|' + 'respuesta-' + this.respuestas[j].id.toString()) as HTMLInputElement;
          pregunta.checked = false;
          //console.log('pregunta-' + this.preguntas[i].id.toString() + '|' + 'respuesta-' + this.respuestas[j].id.toString());
        }
        const comentario = document.getElementById('comentario-' + this.preguntas[i].id.toString()) as HTMLTextAreaElement;
        comentario.value = "";
      }
    }
  }
}