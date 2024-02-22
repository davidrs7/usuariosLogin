import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { reqObjetivos } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from "sweetalert2"


@Component({
  selector: 'app-admin-objetivos',
  templateUrl: './admin-objetivos.component.html',
  styleUrls: ['./admin-objetivos.component.scss']
})
export class AdminObjetivosComponent implements OnInit {

  Objetivos: any[] = [];
  Objetivo: any = {};
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  cargoToEdit = false;
  rutaApi = 'Objetivos';

  ObjetivosForm: FormGroup = this.fb.group({
    id: [0, []],
    titulo: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    peso: [0, [Validators.required]],
    fechainicio: [this.obtenerFechaActual(), Validators.required],
    fechafin: ['', Validators.required],
    estado: [true, []],
  });

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarLista();
  }

  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  cargarLista(): void {
    const idusuario = Number(localStorage.getItem("SEUID"));
    this.loginServices.getObjetivosbyId<any>(this.rutaApi, idusuario).subscribe((respuesta: ApiResponse<any>) => {
      this.Objetivos = respuesta.data;
    });
  }

  editarObjetivos(id: number) {
    this.cargoToEdit = true;
    this.Objetivo = this.Objetivos.filter(x => x.id == id);
    console.log(this.Objetivo)
    this.ObjetivosForm.get('id')?.setValue(this.Objetivo[0].id);
    this.ObjetivosForm.get('titulo')?.setValue(this.Objetivo[0].titulo);
    this.ObjetivosForm.get('descripcion')?.setValue(this.Objetivo[0].descripcion);
    this.ObjetivosForm.get('peso')?.setValue(this.Objetivo[0].peso);
    this.ObjetivosForm.get('fechainicio')?.setValue(this.convertirFormatoFecha(this.Objetivo[0].fechaInicio));
    this.ObjetivosForm.get('fechafin')?.setValue(this.convertirFormatoFecha(this.Objetivo[0].fechaFin));
    this.ObjetivosForm.get('estado')?.setValue(this.Objetivo[0].estado);
  }

  eliminarObjetivos(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Objetivo asociado a usuarios." : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
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

  guardaObjetivos() {
    const body: reqObjetivos = {
      id: this.ObjetivosForm.get('id')?.value,
      idUsuario: Number(localStorage.getItem("SEUID")),
      titulo: this.ObjetivosForm.get('titulo')?.value,
      descripcion: this.ObjetivosForm.get('descripcion')?.value,
      peso: this.ObjetivosForm.get('peso')?.value,
      fechainicio: this.ObjetivosForm.get('fechainicio')?.value,
      fechafin: this.ObjetivosForm.get('fechafin')?.value,
      estado: Boolean(JSON.parse(this.ObjetivosForm.get('estado')?.value)),
    };

    if (this.validarcampos() && this.calculaPesos(body)) {
      let resp = this.cargoToEdit == true ? this.ActualizarObjetivos(body) : this.CrearObjetivos(body)
    }
  }

  calculaPesos(body: any) {

    let sumaPesos = 0;
    debugger;
    for (let i = 0; i < this.Objetivos.length; i++) {
      if (this.Objetivos[i].id != body.id) {
        sumaPesos = sumaPesos + this.Objetivos[i].peso;
      }
    }
    sumaPesos = sumaPesos + body.peso;

    if (sumaPesos > 100) {
      Swal.fire({
        icon: 'info',
        title: 'La suma de los pesos no puede superar el 100 %',
        text: ''
      });
      return false;

    } else {
      return true;
    }
  }

  validarcampos() {

    if (!this.ObjetivosForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }

  ActualizarObjetivos(body: reqObjetivos) {
    console.log(body);
    this.loginServices.UpdateData(this.rutaApi, this.Objetivo[0].id, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
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

  CrearObjetivos(body: reqObjetivos) {
    if (this.Objetivos.length < 5) {
      this.canva = true
      this.loginServices.createData(this.rutaApi, body)
        .subscribe(
          (respuesta: ApiResponse<any>) => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje: ' + respuesta.estado.descripcion,
              text: 'Codigo: ' + respuesta.estado.codigo
            }).then((res: any) => {
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
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Mensaje: No puedes crear mas de 5 objetivos ',
        text: ''
      })
    }

  }

  LimpiarFormulario() {
    this.ObjetivosForm.get('id')?.setValue(0);
    this.ObjetivosForm.get('titulo')?.setValue('');
    this.ObjetivosForm.get('descripcion')?.setValue('');
    this.ObjetivosForm.get('peso')?.setValue('');
    this.ObjetivosForm.get('fechainicio')?.setValue('');
    this.ObjetivosForm.get('fechafin')?.setValue('');
    this.ObjetivosForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.cargoToEdit = false;
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
