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

interface PorcentajeLogrado {
  idObjetivo: number;
  objetivo: string,
  pesoObjetivo: number,
  porcentajeLogrado: number;
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

  accionesObjetivos: any[] = [];
  objetivosUsuario: any[] = [];
  calificacion: any[] = [];
  sumaTotalPorcentajeLogrado: number = 0; 
  graficaPorcentajeLogrado: genericGraficaPie[] = [] ;
  graficaPorcentajeGeneral: genericGraficaPie[] = [] ;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { 

  //  Object.assign(this, { single });
  }

  ngOnInit(): void {
    this.cargarListas();
  }
  
  //single: any[] = [];
   reportePorcentajeLogrado = [
    {
      "name": "Certificaciones",
      "value": 22.5
    },
    {
      "name": "Puntualidad",
      "value": 30
    },
    {
      "name": "Informes",
      "value": 30
    }
  ];
  view: [number,number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme:any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
 

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  async cargarListas() {
    const idusuario = Number(localStorage.getItem('SEUID'));
    await this.cargaAccionesObjetivosxUser(idusuario);
    await this.cargaObjetivosxUser(idusuario);
    await this.cargarReporte();
  }

  async cargaAccionesObjetivosxUser(idusuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loginServices.getAccionesObjetivosxIdusuario<any>('AccionesObjetivos/xIduser', idusuario)
        .subscribe((respuesta: ApiResponse<any>) => {
          this.accionesObjetivos = respuesta.data;
          console.log(this.accionesObjetivos);
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
          console.log(this.objetivosUsuario);
          resolve(this.objetivosUsuario);
        }, error => {
          reject(error);
        });
    });
  }


  async cargarReporte() {
    this.graficaPorcentajeLogrado = []
    this.graficaPorcentajeGeneral = []
    const calificacionesPromedioPorObjetivo: { idObjetivo: number; nombre: string, peso: number, promedioCalificaciones: number }[] = [];

    this.objetivosUsuario.forEach(objetivo => {
      const accionesObjetivo = this.accionesObjetivos.filter(accion => accion.idObjetivo === objetivo.id);
      const totalCalificaciones = accionesObjetivo.reduce((acc, accion) => acc + accion.calificacion, 0);
      const promedioCalificaciones = accionesObjetivo.length > 0 ? totalCalificaciones / accionesObjetivo.length : 0;
      calificacionesPromedioPorObjetivo.push({ idObjetivo: objetivo.id, nombre: objetivo.titulo, peso: objetivo.peso, promedioCalificaciones });
    });
    console.log(calificacionesPromedioPorObjetivo);
    const porcentajeObjetivosCompletados: { idObjetivo: number; porcentajeCompletado: number }[] = [];
    let sumaTotalPorcentajeLogrado = 0; 
    const calcularPorcentajeLogrado = (): PorcentajeLogrado[] => {
      const porcentajeLogrado: PorcentajeLogrado[] = [];

      this.objetivosUsuario.forEach(objetivo => {
        const accionesObjetivo = this.accionesObjetivos.filter(accion => accion.idObjetivo === objetivo.id);
        const calificacionTotal = accionesObjetivo.reduce((acc, accion) => acc + accion.calificacion, 0);
        const porcentajeTotal = ((calificacionTotal / accionesObjetivo.length) / 100) * objetivo.peso; // Calculamos el porcentaje total basado en el peso
        sumaTotalPorcentajeLogrado += porcentajeTotal; 
        this.graficaPorcentajeLogrado.push({name: objetivo.titulo , value:porcentajeTotal });
        this.graficaPorcentajeGeneral.push({name: objetivo.titulo , value:objetivo.peso });
        //this.graficaPorcentajeGeneral.push({name: objetivo.titulo , value: objetivo.peso });
        porcentajeLogrado.push({ idObjetivo: objetivo.id, objetivo: objetivo.titulo, pesoObjetivo: objetivo.peso, porcentajeLogrado: porcentajeTotal });
      });

      return porcentajeLogrado;
    };
    const porcentajeLogrado = calcularPorcentajeLogrado();    
    this.calificacion = porcentajeLogrado;
    this.sumaTotalPorcentajeLogrado = sumaTotalPorcentajeLogrado
    console.log(this.calificacion);
    console.log(this.sumaTotalPorcentajeLogrado);
  }


}
