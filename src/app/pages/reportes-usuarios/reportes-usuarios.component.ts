import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import Swal from 'sweetalert2';
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
  archivoObjetivos: File | null = null ;
  canva: boolean = false;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarlista();
  }

  cargarlista(){
      //usuarios
      this.loginServices.GetAllData<any>('User').subscribe((respuesta: ApiResponse<any>) => {
        this.usuarios = respuesta.data; 
      console.log(this.usuarios)

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
      this.objetivos = respuesta.data; 
      console.log(this.objetivos)
    });

    this.loginServices.GetAllData<any>('AccionesObjetivos').subscribe((respuesta: ApiResponse<any>) => {
      this.accionesObjetivos = respuesta.data; 
      console.log(this.accionesObjetivos)

    });

    this.loginServices.GetAllData<any>('EstadoAcciones').subscribe((respuesta: ApiResponse<any>) => {
      this.estadoAcciones = respuesta.data; 
      console.log(this.estadoAcciones)

    });
  }

  activaReport(accion: number) {
    this.accion = accion;

    if (accion == 1) { this.cargarlistasObjetivos();}
  }

  generarReporte() {
    // objetivos
    if (this.accion == 1) { this.generarReporteObjetivos(); }
    if (this.accion == 2) { this.cargueObjetivos('Objetivos/cargar-objetivos'); }
    // competencias
    if (this.accion == 3 || this.accion == 4 ) { this.cargueObjetivos('AccionesObjetivos/cargar-acciones'); }
 
  }


  generarReporteObjetivos() {
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
          objetivo:  this.encontrarObjetivoPorId(accion.idObjetivo).titulo || '',
          descripcion: objetivo ? objetivo.descripcion : '',
          peso: objetivo ? objetivo.peso : 0,
          accion: accion.descripcion,
          estado: estadoAccion ? estadoAccion.estado : '',
          calificacion: accion.calificacion || 0
        });
      });

      
        // Si el usuario no tiene acciones, agregar una entrada en el reporte
        if (acciones.length === 0) {
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
              accion: '',
              estado: '',
              calificacion: 0
          });
      }
    });


    console.log(reporteObjetivos);

    const reporteFiltrado = this.aplicarfiltro(Number(optionSeleccionadoId),reporteObjetivos);
    
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reporteFiltrado);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'objetivos');
    XLSX.writeFile(wb, 'objetivos.xlsx'); 
  }

  aplicarfiltro(filtro: number,reporte: any){
    var reporteFiltrado: any[] = [];

    switch (filtro) { 
      case 2: // Sin objetivos
          reporteFiltrado = reporte.filter((item:any) => item.objetivo === '');
          break;
      case 3: // Sin acciones
          reporteFiltrado = reporte.filter((item:any) => item.accion === '');
          break;
      case 4: // Sin calificación
          reporteFiltrado = reporte.filter((item:any) => item.calificacion === 0);
          break;
      case 5: // Calificados
          reporteFiltrado = reporte.filter((item:any) => item.calificacion > 0);
          break;
      default:
          reporteFiltrado = [...reporte];
          break;
  }



    return reporteFiltrado;
  }

  generarReportCompetencias() {
  }

  cargueObjetivos(rutaApi: string) {

    const inputElement = <HTMLInputElement>document.getElementById('archivo');
    if (inputElement.files && inputElement.files.length > 0) {
      this.archivoObjetivos = inputElement.files[0];
    }
    if (this.archivoObjetivos !== null && this.validarArchivo(this.archivoObjetivos)) { 
      const fd = new FormData();
      fd.append('file', this.archivoObjetivos, this.archivoObjetivos.name);
      console.log(fd);       
      this.canva = true;
      this.loginServices.cargaMasivaUsers(rutaApi,fd).subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title:  respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
            //this.LimpiarFormulario();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          //this.LimpiarFormulario();
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'error: ' ,
        text: 'Por favor selecciona un archivo valido (.csv) '  
      }).then((res:any) => {
        return;
      });
    }



  }

  validarArchivo(archivo: File): boolean{
    let archivoValido = true; 

    if (archivo.type != "text/csv"){
        archivoValido = false 
    }

    return archivoValido;


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
    return this.objetivos.find(objetivo => objetivo.id === id);
  }

  encontrarAccionesObjetivoPorId(id: number) {
    return this.accionesObjetivos.filter(accion => accion.idUsuario === id);
  }

  encontrarEstadoAccionPorId(id: number) {
    return this.estadoAcciones.find(estado => estado.id === id);
  }
  // fin funciones reporte objetivos

}


