import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReqCargos } from 'src/app/Interfaces/UserLogin';

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
  usuariosxJefe: any[] = [];
  usuarioxJefe: any;
  objetivos: any[] = [];
  objetivo: any;
  accionesObjetivo: any[] = [];
  accionesObjetivoSel: any[] = [];
  idusuario: number = 0;
  nombrelider: string = "";
  ponderacionTotal: number = 0;
  claseIcono: string = '';
  propietario: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  cargoToEdit = false;
  acciones: boolean = false;
  canva: boolean = false;
  AccionesObjForm: FormGroup = this.fb.group({
    id: [0, []],
    idusuario: [this.idusuario, []],
    idobjetivo: ['', Validators.required],
    estado: ['', [Validators.required]],
    calificacion: [0, [Validators.required]],
    descripcion: ['', [Validators.required]],
    comentarios: ['', [Validators.required]],
    evidencia: ['', [Validators.required]],
    fechaaccion: ['', [Validators.required]]

  });

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargalistas();
    this.calcularPonderacionTotal();
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

    await this.loginServices.getDatabyId<any>('User', this.idusuario).subscribe((respuesta: ApiResponse<any>) => {
      if (this.usuarios.filter(x => x.usuarioId == this.idusuario).length == 0) {
        this.usuarios.push(respuesta.data);
      }
    });

    await this.loginServices.GetAllData<any>('Objetivos').subscribe((respuesta: ApiResponse<any>) => {
      this.objetivos = respuesta.data;
    })

  }

  async rolSelect(event: any) {
    this.acciones = false
    const idseleccionado = event?.target?.value;
    this.usuario = this.usuarios.filter(x => x.usuarioId == idseleccionado)[0];

    if (this.usuario != undefined) {
      this.nombrelider = this.usuarios.filter(x => x.usuarioId == this.usuario.jefeId)[0].nombre
      if (this.idusuario != this.usuario.usuarioId) {
        this.claseIcono = 'fas fa-check'
        this.propietario = true
      } else {
        this.propietario = false
        this.claseIcono = 'fas fa-plus'
      }
    } else {
       this.limpiarForm()
    }
  }

  limpiarForm(){
    this.claseIcono = ''
    this.propietario = false
    this.acciones = false
    this.nombrelider =  ''
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
    this.acciones = true
    await this.loginServices.getUsersByBoss<any>('AccionesObjetivos/xIduser', this.usuario.usuarioId).subscribe((respuesta: ApiResponse<any>) => {
      this.accionesObjetivo = respuesta.data;
      this.accionesObjetivoSel = this.accionesObjetivo.filter(x => x.idObjetivo == objetivo.id && x.idUsuario == this.usuario.usuarioId)
      //this.acciones = this.accionesObjetivoSel.length > 0 ? true : false;
    });

  }


  cerrarModal(): void {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

}
