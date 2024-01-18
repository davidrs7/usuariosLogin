import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'; 
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReqRoles } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2'; 



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  estado: any;
  rol: any[] = [];
  canva: boolean = false;

  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  roleToEdit = false;
  rutaApi = 'Roles';
  roleForm: FormGroup = this.fb.group({
    rolId: [0, []],
    empresaId: [0, []],
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    estado: [true, []],
  }  );
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
      this.roles = respuesta.data;
    });
  }

  eliminarRoles(rolesId: number) {
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

  guardaRoles() {
    const body: ReqRoles = {
      rolId: this.roleForm.get('rolId')?.value,
      nombre: this.roleForm.get('nombre')?.value,
      descripcion: this.roleForm.get('descripcion')?.value,
      empresaId: 1, //this.roleForm.get('empresaId')?.value,
      estado: this.roleForm.get('estado')?.value == "true" ? true : false,
    };

    if (this.validarcampos()) {
      let resp = this.roleToEdit == true ? this.ActualizarRoles(body) : this.CrearRoles(body)
    }
  }



  validarcampos() {
    if (!this.roleForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }
  ActualizarRoles(body: ReqRoles) {
    this.loginServices.UpdateData(this.rutaApi, this.rol[0].rolId, body)
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

  CrearRoles(body: ReqRoles) {
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

  editarRoles(rolesId: number) {
    this.roleToEdit = true;
    this.rol = this.roles.filter(x => x.rolId == rolesId);
    this.roleForm.get('rolId')?.setValue(this.rol[0].rolId);
    this.roleForm.get('empresaId')?.setValue(this.rol[0].empresaId);
    this.roleForm.get('nombre')?.setValue(this.rol[0].nombre);
    this.roleForm.get('descripcion')?.setValue(this.rol[0].descripcion);
    this.roleForm.get('estado')?.setValue(this.rol[0].estado == "true" ? true : false);
  }

  LimpiarFormulario() {
    this.roleForm.get('rolId')?.setValue(0);
    this.roleForm.get('empresaId')?.setValue(0);
    this.roleForm.get('nombre')?.setValue('');
    this.roleForm.get('descripcion')?.setValue('');
    this.roleForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.roleToEdit = false;

  }



}
