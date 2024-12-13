import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReqCargos, reqAccionesObjetivos, reqObjetivos } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from "sweetalert2"

@Component({
  selector: 'app-obejtivos-usuario',
  templateUrl: './obejtivos-usuario.component.html',
  styleUrls: ['./obejtivos-usuario.component.scss']
})
export class ObejtivosUsuarioComponent implements OnInit {

  usuarios: any[] = [];
  usuario: any;
  usuariosJefe: any[] = [];
  usuarioJefe: any;
  objetivos: any[] = [];
  objetivo: any;
  accionesObjetivo: any[] = [];
  accionesObjetivoSel: any[] = [];
  accionObjetivo: any = {};
  estadoAcciones: any[] = [];
  idusuario: number = 0;
  nombrelider: string = "";
  ponderacionTotal: number = 0;
  claseIcono: string = '';
  propietario: boolean = true;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  cargoToEdit = false;
  acciones: boolean = false;
  canva: boolean = false;
  ArchivoUser!: File;
  rutaApi: string = "AccionesObjetivos";
  idaccion: number = 0;
  objetivotitulo: string = '';
  mensajeCreaAccion: string = '';
  calificacionObjetivo: number = 0;
  contadorMensajes: number = 0;
  pesoActualObjetivos: number = 0;
  mensajesNotificacion: any[] = [];

