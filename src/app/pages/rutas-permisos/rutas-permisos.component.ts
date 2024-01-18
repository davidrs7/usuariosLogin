import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReqPermisos } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas-permisos',
  templateUrl: './rutas-permisos.component.html',
  styleUrls: ['./rutas-permisos.component.scss']
})
export class RutasPermisosComponent implements OnInit {

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }
  permisos: any[] = [];
  permiso: any; 
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  permisoToEdit = false;
  rutaApi = 'Permisos';

  permisosForm: FormGroup = this.fb.group({
    permisoid: [0, []],
    nombre: ['', Validators.required],
    descripcion: ['', []],
    rutaangular: ['', []],
    estado: [true, []],
  });

  ngOnInit(): void {
    this.cargarLista();

  }
  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  cargarLista(): void {
    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.permisos = respuesta.data;
    });
    console.log(this.permisos);
  }

  editarPermisos(id: number) { 
    this.permisoToEdit = true;
    this.permiso = this.permisos.filter(x => x.permisoId == id);
    console.log(this.permiso[0])   
    this.permisosForm.get('nombre')?.setValue(this.permiso[0].nombre);
    this.permisosForm.get('descripcion')?.setValue(this.permiso[0].descripcion);
    this.permisosForm.get('rutaangular')?.setValue(this.permiso[0].rutaAngular);
    this.permisosForm.get('estado')?.setValue(this.permiso[0].estado);
  }

  eliminarPermisos(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Permisos asociados a un rol" : respuesta.estado.descripcion,
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

  guardaEmpresas() {
    const body: ReqPermisos = {
      permisoId: this.permisosForm.get('permisoid')?.value,
      nombre: this.permisosForm.get('nombre')?.value,
      descripcion: this.permisosForm.get('descripcion')?.value,
      rutaAngular: this.permisosForm.get('rutaangular')?.value,
      estado: this.permisosForm.get('estado')?.value == "true" ? true : false,
    };

    if (this.validarcampos()) {
      let resp = this.permisoToEdit == true ? this.ActualizarPermisos(body) : this.CrearPermisos(body)
    }
  }


  ActualizarPermisos(body: ReqPermisos) {
    this.loginServices.UpdateData(this.rutaApi, this.permiso[0].permisoId, body)
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

  CrearPermisos(body: ReqPermisos) {
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

  validarcampos() {
    if (!this.permisosForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }

  LimpiarFormulario() {
    this.permisosForm.get('permisoid')?.setValue(0);
    this.permisosForm.get('nombre')?.setValue('');
    this.permisosForm.get('descripcion')?.setValue('');
    this.permisosForm.get('rutaangular')?.setValue('');
    this.permisosForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.permisoToEdit = false;
  }


}
