import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReqEmpresas } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  empresas: any[] = [];
  estado: any;
  empresa: any[] = [];
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  empresaToEdit = false;
  rutaApi = 'Empresas';

  empresasForm: FormGroup = this.fb.group({
    empresaId: [0, []],
    nombre: ['', Validators.required],
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
      this.empresas = respuesta.data;
    });
  }

  LimpiarFormulario() {
    this.empresasForm.get('empresaId')?.setValue(0);
    this.empresasForm.get('nombre')?.setValue('');
    this.empresasForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.empresaToEdit = false;

  }
 
  eliminarEmpresas(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Usuarios asociados a este rol" : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then(res => {
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
    const body: ReqEmpresas = {
      empresaId: this.empresasForm.get('empresaId')?.value,
      nombre: this.empresasForm.get('nombre')?.value,
      estado: this.empresasForm.get('estado')?.value == "true" ? true : false,
    };

    if (this.validarcampos()) {
      let resp = this.empresaToEdit == true ? this.ActualizarEmpresas(body) : this.CrearEmpresas(body)
    }
  }
 
  validarcampos() {
    if (!this.empresasForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }
  ActualizarEmpresas(body: ReqEmpresas) {
    this.loginServices.UpdateData(this.rutaApi, this.empresa[0].empresaId, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then(res => {
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

  CrearEmpresas(body: ReqEmpresas) {
    this.canva = true
    this.loginServices.createData(this.rutaApi, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then(res => {
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

  editarEmpresas(id: number) {
    this.empresaToEdit = true;
    this.empresa = this.empresas.filter(x => x.empresaId == id);
    this.empresasForm.get('empresaId')?.setValue(this.empresa[0].empresaId);
    this.empresasForm.get('empresaId')?.setValue(this.empresa[0].empresaId);
    this.empresasForm.get('nombre')?.setValue(this.empresa[0].nombre);
    this.empresasForm.get('descripcion')?.setValue(this.empresa[0].descripcion);
    this.empresasForm.get('estado')?.setValue(this.empresa[0].estado);
  }

}
