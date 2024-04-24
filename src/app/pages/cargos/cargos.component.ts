import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReqCargos } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import  Swal  from "sweetalert2"

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit {
  cargos: any[] = [];
  cargo: any[] = [];
  estado: any;
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  cargoToEdit = false;
  rutaApi = 'Cargos';

  cargoForm: FormGroup = this.fb.group({
    cargoId: [0, []],
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    empresaid: [0, [Validators.required]],
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
    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.cargos = respuesta.data;
    });
  }

  editarcargos(id: number) {
    this.cargoToEdit = true;
    this.cargo = this.cargos.filter(x => x.cargoId == id); 
    this.cargoForm.get('cargoId')?.setValue(this.cargo[0].cargoId);
    this.cargoForm.get('empresaId')?.setValue(this.cargo[0].empresaId);
    this.cargoForm.get('nombre')?.setValue(this.cargo[0].nombre);
    this.cargoForm.get('descripcion')?.setValue(this.cargo[0].descripcion);
    this.cargoForm.get('estado')?.setValue(this.cargo[0].estado);
  }

  eliminarCargos(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
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

  LimpiarFormulario() {
    this.cargoForm.get('rolId')?.setValue(0);
    this.cargoForm.get('empresaId')?.setValue(0);
    this.cargoForm.get('nombre')?.setValue('');
    this.cargoForm.get('descripcion')?.setValue('');
    this.cargoForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.cargoToEdit = false;
  }

  guardaCargos() {
    const body: ReqCargos = {
      cargoId: this.cargoForm.get('cargoId')?.value,
      nombre: this.cargoForm.get('nombre')?.value,
      descripcion: this.cargoForm.get('descripcion')?.value,
      empresaId: 1, //this.roleForm.get('empresaId')?.value,
      estado: this.cargoForm.get('estado')?.value == "true" ? true : false,
    };

    if (this.validarcampos()) {
      let resp = this.cargoToEdit == true ? this.ActualizarCargos(body) : this.CrearCargos(body)
    }
  }

  validarcampos() {
    if (!this.cargoForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }

  ActualizarCargos(body: ReqCargos) {
    this.loginServices.UpdateData(this.rutaApi, this.cargo[0].cargoId, body)
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

  CrearCargos(body: ReqCargos) {
    this.canva = true
    this.loginServices.createData(this.rutaApi, body)
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
