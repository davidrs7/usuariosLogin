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

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {

    this.cargalistas()
  }

  async cargalistas() {


    this.usuarios = [];
    this.idusuario = Number(localStorage.getItem('SEUID'));

    await this.loginServices.getUsersByBoss<any>('User/hierarchy', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data;
    });

    await this.loginServices.getDatabyId<any>('User', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      if (this.usuarios.filter(x => x.usuarioId == this.idusuario).length == 0) {
        this.usuarios.push(respuesta.data);
      }
    });



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
    }

    return asignacion;

  }

  guardarRespuesta(opcion: any, idpregunta: number) {

    const idUsuarioCalifica = this.usuarioJefe.usuarioId
    const idUsuarioCalificado = Number(this.idusuario)
    const comentario = document.getElementById('comentario-'+idpregunta.toString()) as HTMLTextAreaElement;
 
    const body: reqRespuestasUser = {
      id: 0,
      id_pregunta: idpregunta,
      id_respuesta: opcion.id,
      comentarios: comentario.value,
      id_usuario_califica: Number(this.idusuario),
      id_usuario_calificado: this.usuario.usuarioId
    }
    console.log(body)

    this.loginServices.createData(this.apiUrl, body)
    .subscribe(
      (respuesta: ApiResponse<any>) => {
        Swal.fire({
          icon: 'success',
          title: 'Mensaje: ' + respuesta.estado.descripcion,
          text: 'Codigo: ' + respuesta.estado.codigo
        }).then((res: any) => {
          console.log(respuesta); 
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
    
    await this.loginServices.getDatabyId<any>(this.apiUrl,idseleccionado).subscribe((respuesta: ApiResponse<any>) => {
        this.respuestasUser.push(respuesta.data);
        console.log(respuesta) 
    });

    if (this.usuario != undefined) {
      this.usuarioJefe = this.usuarios.filter(x => x.usuarioId == this.usuario.jefeId)[0];
    
    } else {
      this.usuarioSel = false;

    }
  }


}
