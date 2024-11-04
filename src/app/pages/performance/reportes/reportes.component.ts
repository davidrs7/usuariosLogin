import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReqCargos, reqAccionesObjetivos, reqObjetivos } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2"


interface PorcentajeLogrado {
  idObjetivo: number;
  objetivo: string,
  pesoObjetivo: number,
  porcentajeLogrado: number;
}
interface reportesCompetencia {
  id: number;
  id_pregunta: number;
  id_respuesta: number;
  id_usuario_califica: number;
  id_usuario_calificado: number;
  comentarios: string;
  fecha_accion: string;
}

interface genericGraficaPie {
  name: string,
  value: number
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})


export class ReportesComponent implements OnInit {
  @ViewChild('chart') chart!: ElementRef;

  // objetivos
  accionesObjetivos: any[] = [];
  objetivosUsuario: any[] = [];
  calificacion: any[] = [];
  sumaTotalPorcentajeLogrado: number = 0;
  graficaPorcentajeLogrado: genericGraficaPie[] = [];
  graficaPorcentajeGeneral: genericGraficaPie[] = [];
  //competencias
  graficaCompetencias: genericGraficaPie[] = [];
  competencias: any[] = [];
  preguntas: any[] = [];
  respuestasCompetencias: any[] = []
  //report
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  reportesCompetencia: any;
  reportesCompetencias: any[] = [];
  opcionesrespuesta: any[] = [];
  usuario: any = {};