  AccionesObjForm: FormGroup = this.fb.group({
    id: [0, []],
    idusuario: [this.idusuario, Validators.required],
    idobjetivo: [0, Validators.required],
    estado: [4, Validators.required],
    calificacion: [0, []],
    descripcion: ['', []],
    comentarios: ['',],
    evidencia: ['', []],
    fechaaccion: [this.obtenerFechaActual(), []]
  });
  @ViewChild('archivoInput') archivoInput: ElementRef<any> | undefined;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargalistas();
    this.calcularPonderacionTotal();
  }


  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  obtenerestado(id: number) {
    return this.estadoAcciones.filter(x => x.id == id)[0].estado;
  }

  async cargalistas() {
    this.usuarios = [];
    this.idusuario = Number(localStorage.getItem('SEUID'));



    await this.loginServices.getUsersByBoss<any>('User/hierarchy', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data;
      this.cargaUsuariosPromise(this.idusuario);

    });


    /*
    await this.loginServices.getDatabyId<any>('User', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      if (this.usuarios.filter(x => x.usuarioId == this.idusuario).length == 0) {
        this.usuarios.push(respuesta.data);
      }
    });*/


    await this.loginServices.GetAllData<any>('EstadoAcciones').subscribe((respuesta: ApiResponse<any>) => {
      this.estadoAcciones = respuesta.data;
    })

  }

  asignarObjetivos(objetivos: any) {
    this.objetivos = objetivos.filter((x: any) => this.convertirFormatoFecha(x.fechaFin) >= this.convertirFormatoFecha(this.obtenerFechaActual()));

  }

  async cargaUsuariosPromise(iduser: number) {
    return new Promise<void>((resolve, reject) => {
      this.loginServices.getDatabyId<any>('User', iduser).subscribe(
        (respuesta: ApiResponse<any>) => {
          if (this.usuarios.filter(x => x.usuarioId == iduser).length == 0) {
            this.usuarios.push(respuesta.data);           }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async cargaUsuariosJefePromise(iduser: number) {
    return new Promise<void>((resolve, reject) => {
      this.loginServices.getDatabyId<any>('User', iduser).subscribe(
        (respuesta: ApiResponse<any>) => {
          if (this.usuariosJefe.filter(x => x.usuarioId == iduser).length == 0) {
              this.usuariosJefe = [];
              this.usuariosJefe.push(respuesta.data);
          }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  guardaUsuarios() {
    const body: any = {
      id: this.idaccion,
      idobjetivo: this.objetivo.id,
      idusuario: this.usuario.usuarioId,
      descripcion: this.AccionesObjForm.get('descripcion')?.value,
      calificacion: this.AccionesObjForm.get('calificacion')?.value,
      evidencia: this.AccionesObjForm.get('evidencia')?.value,
      idestado: this.AccionesObjForm.get('calificacion')?.value > 0 ? this.estadoAcciones.filter(x => x.estado == 'calificado')[0].id : Number(this.AccionesObjForm.get('estado')?.value),
      comentarios: this.AccionesObjForm.get('comentarios')?.value,
      fechaaccion: this.AccionesObjForm.get('fechaaccion')?.value,
    };
    if (this.validarcampos()) {
      let resp = this.cargoToEdit == true ? this.ActualizarAccion(body) : this.CrearAccion(body)
    }
  }

  ActualizarAccion(body: reqAccionesObjetivos) {

    if (this.validaCreacion(body)) {
      this.loginServices.UpdateData(this.rutaApi, body.id, body)
        .subscribe(
          (respuesta: ApiResponse<any>) => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje: ' + respuesta.estado.descripcion,
              text: 'Codigo: ' + respuesta.estado.codigo
            }).then((res: any) => {
              this.abrirModal(this.objetivo)
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
            });
            this.abrirModal(this.objetivo);
          }
        );
    } else {
      Swal.fire({
        icon: 'info',
        title: this.mensajeCreaAccion,
        text: ''
      }).then((res: any) => {
        this.abrirModal(this.objetivo)
      });
    }

  }

  CrearAccion(body: reqObjetivos) {
    this.canva = true
    if (this.validaCreacion(body)) {
      this.loginServices.createData(this.rutaApi, body)
        .subscribe(
          (respuesta: ApiResponse<any>) => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje: ' + respuesta.estado.descripcion,
              text: 'Codigo: ' + respuesta.estado.codigo
            }).then((res: any) => {
              this.abrirModal(this.objetivo);
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
            });
            this.abrirModal(this.objetivo);
          }
        );
    } else {
      Swal.fire({
        icon: 'info',
        title: this.mensajeCreaAccion,
        text: ''
      }).then((res: any) => {
        this.abrirModal(this.objetivo)
      });
    }

  }

  validaCreacion(body: any): boolean {
    let validacion = true;
    let mensaje: string = ""

    if (this.accionesObjetivoSel.length >= 3 && !this.cargoToEdit) {
      mensaje = "Maximo 3 acciones por objetivo";
      validacion = false;
    }
    if (body.calificacion < 0 || body.calificacion > 100) {
      mensaje = "La calificación debe ser de 1 a 100"
      validacion = false;
    }

    this.mensajeCreaAccion = mensaje;

    return validacion
  }

  editarAccion(id: number) {
    this.cargoToEdit = true;
    this.idaccion = id;
    this.accionObjetivo = this.accionesObjetivo.filter(x => x.id == id);
    this.AccionesObjForm.get('estado')?.setValue(this.accionObjetivo[0].idEstado);
    this.AccionesObjForm.get('evidencia')?.setValue(this.accionObjetivo[0].evidencia);
    this.AccionesObjForm.get('descripcion')?.setValue(this.accionObjetivo[0].descripcion);
    this.AccionesObjForm.get('comentarios')?.setValue(this.accionObjetivo[0].comentarios);
    this.AccionesObjForm.get('peso')?.setValue(this.accionObjetivo[0].peso);
    this.AccionesObjForm.get('calificacion')?.setValue(this.accionObjetivo[0].calificacion);
    this.AccionesObjForm.get('fechaaccion')?.setValue(this.convertirFormatoFecha(this.accionObjetivo[0].fechaAccion));
  }

  eliminarAccion(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Objetivo asociado a usuarios." : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.abrirModal(this.objetivo);

          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          this.abrirModal(this.objetivo);
        }
      );
  }


  validarcampos() {
    if (!this.AccionesObjForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    }
    // david, descomentar para implementar OKR's por petición de TM se cambia funcionalidad OKRs.

    else if (!this.propietario && !this.cargoToEdit) {
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'No puedes crear acciones, selecciona una accion para calificar'
      });
      return false;
    }
    else { return true }
  }



  limpiarAcciones() {
    this.AccionesObjForm.get('id')?.setValue(0);
    this.AccionesObjForm.get('calificacion')?.setValue(0);
    this.AccionesObjForm.get('comentarios')?.setValue('');
    this.AccionesObjForm.get('descripcion')?.setValue('');
    this.AccionesObjForm.get('evidencia')?.setValue('');
    this.AccionesObjForm.get('fechaAccion')?.setValue(this.obtenerFechaActual());
    this.AccionesObjForm.get('estado')?.setValue(4);
    this.objetivotitulo = '';
    this.idaccion = 0;
    this.cargoToEdit = false;
    this.canva = false;
    this.mensajesNotificacion = [];
    this.contadorMensajes = 0;

  }

  limpiarForm() {
    this.claseIcono = ''
    this.propietario = false
    this.acciones = false
    this.nombrelider = ''
    this.cargoToEdit = false;
    this.idaccion = 0;
    this.mensajesNotificacion = [];
    this.contadorMensajes = 0;

  }

  calcularAnchoPonderacion(peso: number): number {
    return (peso / 100) * 100;
  }

  calcularPorcentajePonderacion(peso: number): number {
    return (peso / 100) * 100;
  }
  calcularPonderacionTotal() {
    this.ponderacionTotal = this.objetivos.reduce((total, objetivo) => total + objetivo.peso, 0);
  }

  async abrirModal(objetivo: any) {
    this.calificacionObjetivo = 0;
    this.objetivo = objetivo;
    this.acciones = true
    this.limpiarAcciones();
    this.objetivotitulo = this.objetivo.titulo

    await this.loginServices.getUsersByBoss<any>('AccionesObjetivos/xIduser', this.usuario.usuarioId).subscribe((respuesta: ApiResponse<any>) => {
      this.accionesObjetivo = respuesta.data;
        this.accionesObjetivoSel = this.accionesObjetivo.filter(x => x.idObjetivo == objetivo.id && x.idUsuario == this.usuario.usuarioId)
      if (this.accionesObjetivoSel.length > 0) {
        this.calificaObjetivo(this.accionesObjetivoSel);
        //this.editarAccion(this.accionesObjetivoSel[0].id); // solamente una accion para TM - eliminar esta linea para retomar varias acciones por objetivos.
      }
    });


  }
  calificaObjetivo(objetivoSel: any) {
    this.mensajesNotificacion = [];
    let contador = 0;
    let contadorcalificaciones = 0;
    let contadorEvidencias = 0;
    let mensaje = { mensaje: "", leido: false }
    let faltanXdias = 0;
    for (let i = 0; i < objetivoSel.length; i++) {
      this.calificacionObjetivo += objetivoSel[i].calificacion;
      objetivoSel[i].calificacion == 0 ? contadorcalificaciones += 1 : contadorcalificaciones
      objetivoSel[i].evidencia.length == 0 ? contadorEvidencias += 1 : contadorEvidencias
      contador += 1;
    }



    faltanXdias = this.diferenciaEnDias(this.convertirFormatoFecha(this.obtenerFechaActual()), this.convertirFormatoFecha(this.objetivo.fechaFin));

    if (faltanXdias <= 30) {
      mensaje = { mensaje: "Faltan " + faltanXdias + " dias para el cierre de objetivos", leido: false }
      this.mensajesNotificacion.push(mensaje);
    }

    if (contador == 0) {
      mensaje = { mensaje: "Se deben asociar el resultado esperado para este objetivo", leido: false }
      this.mensajesNotificacion.push(mensaje);
    }
    if (contadorcalificaciones > 0) {
      mensaje = { mensaje: "El lider debe calificar tus objetivos", leido: false }
      this.mensajesNotificacion.push(mensaje);
    }
    /*
    if (contadorEvidencias > 0) {
      mensaje = { mensaje: "Se deben subir las evidencias", leido: false }
      this.mensajesNotificacion.push(mensaje);
    }*/
    if (contador > 0 && contadorcalificaciones == 0) {
      mensaje = { mensaje: "Todos los objetivos se han calificado", leido: false }
      this.mensajesNotificacion.push(mensaje);
    }

    if (contador != 0)
      this.calificacionObjetivo = Number((this.calificacionObjetivo / contador).toFixed(2));
    let pesoObjetivos = Number(this.objetivo.peso)
    this.pesoActualObjetivos = Number(((this.calificacionObjetivo / 100) * pesoObjetivos).toFixed(2))
    this.contadorMensajes = this.mensajesNotificacion.length;
  }

  diferenciaEnDias(fechaInicioStr: string, fechaFinStr: string): number {

    const fechaInicio = new Date(fechaInicioStr);
    const fechaFin = new Date(fechaFinStr);
    const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();

    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return dias;
  }

  async cargarObjetivosxUser(usuarioId: number) {
    await this.loginServices.getObjetivosbyId<any>('Objetivos', usuarioId).subscribe((respuesta: ApiResponse<any>) => {

      this.asignarObjetivos(respuesta.data);

    })
  }

  async rolSelect(event: any) {
    this.mensajesNotificacion = [];
    this.contadorMensajes = 0;
    this.acciones = false
    const idseleccionado = event?.target?.value;
    this.usuario = this.usuarios.filter(x => x.usuarioId == idseleccionado)[0];

    this.cargarObjetivosxUser(idseleccionado);
    await this.cargaUsuariosJefePromise(this.usuario.jefeId);

    if (this.usuario != undefined) {
      this.nombrelider = this.usuariosJefe.filter(x => x.usuarioId == this.usuario.jefeId)[0].nombre
      if (this.idusuario != this.usuario.usuarioId) {
        this.claseIcono = 'fas fa-check'
        this.AccionesObjForm.controls['estado'].enable();
        this.AccionesObjForm.controls['calificacion'].enable();
        this.AccionesObjForm.controls['comentarios'].enable();
        this.AccionesObjForm.controls['evidencia'].disable();
        this.AccionesObjForm.controls['descripcion'].disable();
        this.propietario = false
        this.limpiarAcciones();
      } else {
        this.propietario = true
        this.claseIcono = 'fas fa-plus'
        this.AccionesObjForm.controls['estado'].disable();
        this.AccionesObjForm.controls['calificacion'].disable();
        this.AccionesObjForm.controls['comentarios'].disable();
        this.AccionesObjForm.controls['evidencia'].enable();
        this.AccionesObjForm.controls['descripcion'].enable();
        this.limpiarAcciones();
      }
    } else {
      this.limpiarAcciones();
      this.limpiarForm();
    }
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

  cerrarModal(): void {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }


  mostrarPopup() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'block';
    }
  }

  cerrarPopup() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

}
