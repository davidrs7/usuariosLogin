import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import * as XLSX from 'xlsx';


interface ReporteObjetivos {
  usuario: string;
  tipo_documento: string;
  documento: string;
  correo: string;
  cargo: string;
  rol: string;
  nombre_lider: string;
  objetivo: string;
  descripcion: string;
  peso: number;
  accion: string;
  estado: string;
  calificacion: number;
}

@Component({
  selector: 'app-reportes-usuarios',
  templateUrl: './reportes-usuarios.component.html',
  styleUrls: ['./reportes-usuarios.component.scss']
})

export class ReportesUsuariosComponent implements OnInit {

  reporteObjetivos: boolean = false;
  reporteCompetencias: boolean = false;
  accion: number = 0;

  //objetivos
  usuarios: any[] = [];
  tipoDocumentos: any[] = [];
  roles: any[] = [];
  cargos: any[] = [];
  objetivos: any[] = [];
  accionesObjetivos: any[] = [];
  estadoAcciones: any[] = [];


  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarlista();
  }

  cargarlista(){
      //usuarios
      this.loginServices.GetAllData<any>('User').subscribe((respuesta: ApiResponse<any>) => {
        this.usuarios = respuesta.data; 
      });

      this.loginServices.GetAllData<any>('TipoDocumento').subscribe((respuesta: ApiResponse<any>) => {
        this.tipoDocumentos = respuesta.data; 
      });

      this.loginServices.GetAllData<any>('Cargos').subscribe((respuesta: ApiResponse<any>) => {
        this.cargos = respuesta.data; 
      });

      this.loginServices.GetAllData<any>('Roles').subscribe((respuesta: ApiResponse<any>) => {
        this.roles = respuesta.data; 
      });      
  }

  cargarlistasObjetivos(){
    this.loginServices.GetAllData<any>('Objetivos').subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data; 
    });
  }

  activaReport(accion: number) {
    this.accion = accion;
  }

  generarReporte() {
    // objetivos
    if (this.accion == 1) { this.generarReporteObjetivos(); }
    if (this.accion == 2) { this.cargueObjetivos(); }
    // competencias
    if (this.accion == 3) { this.generarReportCompetencias(); }
    if (this.accion == 4) { this.cargueCompetencias(); }
  }

  generarReporteObjetivos() {
    this.cargarlistasObjetivos();
    const filtroSelect = document.getElementById('filtro') as HTMLSelectElement;
    const optionSeleccionadoId = filtroSelect.value;
    const reporteObjetivos: ReporteObjetivos[] = [];

    // Iterar sobre cada usuario y poblar la información en reporteObjetivos
    this.usuarios.forEach(usuario => {
      const tipoDocumento = this.encontrarTipoDocumentoPorId(usuario.tipoDocumento);
      const cargo = this.encontrarCargoPorId(usuario.cargoId);
      const rol = this.encontrarRolPorId(usuario.rolId);
      const lider = this.encontrarUsuarioPorId(usuario.jefeId);
      const objetivo = this.encontrarObjetivoPorId(usuario.usuarioId);
      const acciones = this.encontrarAccionesObjetivoPorId(usuario.usuarioId);

      acciones.forEach(accion => {
        const estadoAccion = this.encontrarEstadoAccionPorId(accion.idEstado);
        reporteObjetivos.push({
          usuario: usuario.nombre,
          tipo_documento: tipoDocumento ? tipoDocumento.descripcion : '',
          documento: usuario.numDocumento,
          correo: usuario.correoElectronico,
          cargo: cargo ? cargo.nombre : '',
          rol: rol ? rol.nombre : '',
          nombre_lider: lider ? lider.nombre : '',
          objetivo: objetivo ? objetivo.titulo : '',
          descripcion: objetivo ? objetivo.descripcion : '',
          peso: objetivo ? objetivo.peso : 0,
          accion: accion.descripcion,
          estado: estadoAccion ? estadoAccion.estado : '',
          calificacion: accion.calificacion || 0
        });
      });
    });

    console.log(reporteObjetivos);

    /*
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.objetivos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'objetivos');
    XLSX.writeFile(wb, 'objetivos.xlsx');*/
  }

  generarReportCompetencias() {
  }

  cargueObjetivos() {
  }

  cargueCompetencias() {
  }


  // inicia funciones reporte objetivos
  encontrarUsuarioPorId(id: number) {
    return this.usuarios.find((usuario: any) => usuario.usuarioId === id);
  }

  encontrarTipoDocumentoPorId(id: number) {
    return this.tipoDocumentos.find(tipoDocumento => tipoDocumento.tipoDocumento === id);
  }

  encontrarCargoPorId(id: number) {
    return this.cargos.find(cargo => cargo.cargoId === id);
  }

  encontrarRolPorId(id: number) {
    return this.roles.find(rol => rol.rolId === id);
  }

  encontrarObjetivoPorId(id: number) {
    return this.objetivos.find(objetivo => objetivo.idUsuario === id);
  }

  encontrarAccionesObjetivoPorId(id: number) {
    return this.accionesObjetivos.filter(accion => accion.idUsuario === id);
  }

  encontrarEstadoAccionPorId(id: number) {
    return this.estadoAcciones.find(estado => estado.id === id);
  }
  // fin funciones reporte objetivos

}