  //bar- horizontal
  // Configuración del gráfico
  viewHor: [number, number] = [600, 300];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Calificación';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Competencia';
  nombreUsuario: any;


  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) {
  }

  ngOnInit(): void {
    this.cargarListas();
  }

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
   //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
     //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  async cargarListas() {
    const idusuario = Number(localStorage.getItem('SEUID'));

    //usuario
    await this.cargarUsuario(idusuario);

    //objetivos
    await this.cargaAccionesObjetivosxUser(idusuario);
    await this.cargaObjetivosxUser(idusuario);
    await this.cargarReporte();
    // competencias
    await this.cargarOpcionesRespuesta();
    await this.cargarCompetencias(); // carga competencias parametrizadas por la compañia
    await this.cargarPreguntas(); // carga preguntas globales de la compañía
    await this.cargarRespuestasComp(idusuario); // carga respuestas de la evaluación de competencias
    await this.calcularCompetencias();
  }

  async cargarUsuario(idusuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.getDatabyId<any>('User',idusuario)
        .subscribe((respuesta: ApiResponse<any>) => {
          this.usuario = respuesta.data;
          resolve(this.usuario);
        }, error => {
          reject(error);
        });
    });
  }


  async cargarOpcionesRespuesta(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.GetAllData<any>('opciones_respuesta')
        .subscribe((respuesta: ApiResponse<any>) => {
          this.opcionesrespuesta = respuesta.data;
          resolve(this.opcionesrespuesta);
        }, error => {
          reject(error);
        });
    });
  }

  //competencias
  async cargarRespuestasComp(idusuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.getDatabyId<any>('respuestas_usuario', idusuario)
        .subscribe((respuesta: ApiResponse<any>) => {
          this.respuestasCompetencias = respuesta.data;
          resolve(this.respuestasCompetencias);
        }, error => {
          reject(error);
        });
    });
  }

  async cargarCompetencias(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.GetAllData<any>('Competencias')
        .subscribe((respuesta: ApiResponse<any>) => {
          this.competencias = respuesta.data;
          resolve(this.competencias);
        }, error => {
          reject(error);
        });
    });
  }

  async cargarPreguntas(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.GetAllData<any>('Preguntas')
        .subscribe((respuesta: ApiResponse<any>) => {
          this.preguntas = respuesta.data;
          resolve(this.preguntas);
        }, error => {
          reject(error);
        });
    });
  }

  //objetivos

  async cargaAccionesObjetivosxUser(idusuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.getAccionesObjetivosxIdusuario<any>('AccionesObjetivos/xIduser', idusuario)
        .subscribe((respuesta: ApiResponse<any>) => {
          this.accionesObjetivos = respuesta.data;
          resolve(this.accionesObjetivos);
        }, error => {
          reject(error);
        });
    });
  }


  async cargaObjetivosxUser(idusuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.getObjetivosbyId<any>('Objetivos', idusuario)
        .subscribe((respuesta: ApiResponse<any>) => {
          this.objetivosUsuario = respuesta.data;
          resolve(this.objetivosUsuario);
        }, error => {
          reject(error);
        });
    });
  }


  async cargarReporte() {
    this.graficaPorcentajeLogrado = [];
    this.graficaPorcentajeGeneral = [];
    this.graficaCompetencias = [];
    this.calcularPorcentajeLogrado();

  }

  calcularPorcentajeLogrado = (): PorcentajeLogrado[] => {
    const porcentajeLogrado: PorcentajeLogrado[] = [];
    let sumaTotalPorcentajeLogrado = 0;
    this.objetivosUsuario.forEach(objetivo => {
      const accionesObjetivo = this.accionesObjetivos.filter(accion => accion.idObjetivo === objetivo.id);

      const calificacionTotal =   accionesObjetivo.reduce((acc, accion) => acc + accion.calificacion , 0);
      const numCalifObjetivos = accionesObjetivo.length > 0 ? accionesObjetivo.length : 1;
      const porcentajeTotal = ((calificacionTotal / numCalifObjetivos) / 100) * objetivo.peso; // Calculamos el porcentaje total basado en el peso
      sumaTotalPorcentajeLogrado += porcentajeTotal;
      this.graficaPorcentajeLogrado.push({ name: objetivo.titulo , value: porcentajeTotal });
      this.graficaPorcentajeGeneral.push({ name: objetivo.titulo, value: objetivo.peso });
      porcentajeLogrado.push({ idObjetivo: objetivo.id, objetivo: objetivo.titulo, pesoObjetivo: objetivo.peso, porcentajeLogrado: porcentajeTotal });
    });

    this.calificacion = porcentajeLogrado;
    this.sumaTotalPorcentajeLogrado = sumaTotalPorcentajeLogrado
    return porcentajeLogrado;
  };


  async calcularCompetencias() {
    const reportesCompetencia: any[] = [];
    this.graficaCompetencias = [];

    this.competencias.forEach(competencia => {
      const preguntasCompetencia = this.preguntas.filter(pregunta => pregunta.idcompetencia === competencia.id);

      const respuestasCompetencia = this.respuestasCompetencias.filter(respuesta =>
        preguntasCompetencia.some(pregunta => pregunta.id === respuesta.id_pregunta)
      );


      const calificacionPromedio = respuestasCompetencia.reduce((total, respuesta) => total + this.consultarPesoRta(respuesta.id_respuesta), 0) / respuestasCompetencia.length;

      const porcentajeLogrado = (calificacionPromedio / 5) * 100;

      this.graficaCompetencias.push({ name: competencia.competencia, value: porcentajeLogrado });

      reportesCompetencia.push({
        idusuario: this.respuestasCompetencias[0].id_usuario_calificado, // Reemplazar con el ID de usuario correspondiente
        competencia: competencia.competencia,
        calificacion: calificacionPromedio,
        porcentajeLogrado: porcentajeLogrado
      });
    });
    this.reportesCompetencias = this.filterData(reportesCompetencia);
  }

  exportarObjetivosExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.calificacion);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'objetivos');
    XLSX.writeFile(wb, 'objetivos.xlsx');
  }

  exportarCompetenciasExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportesCompetencias);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'competencias');
    XLSX.writeFile(wb, 'competencias.xlsx');
  }

  filterData = (data: any[]) => {
    return data.filter(item => item.name !== 'Total');
  };

  consultarPesoRta(idrespuesta: number) {

    let respuesta = this.opcionesrespuesta.filter((x: any) => x.id == idrespuesta)[0].peso;
    return respuesta || 0
  }

  exportToPdfCompetencias(){
    window.print();
  }

}
