import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { reqrolespermisos } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})


export class PermisosComponent implements OnInit {

  Permisos: any[] = [];
  Permiso: any;
  rolesPermisos: any[] = [];
  rolPermiso: any;
  roles: any[] = [];
  rol: any;
  rolPermisosTable: RolPermisoTable[] = [];
  rolPermisoTable: RolPermisoTable = {
    rolpermisoId: 0,
    check: false,
    rolid: 0,
    permisoid: 0,
    Nombre: "",
    descripcion: ""
  };
  empresa: any[] = [];
  canva: boolean = false;
  p_Size = 10;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  empresaToEdit = false;
  rolSeleccionado = false;
  PermisosForm: FormGroup = this.fb.group({
    rolPermisoId: [0, []],
    rolId: [0, Validators.required],
    permisoId: [0, Validators.required],
  });
  idrol = 0;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarLista();
  }
  onChange(event: any) { 
    this.idrol = this.PermisosForm.get('rolId')?.value
    if (event.check && event.rolpermisoId > 0) {
      this.eliminarRolPermisos(event.rolpermisoId, event.rolid);
      this.rolSelect(0)

    } else {
      var rolesPermisos: reqrolespermisos = {
        rolpermisoid: 0,
        rolid: Number(event.rolid),
        permisoid: Number(event.permisoid),
      }
      this.CrearUsuarios(rolesPermisos);
      this.rolSelect(0)

    }

  }

  eliminarRolPermisos(rolpermisoId: number, rolid: number) {
    this.loginServices.eliminarDato('rolesPermisos', rolpermisoId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          this.cargarRolesPermisos()
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error eliminando permisos" : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
            this.rolSelect(rolid)
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
        }
      );
  }

  CrearUsuarios(body: any) {
    //this.canva = true
    this.loginServices.createData('rolesPermisos', body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          this.cargarRolesPermisos()
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
            this.rolSelect(body.rolid);
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          // this.LimpiarFormulario();
        }
      );

  }

  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  async rolSelect(event: any) {

    this.idrol = this.PermisosForm.get('rolId')?.value
    this.rolPermisosTable = [];
    const selectedValue = event?.target?.value;
    this.rolSeleccionado = true;
    let premisosRol = this.rolesPermisos.filter(x => x.rolID == this.idrol);

    for (let i = 0; i < this.Permisos.length; i++) { 
      let check = false
      let rolPermisoId: any;

      for (let x = 0; x < premisosRol.length; x++) {
        if (this.Permisos[i].permisoId == premisosRol[x].permisoID) {
          check = true
          rolPermisoId = premisosRol[x].rolPermisoId
        };
      }

      let nuevoRolPermisoTable: RolPermisoTable = {
        rolpermisoId: rolPermisoId || 0,
        check: check,
        rolid: this.idrol,
        permisoid: this.Permisos[i].permisoId,
        Nombre: this.Permisos[i].nombre,
        descripcion: this.Permisos[i].descripcion
      }
      this.rolPermisosTable.push(nuevoRolPermisoTable);
    }
  }

  async cargarLista() {
    this.loginServices.GetAllData<any>('Permisos').subscribe((respuesta: ApiResponse<any>) => {
      this.Permisos = respuesta.data;
    });

    this.loginServices.GetAllData<any>('Roles').subscribe((respuesta: ApiResponse<any>) => {
      this.roles = respuesta.data;
    });
    await this.cargarRolesPermisos();

  }

  cargarRolesPermisos() {
    this.loginServices.GetAllData<any>('rolesPermisos').subscribe((respuesta: ApiResponse<any>) => {
      this.rolesPermisos = respuesta.data;
    });

  }


}

interface RolPermisoTable {
  rolpermisoId: number;
  check: boolean;
  rolid: number;
  permisoid: number;
  Nombre: string;
  descripcion: string;
}
